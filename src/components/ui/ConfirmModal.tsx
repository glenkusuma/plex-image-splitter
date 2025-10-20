import React from 'react';

import Button from '@/components/buttons/Button';

import ModalShell from './ModalShell';

type Props = {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  intent?: 'normal' | 'danger';
  confirmText?: string;
  cancelText?: string;
};

const ConfirmModal: React.FC<Props> = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  intent = 'normal',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      title={title}
      intent={intent}
      size='sm'
    >
      <div className='space-y-3'>
        <div className='text-sm text-gray-200'>{message}</div>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm' onClick={onCancel}>
            {cancelText}
          </Button>
          <Button size='sm' variant='primary' onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default ConfirmModal;
