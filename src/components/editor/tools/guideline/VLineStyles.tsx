import React from 'react';

import { useEditor } from '@/store/editor';

const VLineStyles: React.FC = () => {
  const { state, dispatch } = useEditor();

  return (
    <>
      <div className='grid grid-cols-12 items-center gap-2'>
        <span className='col-span-6 text-gray-100'>V Line</span>
        <input
          type='color'
          id='guideColorV'
          name='guideColorV'
          value={state.guideColorV}
          onChange={(e) =>
            dispatch({
              type: 'SET_GUIDE_COLORS',
              payload: { v: e.target.value },
            })
          }
          className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
          aria-label='Vertical color'
          title='Vertical guide color'
        />
        <div className='col-span-2' />
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 ml-4 text-gray-400'
          htmlFor='guideOpacityV'
        >
          Opacity
        </label>
        <input
          type='number'
          min={0}
          max={100}
          step={1}
          id='guideOpacityV'
          name='guideOpacityV'
          value={Math.round(state.guideAlphaV * 100)}
          onChange={(e) => {
            const raw = isNaN(e.currentTarget.valueAsNumber)
              ? 0
              : e.currentTarget.valueAsNumber;
            const clampedPct = Math.max(0, Math.min(100, raw));
            dispatch({
              type: 'SET_GUIDE_STYLE',
              payload: { vAlpha: clampedPct / 100 },
            });
          }}
          className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
          title='Vertical guide opacity (0 – 100%)'
          aria-label='Vertical opacity (%)'
        />
        <div className='col-span-2 text-gray-500'>%</div>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 ml-4 text-gray-400'
          htmlFor='guideThicknessV'
        >
          Thickness
        </label>
        <input
          type='number'
          min={1}
          id='guideThicknessV'
          name='guideThicknessV'
          value={state.guideThicknessV}
          onChange={(e) =>
            dispatch({
              type: 'SET_GUIDE_STYLE',
              payload: {
                vSize: Math.max(
                  1,
                  Math.round(
                    isNaN(e.currentTarget.valueAsNumber)
                      ? 1
                      : e.currentTarget.valueAsNumber
                  )
                ),
              },
            })
          }
          className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
          title='Vertical guide thickness (px)'
          aria-label='Vertical thickness'
        />
        <div className='col-span-2 text-gray-500'>px</div>
      </div>
    </>
  );
};

export default VLineStyles;
