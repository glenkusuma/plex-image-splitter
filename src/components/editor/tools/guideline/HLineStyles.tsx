import React from 'react';

import { useEditor } from '@/store/editor';

const HLineStyles: React.FC = () => {
  const { state, dispatch } = useEditor();

  return (
    <>
      <div className='grid grid-cols-12 items-center gap-2'>
        <span className='col-span-6 text-gray-100'>H Line</span>
        <input
          type='color'
          id='guideColorH'
          name='guideColorH'
          value={state.guideColorH}
          onChange={(e) =>
            dispatch({
              type: 'SET_GUIDE_COLORS',
              payload: { h: e.target.value },
            })
          }
          className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
          aria-label='Horizontal color'
          title='Horizontal guide color'
        />
        <div className='col-span-2' />
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 ml-4 text-gray-400'
          htmlFor='guideOpacityH'
        >
          Opacity
        </label>
        <input
          type='number'
          min={0}
          max={100}
          step={1}
          id='guideOpacityH'
          name='guideOpacityH'
          value={Math.round(state.guideAlphaH * 100)}
          onChange={(e) => {
            const raw = isNaN(e.currentTarget.valueAsNumber)
              ? 0
              : e.currentTarget.valueAsNumber;
            const clampedPct = Math.max(0, Math.min(100, raw));
            dispatch({
              type: 'SET_GUIDE_STYLE',
              payload: { hAlpha: clampedPct / 100 },
            });
          }}
          className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
          title='Horizontal guide opacity (0 – 100%)'
          aria-label='Horizontal opacity (%)'
        />
        <div className='col-span-2 text-gray-500'>%</div>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 ml-4 text-gray-400'
          htmlFor='guideThicknessH'
        >
          Thickness
        </label>
        <input
          type='number'
          min={1}
          id='guideThicknessH'
          name='guideThicknessH'
          value={state.guideThicknessH}
          onChange={(e) =>
            dispatch({
              type: 'SET_GUIDE_STYLE',
              payload: {
                hSize: Math.max(
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
          title='Horizontal guide thickness (px)'
          aria-label='Horizontal thickness'
        />
        <div className='col-span-2 text-gray-500'>px</div>
      </div>
    </>
  );
};

export default HLineStyles;
