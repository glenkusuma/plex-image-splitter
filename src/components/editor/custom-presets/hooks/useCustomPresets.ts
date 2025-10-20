import { useEffect, useState } from 'react';

import { useEditor } from '@/store/editor';

import type { NamedPreset, PendingAction, Toast, ToastKind } from '../types';
import { now, PRESETS_KEY, uid } from '../types';

export type RenameState = {
  target: NamedPreset | null;
  value: string;
  conflict: null | { name: string };
  setValue: (s: string) => void;
  setTarget: (p: NamedPreset | null) => void;
  setConflict: (c: null | { name: string }) => void;
};

export function useCustomPresets() {
  const { state, dispatch } = useEditor();

  const [presets, setPresets] = useState<NamedPreset[]>([]);
  const [newName, setNewName] = useState('');
  const [showLauncher, setShowLauncher] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);
  const [renameTarget, setRenameTarget] = useState<NamedPreset | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameConflict, setRenameConflict] = useState<null | { name: string }>(
    null
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PRESETS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<
        Partial<NamedPreset> & { order?: number; updatedAt?: number }
      >;
      if (Array.isArray(parsed)) {
        // Backfill missing order and sort by order asc
        const withOrder = parsed.map(
          (p, idx): NamedPreset => ({
            id: String(p.id || uid()),
            name: String(p.name || 'Preset'),
            data: (p as NamedPreset).data,
            order: typeof p.order === 'number' ? p.order : idx,
            createdAt: Number(p.createdAt || now()),
            updatedAt: Number(p.updatedAt || p.createdAt || now()),
          })
        );
        const sorted = [...withOrder].sort((a, b) => a.order - b.order);
        setPresets(sorted);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Presets] Failed to load', e);
    }
  }, []);

  const persist = (
    list: NamedPreset[] | ((prev: NamedPreset[]) => NamedPreset[])
  ) => {
    const next =
      typeof list === 'function'
        ? (list as (p: NamedPreset[]) => NamedPreset[])(presets)
        : list;
    // Ensure stable rendering order
    const sorted = [...next].sort((a, b) => a.order - b.order);
    setPresets(sorted);
    try {
      window.localStorage.setItem(PRESETS_KEY, JSON.stringify(sorted));
    } catch {
      /* ignore persist error */
    }
  };

  const showToast = (
    message: string,
    kind: ToastKind = 'success',
    ttl = 2600
  ) => {
    const id = uid();
    setToasts((t) => [...t, { id, kind, message }]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      ttl
    );
  };

  const toPresetData = () => ({
    version: 1,
    horizontalSplit: state.horizontalSplit,
    verticalSplit: state.verticalSplit,
    guidesVisible: state.guidesVisible,
    guideColor: state.guideColor,
    guideColorH: state.guideColorH,
    guideColorV: state.guideColorV,
    selectedGuideColor: state.selectedGuideColor,
    selectedGuideAlpha: state.selectedGuideAlpha,
    guideAlphaH: state.guideAlphaH,
    guideAlphaV: state.guideAlphaV,
    guideThicknessH: state.guideThicknessH,
    guideThicknessV: state.guideThicknessV,
    snapEnabled: state.snapEnabled,
    snapPx: state.snapPx,
  });

  const exportCurrentState = () => {
    const data = {
      meta: { tool: 'plex-image-splitter', kind: 'preset', version: 1 },
      preset: {
        id: uid(),
        name: (newName || 'Preset ' + (presets.length + 1)).trim(),
        data: toPresetData(),
        createdAt: now(),
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'preset-current.json';
    a.click();
    showToast('Exported current state', 'info');
  };

  const importPresetFromFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        type RawPreset = Partial<NamedPreset> & {
          data?: Partial<ReturnType<typeof toPresetData>>;
          updatedAt?: number;
        };
        const obj = parsed as
          | { preset?: RawPreset; presets?: RawPreset[] }
          | RawPreset;
        let arr: RawPreset[] = [];
        if (
          obj &&
          typeof obj === 'object' &&
          'presets' in (obj as Record<string, unknown>) &&
          Array.isArray((obj as { presets?: RawPreset[] }).presets)
        ) {
          arr = (obj as { presets: RawPreset[] }).presets || [];
        } else if (
          obj &&
          typeof obj === 'object' &&
          'preset' in (obj as Record<string, unknown>)
        ) {
          const p = (obj as { preset?: RawPreset }).preset;
          if (p) arr = [p];
        } else {
          arr = [obj as RawPreset];
        }
        const normalized: NamedPreset[] = arr.map((item) => {
          const d = (item?.data || {}) as Record<string, unknown>;
          return {
            id: item.id || uid(),
            name: String(item.name || 'Preset'),
            data: { ...d, version: 1 } as unknown as ReturnType<
              typeof toPresetData
            >,
            createdAt: Number(item.createdAt || now()),
            // Placeholder; will be assigned when inserting
            order: -1,
            updatedAt: Number(item.updatedAt ?? item.createdAt ?? now()),
          };
        });
        const names = new Set(presets.map((p) => p.name));
        const duplicates = normalized.filter((n) => names.has(n.name));
        const uniques = normalized.filter((n) => !names.has(n.name));
        if (duplicates.length)
          setPendingAction({
            kind: 'importConfirm',
            payload: { toAdd: uniques, duplicates },
          });
        else {
          const next = [...presets, ...normalized];
          persist(next);
          showToast(
            `Imported ${normalized.length} preset${
              normalized.length !== 1 ? 's' : ''
            }`,
            'success'
          );
        }
      } catch (e) {
        showToast('Failed to import presets: ' + (e as Error).message, 'error');
      }
    };
    reader.readAsText(f);
  };

  const onApplyPreset = (data: NamedPreset['data']) =>
    dispatch({ type: 'APPLY_PRESET', payload: { data } });

  const renameState: RenameState = {
    target: renameTarget,
    value: renameValue,
    conflict: renameConflict,
    setValue: setRenameValue,
    setTarget: setRenameTarget,
    setConflict: setRenameConflict,
  };

  return {
    // editor state flags used by UI
    editorActive: state.active,
    editorExporting: state.exporting,

    // presets + persistence
    presets,
    persist,

    // ui states
    newName,
    setNewName,
    showLauncher,
    setShowLauncher,
    openModal,
    setOpenModal,
    fullscreen,
    setFullscreen,
    pendingAction,
    setPendingAction,
    busy,
    setBusy,
    toasts,
    setToasts,

    // actions
    toPresetData,
    onApplyPreset,
    showToast,
    exportCurrentState,
    importPresetFromFile,

    // rename
    renameState,
  };
}
