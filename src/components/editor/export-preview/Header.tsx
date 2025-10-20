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
        aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        <img
          src={
            fullscreen
              ? '/images/svg/Minimize.svg'
              : '/images/svg/Fullscreen.svg'
          }
          alt={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          width={20}
          height={20}
          style={{ filter: 'invert(1)' }}
        />
      </Button>
      <Button
        size='sm'
        onClick={onClose}
        title='Close preview'
        aria-label='Close preview'
      >
        <img
          src='/images/svg/Close.svg'
          alt='Close preview'
          width={20}
          height={20}
          style={{ filter: 'invert(1)' }}
        />
      </Button>
    </div>
  );
};

export default Header;
