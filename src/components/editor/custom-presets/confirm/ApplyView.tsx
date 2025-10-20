import React from 'react';

import Button from '@/components/buttons/Button';

import { fmtDate } from './utils';
import type { NamedPreset } from '../types';

type Props = {
  preset: NamedPreset;
  busy: boolean;
  onApply: (data: NamedPreset['data']) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const ApplyView: React.FC<Props> = ({
  preset,
  busy,
  onApply,
  onCancel,
  showToast,
}) => (
  <>
    <h4 className='mb-2 text-base font-semibold'>Apply preset?</h4>
    <div className='mb-4 text-sm text-gray-300'>
      <p className='mb-1'>Name: {preset.name}</p>
      <p className='mb-1 text-xs text-gray-400'>
        Created: {fmtDate(preset.createdAt)}
      </p>
      <p className='mb-1'>
        H splits: {preset.data.horizontalSplit?.length ?? 0} • V splits:{' '}
        {preset.data.verticalSplit?.length ?? 0}
      </p>
      <p className='text-xs text-gray-400'>
        Guides: {preset.data.guidesVisible ? 'visible' : 'hidden'} • Snap:{' '}
        {preset.data.snapEnabled ? `on (${preset.data.snapPx}px)` : 'off'}
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
          onApply(preset.data);
          onCancel();
          showToast('Preset applied', 'success');
        }}
      >
        Apply
      </Button>
    </div>
  </>
);

export default ApplyView;
