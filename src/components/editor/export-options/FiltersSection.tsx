import React from 'react';

import { useEditor } from '@/store/editor';

const FiltersSection: React.FC = () => {
  const { state, dispatch } = useEditor();
  return (
    <div className='rounded-md border border-gray-700 p-2'>
      <div className='mb-2 flex items-center gap-2'>
        <span className='text-sm'>Filters</span>
        <label
          className='ml-auto inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='useFilters'
        >
          <input
            type='checkbox'
            id='useFilters'
            name='useFilters'
            checked={state.exportUseFilters}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_OPTIONS_FLAGS',
                payload: { useFilters: e.target.checked },
              })
            }
          />
          Enable
        </label>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='minWidthPx'>
          Min slice width
        </label>
        <input
          id='minWidthPx'
          name='minWidthPx'
          type='number'
          min={1}
          className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
          value={state.exportMinWidthPx}
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS',
              payload: {
                minWidthPx: Math.max(1, Number(e.target.value || 1)),
              },
            })
          }
          title='Exclude slices narrower than this width (px)'
        />
        <label
          className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='useMinWidth'
        >
          <input
            type='checkbox'
            id='useMinWidth'
            name='useMinWidth'
            checked={state.exportUseMinWidth}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_OPTIONS_FLAGS',
                payload: { useMinWidth: e.target.checked },
              })
            }
          />
          Use
        </label>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='minHeightPx'>
          Min slice height
        </label>
        <input
          id='minHeightPx'
          name='minHeightPx'
          type='number'
          min={1}
          className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
          value={state.exportMinHeightPx}
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS',
              payload: {
                minHeightPx: Math.max(1, Number(e.target.value || 1)),
              },
            })
          }
          title='Exclude slices shorter than this height (px)'
        />
        <label
          className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='useMinHeight'
        >
          <input
            type='checkbox'
            id='useMinHeight'
            name='useMinHeight'
            checked={state.exportUseMinHeight}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_OPTIONS_FLAGS',
                payload: { useMinHeight: e.target.checked },
              })
            }
          />
          Use
        </label>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='maxWidthPx'>
          Max slice width
        </label>
        <input
          id='maxWidthPx'
          name='maxWidthPx'
          type='number'
          min={1}
          className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
          value={
            Number.isFinite(state.exportMaxWidthPx)
              ? String(state.exportMaxWidthPx)
              : ''
          }
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_MAX',
              payload: {
                maxWidthPx: Math.max(1, Number(e.target.value || 1)),
              },
            })
          }
          title='Exclude slices wider than this width (px)'
        />
        <label
          className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='useMaxWidth'
        >
          <input
            type='checkbox'
            id='useMaxWidth'
            name='useMaxWidth'
            checked={state.exportUseMaxWidth}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_OPTIONS_FLAGS',
                payload: { useMaxWidth: e.target.checked },
              })
            }
          />
          Use
        </label>
      </div>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='maxHeightPx'>
          Max slice height
        </label>
        <input
          id='maxHeightPx'
          name='maxHeightPx'
          type='number'
          min={1}
          className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
          value={
            Number.isFinite(state.exportMaxHeightPx)
              ? String(state.exportMaxHeightPx)
              : ''
          }
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_MAX',
              payload: {
                maxHeightPx: Math.max(1, Number(e.target.value || 1)),
              },
            })
          }
          title='Exclude slices taller than this height (px)'
        />
        <label
          className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='useMaxHeight'
        >
          <input
            type='checkbox'
            id='useMaxHeight'
            name='useMaxHeight'
            checked={state.exportUseMaxHeight}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_OPTIONS_FLAGS',
                payload: { useMaxHeight: e.target.checked },
              })
            }
          />
          Use
        </label>
      </div>
    </div>
  );
};

export default FiltersSection;
