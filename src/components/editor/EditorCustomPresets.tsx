import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/buttons/Button';

import { PresetData, useEditor } from '@/store/editor';

// Local storage keys
const PRESETS_KEY = 'pis.presets.v1';

interface NamedPreset {
  id: string;
  name: string;
  data: PresetData;
  createdAt: number;
}

const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);

const EditorCustomPresets: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [presets, setPresets] = useState<NamedPreset[]>([]);
  const [newName, setNewName] = useState('');
  const [showLauncher, setShowLauncher] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    | { kind: 'apply'; payload: NamedPreset }
    | { kind: 'delete'; payload: NamedPreset }
    | { kind: 'clear' }
    | { kind: 'overwrite'; payload: { id: string; name: string } }
    | {
        kind: 'importConfirm';
        payload: { toAdd: NamedPreset[]; duplicates: NamedPreset[] };
      }
    | { kind: 'save' }
    | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // load presets
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PRESETS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NamedPreset[];
        if (Array.isArray(parsed)) setPresets(parsed);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Presets] Failed to load', e);
    }
  }, []);

  const persist = (list: NamedPreset[]) => {
    setPresets(list);
    try {
      window.localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Presets] Failed to save', e);
    }
  };

  const toPresetData = (): PresetData => ({
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

  // save is handled inside confirmation click to allow overwrite prompt

  const applyPreset = (p: NamedPreset) => {
    setPendingAction({ kind: 'apply', payload: p });
  };

  const deletePreset = (id: string) => {
    const target = presets.find((p) => p.id === id);
    if (!target) return;
    setPendingAction({ kind: 'delete', payload: target });
  };

  //

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
  };

  const importPresetFromFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const parsedUnknown = parsed as unknown;
        // Accept { preset: {...} } or a raw preset object, or { presets: [...] }
        const arr: unknown[] = (() => {
          if (typeof parsedUnknown === 'object' && parsedUnknown !== null) {
            const obj = parsedUnknown as {
              preset?: unknown;
              presets?: unknown[];
            };
            if (Array.isArray(obj.presets)) return obj.presets;
            if (obj.preset) return [obj.preset];
          }
          return [parsedUnknown];
        })();
        const normalized: NamedPreset[] = arr.map((raw) => {
          const item = raw as Partial<NamedPreset> & {
            data?: Partial<PresetData>;
          };
          return {
            id: item.id || uid(),
            name: String(item.name || 'Preset'),
            data: { ...(item.data || {}), version: 1 } as PresetData,
            createdAt: Number(item.createdAt || now()),
          };
        });
        const names = new Set(presets.map((p) => p.name));
        const duplicates = normalized.filter((n) => names.has(n.name));
        const uniques = normalized.filter((n) => !names.has(n.name));
        if (duplicates.length) {
          setPendingAction({
            kind: 'importConfirm',
            payload: { toAdd: uniques, duplicates },
          });
        } else {
          persist([...presets, ...normalized]);
        }
      } catch (e) {
        alert('Failed to import presets: ' + (e as Error).message);
      }
    };
    reader.readAsText(f);
  };

  const onClickImport = () => fileInputRef.current?.click();

  // no-op

  return (
    <div className='mt-2'>
      <div className='rounded-md border border-gray-700 p-2'>
        <button
          type='button'
          onClick={() => setShowLauncher((s) => !s)}
          className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
          title='Show or hide Custom Presets actions'
        >
          <label className='flex items-center gap-2 text-sm'>
            Custom Presets
          </label>
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

      {openModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='fixed inset-0 m-0 flex h-screen w-screen max-w-none flex-col overflow-hidden rounded-none bg-gray-900 p-4 text-white shadow-xl'>
            <div className='mb-3 flex items-center gap-2'>
              <h3 className='text-lg font-semibold'>Custom Presets</h3>
              <div className='ml-auto flex items-center gap-2'>
                <Button
                  size='sm'
                  onClick={exportCurrentState}
                  title='Export current guidelines as a JSON preset'
                >
                  Export current state
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='application/json'
                  className='hidden'
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importPresetFromFile(f);
                  }}
                />
                <Button
                  size='sm'
                  onClick={onClickImport}
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
              <label className='col-span-2 text-gray-300' htmlFor='presetName'>
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
              {presets.length === 0 ? (
                <p className='p-3 text-xs text-gray-400'>
                  No presets saved yet.
                </p>
              ) : (
                <div className='grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                  {presets.map((p) => (
                    <div
                      key={p.id}
                      className='rounded border border-gray-700 p-2'
                    >
                      <div className='mb-2 text-sm font-medium'>{p.name}</div>
                      <div className='mb-2 text-xs text-gray-400'>
                        H{p.data.horizontalSplit?.length || 0} • V
                        {p.data.verticalSplit?.length || 0}
                      </div>
                      <div className='grid grid-cols-3 gap-2'>
                        <Button
                          size='sm'
                          onClick={() => applyPreset(p)}
                          disabled={state.exporting}
                          title='Apply this preset'
                        >
                          Apply
                        </Button>
                        <Button
                          size='sm'
                          onClick={() =>
                            setPendingAction({
                              kind: 'overwrite',
                              payload: { id: p.id, name: p.name },
                            })
                          }
                          disabled={!state.active || state.exporting}
                          title='Overwrite with current state'
                        >
                          Overwrite
                        </Button>
                        <Button
                          size='sm'
                          onClick={() => deletePreset(p.id)}
                          title='Delete preset'
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pendingAction && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
                <div className='w-[90vw] max-w-sm rounded-md bg-gray-900 p-4 text-white shadow-xl'>
                  {pendingAction.kind === 'importConfirm' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Import presets: duplicates found
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        There are {pendingAction.payload.duplicates.length}{' '}
                        presets with names that already exist. Would you like to
                        overwrite them or skip duplicates?
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='rounded bg-blue-600 px-3 py-1 text-sm'
                          onClick={() => {
                            // Overwrite: remove existing by name, then add all duplicates + uniques
                            const dupNames = new Set(
                              pendingAction.payload.duplicates.map(
                                (d) => d.name
                              )
                            );
                            const base = presets.filter(
                              (p) => !dupNames.has(p.name)
                            );
                            persist([
                              ...base,
                              ...pendingAction.payload.toAdd,
                              ...pendingAction.payload.duplicates,
                            ]);
                            setPendingAction(null);
                          }}
                        >
                          Overwrite duplicates
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-gray-600 px-3 py-1 text-sm'
                          onClick={() => {
                            // Skip duplicates: only add uniques
                            persist([
                              ...presets,
                              ...pendingAction.payload.toAdd,
                            ]);
                            setPendingAction(null);
                          }}
                        >
                          Skip duplicates
                        </button>
                      </div>
                    </>
                  )}
                  {pendingAction.kind === 'apply' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Apply preset?
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        This will replace current guidelines and options with
                        the selected preset.
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-blue-600 px-3 py-1 text-sm'
                          onClick={() => {
                            dispatch({
                              type: 'APPLY_PRESET',
                              payload: {
                                data: (pendingAction.payload as NamedPreset)
                                  .data,
                              },
                            });
                            setPendingAction(null);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </>
                  )}
                  {pendingAction.kind === 'delete' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Delete preset?
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        This will remove all presets with the same name.
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-red-600 px-3 py-1 text-sm'
                          onClick={() => {
                            const name = (pendingAction.payload as NamedPreset)
                              .name;
                            const next = presets.filter((p) => p.name !== name);
                            persist(next);
                            setPendingAction(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                  {pendingAction.kind === 'clear' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Clear all presets?
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        All saved presets will be removed from this browser.
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-red-600 px-3 py-1 text-sm'
                          onClick={() => {
                            persist([]);
                            setPendingAction(null);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  )}
                  {pendingAction.kind === 'overwrite' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Overwrite preset?
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        Replace all presets with this name using your current
                        guidelines.
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-blue-600 px-3 py-1 text-sm'
                          onClick={() => {
                            const { name } = pendingAction.payload as {
                              id: string;
                              name: string;
                            };
                            const next = presets.filter((p) => p.name !== name);
                            const item: NamedPreset = {
                              id: uid(),
                              name,
                              data: toPresetData(),
                              createdAt: now(),
                            };
                            persist([...next, item]);
                            setPendingAction(null);
                          }}
                        >
                          Overwrite
                        </button>
                      </div>
                    </>
                  )}
                  {pendingAction.kind === 'save' && (
                    <>
                      <h4 className='mb-2 text-base font-semibold'>
                        Save preset?
                      </h4>
                      <p className='mb-4 text-sm text-gray-300'>
                        Save current guidelines as a new preset.
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded bg-gray-700 px-3 py-1 text-sm'
                          onClick={() => setPendingAction(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='ml-auto rounded bg-blue-600 px-3 py-1 text-sm'
                          onClick={() => {
                            const name = (
                              newName || 'Preset ' + (presets.length + 1)
                            ).trim();
                            const existing = presets.find(
                              (p) => p.name === name
                            );
                            if (existing) {
                              setPendingAction({
                                kind: 'overwrite',
                                payload: { id: existing.id, name },
                              });
                              return;
                            }
                            const item: NamedPreset = {
                              id: uid(),
                              name,
                              data: toPresetData(),
                              createdAt: now(),
                            };
                            // enforce uniqueness by name
                            const next = presets.filter((p) => p.name !== name);
                            persist([...next, item]);
                            setNewName('');
                            setPendingAction(null);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorCustomPresets;
