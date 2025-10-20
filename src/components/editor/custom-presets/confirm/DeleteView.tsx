import React from 'react';

import Button from '@/components/buttons/Button';

import { fmtDate, reindex } from './utils';
import type { NamedPreset } from '../types';

type Props = {
  presets: NamedPreset[];
  name: string;
  createdAt: number;
  busy: boolean;
  onPersist: (next: NamedPreset[]) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const DeleteView: React.FC<Props> = ({
  presets,
  name,
  createdAt,
  busy,
  onPersist,
  onCancel,
  showToast,
}) => (
  <>
    <h4 className='mb-2 text-base font-semibold'>Delete preset?</h4>
    <div className='mb-4 text-sm text-gray-300'>
      <p className='mb-1'>Name: {name}</p>
      <p className='mb-1 text-xs text-gray-400'>
        Created: {fmtDate(createdAt)}
      </p>
      <p className='text-xs text-red-300'>
        This will remove ALL presets with this name. Count:{' '}
        {presets.filter((p) => p.name === name).length}
      </p>
    </div>
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
          const current = [...presets].sort((a, b) => a.order - b.order);
          const next = reindex(current.filter((p) => p.name !== name));
          onPersist(next);
          onCancel();
          showToast(`Deleted presets named "${name}"`, 'success');
        }}
      >
        Delete
      </Button>
    </div>
  </>
);

export default DeleteView;
