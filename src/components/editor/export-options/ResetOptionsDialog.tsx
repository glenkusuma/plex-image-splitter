import React from 'react';

type Props = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ResetOptionsDialog: React.FC<Props> = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='w-[90vw] max-w-sm rounded-md bg-gray-900 p-4 text-white shadow-xl'>
        <h4 className='mb-2 text-base font-semibold'>Reset export options?</h4>
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
            className='ml-auto rounded bg-red-600 px-3 py-1 text-sm'
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetOptionsDialog;
