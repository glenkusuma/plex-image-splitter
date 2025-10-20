import React from 'react';

import { useEditor } from '@/store/editor';

const VisibilitySnap: React.FC = () => {
  const { state, dispatch } = useEditor();

  return (
    <>
      <div className='mb-2 grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-12 flex items-center gap-2 text-sm'
          htmlFor='guidesVisible'
        >
          <input
            id='guidesVisible'
            name='guidesVisible'
            type='checkbox'
            title='Toggle guide visibility'
            checked={state.guidesVisible}
            onChange={(e) =>
              dispatch({
                type: 'SET_GUIDES_VISIBLE',
                payload: { visible: e.target.checked },
              })
            }
            disabled={!state.active || state.exporting}
          />
          Show guides
        </label>
      </div>

      <div className='mt-2 grid grid-cols-12 items-center gap-2'>
        <label
          className='col-span-6 flex items-center gap-2 text-sm'
          htmlFor='snapEnabled'
        >
          <input
            id='snapEnabled'
            name='snapEnabled'
            type='checkbox'
            title={`Enable snapping. Dragging and arrow keys move by ${state.snapPx}px (hold Shift = ×4)`}
            checked={state.snapEnabled}
            onChange={(e) =>
              dispatch({
                type: 'SET_SNAP',
                payload: { enabled: e.target.checked },
              })
            }
          />
          Snap to
        </label>

        <label htmlFor='snapPx' className='sr-only'>
          Snap step (px)
        </label>
        <input
          id='snapPx'
          name='snapPx'
          type='number'
          min={1}
          title='Snap step in pixels (applied to drag and arrow keys)'
          value={state.snapPx}
          onChange={(e) =>
            dispatch({
              type: 'SET_SNAP',
              payload: { px: Math.max(1, Number(e.target.value || 1)) },
            })
          }
          className='col-span-4 w-full rounded bg-gray-800 px-2 py-1 text-white'
          disabled={!state.snapEnabled}
          aria-label='Snap step (px)'
        />
        <div className='col-span-2 text-xs text-gray-400' id='snapPxSuffix'>
          px
        </div>
      </div>
    </>
  );
};

export default VisibilitySnap;
