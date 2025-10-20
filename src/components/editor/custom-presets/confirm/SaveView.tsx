import React from 'react';

import Button from '@/components/buttons/Button';

import { reindex, stableOverwriteByName } from './utils';
import type { NamedPreset } from '../types';

type Props = {
  presets: NamedPreset[];
  name: string;
  toPresetData: () => NamedPreset['data'];
  busy: boolean;
  onPersist: (next: NamedPreset[]) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const SaveView: React.FC<Props> = ({
  presets,
  name,
  toPresetData,
  busy,
  onPersist,
  onCancel,
  showToast,
}) => {
  const hasDup = presets.some((p) => p.name === name);
  return (
    <>
      <h4 className='mb-2 text-base font-semibold'>
        {hasDup ? 'Overwrite preset?' : 'Save preset?'}
      </h4>
      <p className='mb-4 text-sm text-gray-300'>
        {hasDup
          ? `A preset named "${name}" already exists. Overwrite it with current guidelines?`
          : `Save current guidelines as "${name}"?`}
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
            const itemBase = {
              id: Math.random().toString(36).slice(2, 10),
              name,
              data: toPresetData(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            } as Omit<NamedPreset, 'order'>;
            let next: NamedPreset[];
            if (hasDup) {
              next = stableOverwriteByName(presets, name, itemBase);
            } else {
              const current = [...presets].sort((a, b) => a.order - b.order);
              next = reindex([
                ...current,
                { ...itemBase, order: 0 } as NamedPreset,
              ]);
            }
            onPersist(next);
            onCancel();
            showToast(
              hasDup ? `Overwrote preset "${name}"` : `Saved preset "${name}"`,
              'success'
            );
          }}
        >
          {hasDup ? 'Overwrite' : 'Save'}
        </Button>
      </div>
    </>
  );
};

export default SaveView;
