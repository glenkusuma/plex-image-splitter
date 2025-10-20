import React from 'react';

import Button from '@/components/buttons/Button';

type Props = {
  loading: boolean;
  onExportAll: () => Promise<void> | void;
  onExportSelected: () => Promise<void> | void;
};

const Footer: React.FC<Props> = ({
  loading,
  onExportAll,
  onExportSelected,
}) => {
  return (
    <div className='mt-3 flex items-center gap-2'>
      <Button
        size='sm'
        onClick={onExportAll}
        title='Export all filtered items using current options'
        disabled={loading}
      >
        Export All
      </Button>
      <Button
        size='sm'
        onClick={onExportSelected}
        title='Export only the selected items using current options'
        disabled={loading}
      >
        Export Selected
      </Button>
      <span className='ml-auto text-xs text-gray-400'>
        Tips: hover icons for tooltips; fullscreen removes gaps.
      </span>
    </div>
  );
};

export default Footer;
