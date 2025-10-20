import React from 'react';

import ModalShell from '@/components/ui/ModalShell';

type Props = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ResetOptionsDialog: React.FC<Props> = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <ModalShell
      open={show}
      onClose={onCancel}
      title='Reset export options?'
      intent='danger'
      size='sm'
    >
      <p className='mb-4 text-sm text-gray-300'>
        This will restore filename pattern, zip name, and all filters to their
        defaults.
      </p>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          className='rounded bg-gray-700 px-3 py-1 text-sm'
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type='button'
          className='ml-auto rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500'
          onClick={onConfirm}
        >
          Reset
        </button>
      </div>
    </ModalShell>
  );
};

export default ResetOptionsDialog;
