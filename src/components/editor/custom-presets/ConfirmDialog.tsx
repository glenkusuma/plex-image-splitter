import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import Button from '@/components/buttons/Button';

import type { NamedPreset, PendingAction } from './types';

type Props = {
  action: PendingAction;
  busy: boolean;
  setBusy: (b: boolean) => void;
  presets: NamedPreset[];
  onCancel: () => void;
  onPersist: (
    next: NamedPreset[] | ((prev: NamedPreset[]) => NamedPreset[])
  ) => void;
  onApplyPreset: (data: NamedPreset['data']) => void;
  toPresetData: () => NamedPreset['data'];
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
  renameState: {
    target: NamedPreset | null;
    value: string;
    conflict: null | { name: string };
    setValue: (s: string) => void;
    setTarget: (p: NamedPreset | null) => void;
    setConflict: (c: null | { name: string }) => void;
  };
};

const ConfirmDialog: React.FC<Props> = ({
  action,
  busy,
  setBusy,
  presets,
  onCancel,
  onPersist,
  onApplyPreset,
  toPresetData,
  showToast,
  renameState,
}) => {
  if (!action) return null;
  return (
    <AnimatePresence>
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='w-[90vw] max-w-sm rounded-md bg-gray-900 p-4 text-white shadow-xl'
          >
            {action.kind === 'importConfirm' && (
              <>
                <h4 className='mb-2 text-base font-semibold'>
                  Import presets: duplicates found
                </h4>
                <p className='mb-4 text-sm text-gray-300'>
                  There are {action.payload.duplicates.length} presets with
                  names that already exist. Would you like to overwrite them or
                  skip duplicates?
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    className='rounded bg-gray-700 px-3 py-1 text-sm'
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <Button
                    size='sm'
                    onClick={() => {
                      const dupNames = new Set(
                        action.payload.duplicates.map((d) => d.name)
                      );
                      const base = presets.filter((p) => !dupNames.has(p.name));
                      const next = [
                        ...base,
                        ...action.payload.toAdd,
                        ...action.payload.duplicates,
                      ];
                      onPersist(next);
                      showToast(
                        `Imported ${next.length - base.length} preset${
                          next.length - base.length !== 1 ? 's' : ''
                        } (overwrote ${action.payload.duplicates.length})`,
                        'success'
                      );
                      onCancel();
                    }}
                  >
                    Overwrite duplicates
                  </Button>
                  <Button
                    size='sm'
                    className='ml-auto'
                    onClick={() => {
                      const next = [...presets, ...action.payload.toAdd];
                      onPersist(next);
                      showToast(
                        `Imported ${action.payload.toAdd.length} preset${
                          action.payload.toAdd.length !== 1 ? 's' : ''
                        } (skipped ${action.payload.duplicates.length})`,
                        'success'
                      );
                      onCancel();
                    }}
                  >
                    Skip duplicates
                  </Button>
                </div>
              </>
            )}
            {action.kind === 'apply' && (
              <>
                <h4 className='mb-2 text-base font-semibold'>Apply preset?</h4>
                <p className='mb-4 text-sm text-gray-300'>
                  This will replace current guidelines and options with the
                  selected preset.
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    className='rounded bg-gray-700 px-3 py-1 text-sm'
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <Button
                    size='sm'
                    className='ml-auto'
                    isLoading={busy}
                    onClick={() => {
                      setBusy(true);
                      onApplyPreset(action.payload.data);
                      setBusy(false);
                      onCancel();
                      showToast('Preset applied', 'success');
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </>
            )}
            {action.kind === 'delete' && (
              <>
                <h4 className='mb-2 text-base font-semibold'>Delete preset?</h4>
                <p className='mb-4 text-sm text-gray-300'>
                  This will remove all presets with the same name.
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    className='rounded bg-gray-700 px-3 py-1 text-sm'
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <Button
                    size='sm'
                    className='ml-auto'
                    isLoading={busy}
                    onClick={() => {
                      setBusy(true);
                      const name = action.payload.name;
                      const next = presets.filter((p) => p.name !== name);
                      onPersist(next);
                      setBusy(false);
                      onCancel();
                      showToast(`Deleted presets named "${name}"`, 'success');
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
            {action.kind === 'clear' && (
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
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <Button
                    size='sm'
                    className='ml-auto'
                    isLoading={busy}
                    onClick={() => {
                      setBusy(true);
                      onPersist([]);
                      setBusy(false);
                      onCancel();
                      showToast('Cleared all presets', 'success');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
            {action.kind === 'overwrite' && (
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
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <Button
                    size='sm'
                    className='ml-auto'
                    isLoading={busy}
                    onClick={() => {
                      setBusy(true);
                      const { name } = action.payload;
                      const next = presets.filter((p) => p.name !== name);
                      const item: NamedPreset = {
                        id: Math.random().toString(36).slice(2, 10),
                        name,
                        data: toPresetData(),
                        createdAt: Date.now(),
                      };
                      onPersist([...next, item]);
                      setBusy(false);
                      onCancel();
                      showToast(`Overwrote preset "${name}"`, 'success');
                    }}
                  >
                    Overwrite
                  </Button>
                </div>
              </>
            )}
            {action.kind === 'rename' && renameState.target && (
              <>
                <h4 className='mb-2 text-base font-semibold'>Rename preset</h4>
                <p className='mb-2 text-sm text-gray-300'>
                  Enter a new name for the preset.
                </p>
                <input
                  id='renamePresetName'
                  name='renamePresetName'
                  className='mb-3 w-full rounded bg-gray-800 px-2 py-1 text-white'
                  value={renameState.value}
                  onChange={(e) => renameState.setValue(e.target.value)}
                />
                {!renameState.conflict ? (
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className='rounded bg-gray-700 px-3 py-1 text-sm'
                      onClick={() => {
                        renameState.setTarget(null);
                        onCancel();
                      }}
                    >
                      Cancel
                    </button>
                    <Button
                      size='sm'
                      className='ml-auto'
                      isLoading={busy}
                      onClick={() => {
                        const tgt = renameState.target;
                        if (!tgt) return;
                        const name =
                          (renameState.value || '').trim() || 'Preset';
                        const dup = presets.find(
                          (pp) => pp.name === name && pp.id !== tgt.id
                        );
                        if (dup) {
                          renameState.setConflict({ name });
                          return;
                        }
                        const next = presets.map((pp) =>
                          pp.id === tgt.id
                            ? { ...pp, name, createdAt: Date.now() }
                            : pp
                        );
                        onPersist(next);
                        renameState.setTarget(null);
                        onCancel();
                        showToast(`Renamed preset to "${name}"`, 'success');
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className='mb-3 text-sm text-gray-300'>
                      A preset named "{renameState.conflict.name}" already
                      exists. Overwrite presets with this name?
                    </p>
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        className='rounded bg-gray-700 px-3 py-1 text-sm'
                        onClick={() => renameState.setConflict(null)}
                      >
                        Back
                      </button>
                      <Button
                        size='sm'
                        className='ml-auto'
                        isLoading={busy}
                        onClick={() => {
                          const conflict = renameState.conflict;
                          const tgt = renameState.target;
                          if (!conflict || !tgt) return;
                          const name = conflict.name;
                          const next = presets.filter(
                            (pp) => pp.name !== name && pp.id !== tgt.id
                          );
                          const updated: NamedPreset = {
                            ...tgt,
                            name,
                            createdAt: Date.now(),
                          };
                          onPersist([...next, updated]);
                          renameState.setConflict(null);
                          renameState.setTarget(null);
                          onCancel();
                          showToast(
                            `Overwrote presets named "${name}"`,
                            'success'
                          );
                        }}
                      >
                        Overwrite
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
