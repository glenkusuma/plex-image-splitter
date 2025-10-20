import React from 'react';

import Button from '@/components/buttons/Button';

import { reindex, stableOverwriteByName } from './utils';
import type { NamedPreset } from '../types';

type RenameState = {
  target: NamedPreset | null;
  value: string;
  conflict: null | { name: string };
  setValue: (s: string) => void;
  setTarget: (p: NamedPreset | null) => void;
  setConflict: (c: null | { name: string }) => void;
};

type Props = {
  presets: NamedPreset[];
  renameState: RenameState;
  busy: boolean;
  onPersist: (next: NamedPreset[]) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const RenameView: React.FC<Props> = ({
  presets,
  renameState,
  busy,
  onPersist,
  onCancel,
  showToast,
}) => {
  return (
    <>
      <h4 className='mb-2 text-base font-semibold'>Rename preset</h4>
      <p className='mb-2 text-sm text-gray-300'>
        Enter a new name for the preset.
      </p>
      <input
        id='renamePresetName'
        name='renamePresetName'
        className='mb-3 w-full rounded bg-gray-800 px-2 py-1 text-white'
        autoFocus
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
              const name = (renameState.value || '').trim() || 'Preset';
              const dup = presets.find(
                (pp) => pp.name === name && pp.id !== tgt.id
              );
              if (dup) {
                renameState.setConflict({ name });
                return;
              }
              const current = [...presets].sort((a, b) => a.order - b.order);
              const next = reindex(
                current.map((pp) =>
                  pp.id === tgt.id
                    ? {
                        ...pp,
                        name,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                      }
                    : pp
                )
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
            A preset named "{renameState.conflict.name}" already exists.
            Overwrite presets with this name?
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
                const itemBase = {
                  ...tgt,
                  name: conflict.name,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                } as Omit<NamedPreset, 'order'>;
                const next = stableOverwriteByName(
                  presets,
                  conflict.name,
                  itemBase
                );
                onPersist(next);
                renameState.setConflict(null);
                renameState.setTarget(null);
                onCancel();
                showToast(
                  `Overwrote presets named "${conflict.name}"`,
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
  );
};

export default RenameView;
