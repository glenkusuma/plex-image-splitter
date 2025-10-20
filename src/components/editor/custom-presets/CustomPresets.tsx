import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/buttons/Button';

import { useEditor } from '@/store/editor';

import ConfirmDialog from './ConfirmDialog';
import PresetGrid from './PresetGrid';
import Toasts from './Toasts';
import {
  NamedPreset,
  now,
  PendingAction,
  PRESETS_KEY,
  Toast,
  ToastKind,
  uid,
} from './types';

const CustomPresets: React.FC = () => {
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PRESETS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as NamedPreset[];
      if (Array.isArray(parsed)) setPresets(parsed);
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
    setPresets(next);
    try {
      window.localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
    } catch (e) {
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

  return (
    <div className='mt-2'>
      <div className='rounded-md border border-gray-700 p-2'>
        <button
          type='button'
          onClick={() => setShowLauncher((s) => !s)}
          className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
          title='Show or hide Custom Presets actions'
        >
          <div className='flex items-center gap-2 text-sm'>Custom Presets</div>
          <span className='ml-auto text-xs text-gray-400'>
            {showLauncher ? 'Hide' : 'Show'}
          </span>
        </button>
        {showLauncher && (
          <div className='mt-2 grid grid-cols-1 gap-2'>
            <Button
              onClick={() => setOpenModal(true)}
              title='Open presets modal'
              disabled={!state.active || state.exporting}
            >
              Open
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={[
                'flex flex-col overflow-hidden rounded-md bg-gray-900 p-4 text-white shadow-xl',
                fullscreen
                  ? 'fixed inset-0 m-0 h-screen w-screen max-w-none rounded-none'
                  : 'max-h-[85vh] w-[95vw] sm:max-w-3xl md:max-w-5xl xl:max-w-7xl',
              ].join(' ')}
            >
              <div className='mb-3 flex items-center gap-2'>
                <h3 className='text-lg font-semibold'>Custom Presets</h3>
                <div className='ml-auto flex items-center gap-2'>
                  <Button
                    size='sm'
                    onClick={() => setFullscreen((f) => !f)}
                    title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {fullscreen ? 'Windowed' : 'Fullscreen'}
                  </Button>
                  <Button
                    size='sm'
                    onClick={exportCurrentState}
                    title='Export current guidelines as a JSON preset'
                  >
                    Export current state
                  </Button>
                  <input
                    id='importPresetFile'
                    name='importPresetFile'
                    ref={fileInputRef}
                    type='file'
                    accept='application/json'
                    className='hidden'
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) importPresetFromFile(f);
                    }}
                    aria-hidden='true'
                  />
                  <Button
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                    title='Import preset from JSON'
                  >
                    Import preset
                  </Button>
                  <Button size='sm' onClick={() => setOpenModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
              <div className='mb-3 grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-2 text-gray-300'
                  htmlFor='presetName'
                >
                  Name
                </label>
                <input
                  id='presetName'
                  name='presetName'
                  type='text'
                  className='col-span-7 rounded bg-gray-800 px-2 py-1 text-white'
                  placeholder='My preset'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <div className='col-span-3 flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => setPendingAction({ kind: 'save' })}
                    disabled={!state.active || state.exporting}
                    title='Save current guidelines as a preset'
                  >
                    Save
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => setPendingAction({ kind: 'clear' })}
                    title='Delete all saved presets'
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className='flex-1 overflow-auto rounded border border-gray-700'>
                <PresetGrid
                  presets={presets}
                  exporting={state.exporting}
                  active={state.active}
                  onApply={(p) =>
                    setPendingAction({ kind: 'apply', payload: p })
                  }
                  onOverwrite={(p) =>
                    setPendingAction({
                      kind: 'overwrite',
                      payload: { id: p.id, name: p.name },
                    })
                  }
                  onRename={(p) => {
                    setRenameTarget(p);
                    setRenameValue(p.name);
                    setRenameConflict(null);
                    setPendingAction({ kind: 'rename', payload: p });
                  }}
                  onDelete={(p) =>
                    setPendingAction({ kind: 'delete', payload: p })
                  }
                />
              </div>

              <ConfirmDialog
                action={pendingAction}
                busy={busy}
                setBusy={setBusy}
                presets={presets}
                onCancel={() => setPendingAction(null)}
                onPersist={persist}
                onApplyPreset={(data) =>
                  dispatch({ type: 'APPLY_PRESET', payload: { data } })
                }
                toPresetData={toPresetData}
                showToast={showToast}
                renameState={{
                  target: renameTarget,
                  value: renameValue,
                  conflict: renameConflict,
                  setValue: setRenameValue,
                  setTarget: setRenameTarget,
                  setConflict: setRenameConflict,
                }}
              />

              <Toasts toasts={toasts} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomPresets;
