import React from 'react';

import Button from '@/components/buttons/Button';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const SubdivideAddSplit: React.FC = () => {
  const { state, dispatch } = useEditor();

  return (
    <div className='space-y-2'>
      <div>
        <Button
          size='sm'
          title='Insert 1 evenly spaced guide between each pair of existing guides (both axes)'
          onClick={() =>
            dispatch({ type: 'SUBDIVIDE_LINES', payload: { count: 1 } })
          }
          disabled={
            state.horizontalSplit.length >= MAX_SPLITS / 2 ||
            state.verticalSplit.length >= MAX_SPLITS / 2 ||
            state.exporting ||
            !state.active
          }
          className='w-full'
        >
          Subdivide
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          size='sm'
          title='Insert 1 evenly spaced horizontal guide between each pair'
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
          className='w-full'
        >
          H Split
        </Button>
        <Button
          size='sm'
          title='Insert 1 evenly spaced vertical guide between each pair'
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
          className='w-full'
        >
          V Split
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          size='sm'
          title='Add a new horizontal guide at 50% (center)'
          onClick={() =>
            dispatch({ type: 'ADD_NEW_HLINE', payload: { count: 1 } })
          }
          disabled={
            state.horizontalSplit.length >= MAX_SPLITS ||
            !state.active ||
            state.exporting
          }
          className='w-full'
        >
          <img
            src='/images/svg/Plus.svg'
            alt='+'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          H Line
        </Button>
        <Button
          size='sm'
          title='Add a new vertical guide at 50% (center)'
          onClick={() =>
            dispatch({ type: 'ADD_NEW_VLINE', payload: { count: 1 } })
          }
          disabled={
            state.verticalSplit.length >= MAX_SPLITS ||
            !state.active ||
            state.exporting
          }
          className='w-full'
        >
          <img
            src='/images/svg/Plus.svg'
            alt='+'
            width={12}
            height={12}
            style={{ filter: 'invert(1)' }}
            className='mr-2'
          />{' '}
          V Line
        </Button>
      </div>
    </div>
  );
};

export default SubdivideAddSplit;
