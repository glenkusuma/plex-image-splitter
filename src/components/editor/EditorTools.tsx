import React, { useMemo, useState } from 'react';

import Button from '@/components/buttons/Button';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const EditorPresets = () => {
  const { state, dispatch } = useEditor();
  const [hCount, setHCount] = useState<number>(1);
  const [vCount, setVCount] = useState<number>(1);

  const disabledGenerate = useMemo(() => {
    if (!state.active || state.exporting) return true;
    if (hCount < 0 || vCount < 0) return true;
    if (hCount + state.horizontalSplit.length > MAX_SPLITS) return true;
    if (vCount + state.verticalSplit.length > MAX_SPLITS) return true;
    return false;
  }, [
    hCount,
    vCount,
    state.active,
    state.exporting,
    state.horizontalSplit.length,
    state.verticalSplit.length,
  ]);

  const onGenerate = () => {
    // We want to generate hCount horizontal subdivisions and vCount vertical subdivisions
    // The store has SUBDIVIDE_LINES_ITR to accept an itr count that will generate evenly spaced from scratch
    // We'll dispatch separate actions: clear then add via SUBDIVIDE_LINES_ITR using the max of hCount and vCount as itr
    if (hCount <= 0 && vCount <= 0) return;
    dispatch({ type: 'GENERATE_GRID', payload: { hCount, vCount } });
  };

  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <Button
          onClick={() =>
            dispatch({
              type: 'SUBDIVIDE_LINES_HORIZONTAL',
              payload: { count: 1 },
            })
          }
          disabled={
            state.horizontalSplit.length >= MAX_SPLITS / 2 ||
            !state.active ||
            state.exporting
          }
        >
          H-Split
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: 'SUBDIVIDE_LINES_VERTICAL',
              payload: { count: 1 },
            })
          }
          disabled={
            state.verticalSplit.length >= MAX_SPLITS / 2 ||
            !state.active ||
            state.exporting
          }
        >
          V-Split
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: 'ADD_NEW_HLINE', payload: { count: 1 } })
          }
          disabled={
            state.horizontalSplit.length >= MAX_SPLITS ||
            !state.active ||
            state.exporting
          }
        >
          <img
            src='/images/svg/Plus.svg'
            alt='Clear'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          H-Line
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: 'ADD_NEW_VLINE', payload: { count: 1 } })
          }
          disabled={
            state.verticalSplit.length >= MAX_SPLITS ||
            !state.active ||
            state.exporting
          }
        >
          <img
            src='/images/svg/Plus.svg'
            alt='Clear'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          V-Line
        </Button>
        <Button
          onClick={() => dispatch({ type: 'REMOVE_HLINE' })}
          disabled={
            state.horizontalSplit.length <= 0 ||
            !state.active ||
            state.exporting
          }
        >
          <img
            src='/images/svg/Minus.svg'
            alt='Remove'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          H-Line
        </Button>
        <Button
          onClick={() => dispatch({ type: 'REMOVE_VLINE' })}
          disabled={
            state.verticalSplit.length <= 0 || !state.active || state.exporting
          }
        >
          <img
            src='/images/svg/Minus.svg'
            alt='Remove'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          V-Line
        </Button>
      </div>

      {/* Generate grid controls */}
      <div className='pt-3'>
        <label className='text-sm'>Generate Grid</label>
        <div className='flex gap-2 pt-2'>
          <input
            type='number'
            min={0}
            value={hCount}
            onChange={(e) =>
              setHCount(Math.max(0, Number(e.target.value || 0)))
            }
            className='w-16 rounded bg-gray-800 px-2 py-1 text-white'
            aria-label='Horizontal count'
          />
          <input
            type='number'
            min={0}
            value={vCount}
            onChange={(e) =>
              setVCount(Math.max(0, Number(e.target.value || 0)))
            }
            className='w-16 rounded bg-gray-800 px-2 py-1 text-white'
            aria-label='Vertical count'
          />
          <Button onClick={onGenerate} disabled={disabledGenerate}>
            Generate
          </Button>
        </div>
        <p className='pt-1 text-xs text-gray-400'>
          H / V — number of slices to insert (evenly distributed)
        </p>
      </div>
    </>
  );
};

export default EditorPresets;
