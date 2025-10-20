import React, { useState } from 'react';

import GuidelineStyles from '@/components/editor/tools/guideline/GuidelineStyles';
import VisibilitySnap from '@/components/editor/tools/guideline/VisibilitySnap';

const GuidelineOptions: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='rounded-md border border-gray-700 p-2'>
      <div className='gap-2 space-y-2 text-xs'>
        <button
          type='button'
          onClick={() => setOpen((s) => !s)}
          className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
          title='Show or hide guide colors and style options'
        >
          <span className='flex items-center gap-2 text-sm'>
            Guideline Options
          </span>
          <span className='ml-auto text-xs text-gray-400'>
            {open ? 'Hide' : 'Show'}
          </span>
        </button>

        {open && (
          <>
            <VisibilitySnap />
            <GuidelineStyles />
          </>
        )}
      </div>
    </div>
  );
};

export default GuidelineOptions;
