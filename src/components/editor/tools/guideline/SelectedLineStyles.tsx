import React from 'react';

import { useEditor } from '@/store/editor';

const SelectedLineStyles: React.FC = () => {
  const { state, dispatch } = useEditor();

  return (
    <>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 text-gray-100'
          htmlFor='selectedGuideColor'
        >
          Selected Line
        </label>
        <input
          id='selectedGuideColor'
          name='selectedGuideColor'
          type='color'
          title='Selected guide color'
          value={state.selectedGuideColor}
          onChange={(e) =>
            dispatch({
              type: 'SET_GUIDE_COLORS',
              payload: { selected: e.target.value },
            })
          }
          className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
        />
        <div className='col-span-2' />
      </div>

      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 ml-4 text-gray-400'
          htmlFor='selectedGuideOpacity'
        >
          Opacity
        </label>
        <input
          type='number'
          min={0}
          max={100}
          step={1}
          id='selectedGuideOpacity'
          name='selectedGuideOpacity'
          value={Math.round(state.selectedGuideAlpha * 100)}
          onChange={(e) => {
            const raw = isNaN(e.currentTarget.valueAsNumber)
              ? 0
              : e.currentTarget.valueAsNumber;
            const clampedPct = Math.max(0, Math.min(100, raw));
            dispatch({
              type: 'SET_GUIDE_STYLE',
              payload: { selectedAlpha: clampedPct / 100 },
            });
          }}
          className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
          title='Selected guide opacity (0 – 100%)'
          aria-label='Selected guide opacity (%)'
        />
        <div className='col-span-2 text-gray-500'>%</div>
      </div>
    </>
  );
};

export default SelectedLineStyles;
