import React from 'react';

import Button from '@/components/buttons/Button';

import type { NamedPreset } from '../types';

type Props = {
  busy: boolean;
  onPersist: (next: NamedPreset[]) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const ClearView: React.FC<Props> = ({
  busy,
  onPersist,
  onCancel,
  showToast,
}) => (
  <>
    <h4 className='mb-2 text-base font-semibold'>Clear all presets?</h4>
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
          onPersist([]);
          onCancel();
          showToast('Cleared all presets', 'success');
        }}
      >
        Clear
      </Button>
    </div>
  </>
);

export default ClearView;
