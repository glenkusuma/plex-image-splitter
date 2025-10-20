import React from 'react';

import Button from '@/components/buttons/Button';

type Props = {
  title?: string;
  selectedCount: number;
  totalFiltered: number;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
};

const Header: React.FC<Props> = ({
  title = 'Export Preview',
  selectedCount,
  totalFiltered,
  fullscreen,
  onToggleFullscreen,
  onClose,
}) => {
  return (
    <div className='mb-3 flex items-center gap-2'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <span
        className='ml-auto text-sm text-gray-300'
        title='Number of selected items out of filtered list'
      >
        Selected {selectedCount} / {totalFiltered}
      </span>
      <Button
        size='sm'
        onClick={onToggleFullscreen}
        title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {fullscreen ? 'Windowed' : 'Fullscreen'}
      </Button>
      <Button size='sm' onClick={onClose} title='Close preview'>
        Close
      </Button>
    </div>
  );
};

export default Header;
