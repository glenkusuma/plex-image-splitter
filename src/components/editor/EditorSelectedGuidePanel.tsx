import React, { useMemo } from 'react';

import { useEditor } from '@/store/editor';

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const EditorSelectedGuidePanel = () => {
  const { state, dispatch } = useEditor();
  const selH = state.selected.horizontal;
  const selV = state.selected.vertical;

  const single = selH.length + selV.length === 1;
  const metrics = useMemo(() => {
    if (!single) return null;
    if (selH.length === 1) {
      const index = selH[0];
      const percent = state.horizontalSplit[index]?.position ?? 0;
      const px = Math.round((percent / 100) * state.canvasSize.height);
      return { align: 'horizontal' as const, index, px, percent };
    }
    if (selV.length === 1) {
      const index = selV[0];
      const percent = state.verticalSplit[index]?.position ?? 0;
      const px = Math.round((percent / 100) * state.canvasSize.width);
      return { align: 'vertical' as const, index, px, percent };
    }
    return null;
  }, [
    single,
    selH,
    selV,
    state.canvasSize.height,
    state.canvasSize.width,
    state.horizontalSplit,
    state.verticalSplit,
  ]);

  // calculate how many pixels arrow keys move (respecting snap), and the shift-modified amount (×4)
  const baseShift = state.snapEnabled ? state.snapPx : 1;
  const shiftAmount = baseShift * 4;

  if (selH.length + selV.length === 0) return null;

  const moveToPx = (newPx: number) => {
    if (metrics && metrics.align === 'horizontal') {
      const pct =
        (clamp(newPx, 0, state.canvasSize.height) /
          (state.canvasSize.height || 1)) *
        100;
      dispatch({
        type: 'SET_LINE_POSITION',
        payload: { align: 'horizontal', index: metrics.index, position: pct },
      });
    } else if (metrics && metrics.align === 'vertical') {
      const pct =
        (clamp(newPx, 0, state.canvasSize.width) /
          (state.canvasSize.width || 1)) *
        100;
      dispatch({
        type: 'SET_LINE_POSITION',
        payload: { align: 'vertical', index: metrics.index, position: pct },
      });
    }
  };

  return (
    <div className='rounded-md border border-gray-700 p-2'>
      <div className='mb-2 flex items-center gap-2'>
        <div className='text-sm font-semibold' title='Selected guides overview'>
          Selection
        </div>
        <div className='ml-auto flex items-center gap-1'>
          <button
            className='rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
            onClick={() => dispatch({ type: 'SELECT_ALL_LINES' })}
            disabled={!state.active || state.exporting}
            title='Select all guides (H and V)'
            aria-label='Select all guides'
          >
            All
          </button>
          <button
            className='rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
            onClick={() =>
              dispatch({
                type: 'SELECT_ONLY_AXIS_LINES',
                payload: { align: 'horizontal' },
              })
            }
            disabled={!state.active || state.exporting}
            title='Select all horizontal guides'
            aria-label='Select all horizontal guides'
          >
            H
          </button>
          <button
            className='rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
            onClick={() =>
              dispatch({
                type: 'SELECT_ONLY_AXIS_LINES',
                payload: { align: 'vertical' },
              })
            }
            disabled={!state.active || state.exporting}
            title='Select all vertical guides'
            aria-label='Select all vertical guides'
          >
            V
          </button>
        </div>
      </div>
      <div className='mb-2 text-xs text-gray-300'>
        Selected {selH.length + selV.length}
      </div>
      {single && metrics ? (
        <div className='grid grid-cols-3 items-center gap-2 text-sm'>
          <div className='col-span-1 text-gray-300'>Type</div>
          <div className='col-span-2 text-right capitalize'>
            {metrics.align}
          </div>
          <div className='col-span-1 text-gray-300'>Index</div>
          <div className='col-span-2 text-right'>{metrics.index}</div>
          <label className='col-span-1 text-gray-300' htmlFor='selectedGuidePx'>
            {metrics.align === 'horizontal' ? 'Y (px)' : 'X (px)'}
          </label>
          <div className='col-span-2'>
            <div className='flex items-center gap-2'>
              <button
                className='rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
                onClick={() => moveToPx(metrics.px - 1)}
                disabled={!state.active || state.exporting}
                aria-label='Decrement px'
                title='Move selected guide by -1 px'
              >
                -1
              </button>
              <input
                type='number'
                className='w-full flex-1 rounded bg-gray-800 px-2 py-1 text-right text-white'
                value={metrics.px}
                onChange={(e) => moveToPx(parseInt(e.target.value || '0', 10))}
                min={0}
                max={
                  metrics.align === 'horizontal'
                    ? state.canvasSize.height
                    : state.canvasSize.width
                }
                disabled={!state.active || state.exporting}
                aria-label='Guide position in pixels'
                id='selectedGuidePx'
                name='selectedGuidePx'
              />
              <button
                className='rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
                onClick={() => moveToPx(metrics.px + 1)}
                disabled={!state.active || state.exporting}
                aria-label='Increment px'
                title='Move selected guide by +1 px'
              >
                +1
              </button>
            </div>
          </div>
          <div className='col-span-1 text-gray-300'>Percent</div>
          <div className='col-span-2 text-right'>
            {metrics.percent.toFixed(2)}%
          </div>
        </div>
      ) : null}
      <div
        className='mt-2 text-xs text-gray-400'
        title='Tips for moving and selecting guides'
      >
        Use Shift+Click to multi-select. Arrow keys move selected guides by{' '}
        {baseShift}px (hold Shift = {shiftAmount}px).
      </div>
      <div className='mt-3 flex gap-2'>
        <button
          className='rounded bg-gray-800 px-2 py-1 text-xs text-red-200 hover:bg-gray-700'
          onClick={() => dispatch({ type: 'REMOVE_SELECTED_LINES' })}
          disabled={!state.active || state.exporting}
          title='Delete all currently selected guides'
        >
          Delete selected
        </button>
        <button
          className='ml-auto rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700'
          onClick={() => dispatch({ type: 'CLEAR_SELECTED_LINES' })}
          title='Clear current selection'
        >
          Deselect
        </button>
      </div>
    </div>
  );
};

export default EditorSelectedGuidePanel;
