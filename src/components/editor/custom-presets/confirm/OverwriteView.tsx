import React from 'react';

import Button from '@/components/buttons/Button';

import { stableOverwriteByName } from './utils';
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

const OverwriteView: React.FC<Props> = ({
  presets,
  name,
  toPresetData,
  busy,
  onPersist,
  onCancel,
  showToast,
}) => (
  <>
    <h4 className='mb-2 text-base font-semibold'>Overwrite preset?</h4>
    <p className='mb-4 text-sm text-gray-300'>
      Replace all presets with this name using your current guidelines.
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
          const next = stableOverwriteByName(presets, name, itemBase);
          onPersist(next);
          onCancel();
          showToast(`Overwrote preset "${name}"`, 'success');
        }}
      >
        Overwrite
      </Button>
    </div>
  </>
);

export default OverwriteView;
