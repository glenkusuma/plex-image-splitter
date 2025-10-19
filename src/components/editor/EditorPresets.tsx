import React from 'react';

import Button from '@/components/buttons/Button';

import { useEditor } from '@/store/editor';

const EditorPresets = () => {
  const { state, dispatch } = useEditor();
  return (
    <>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() => dispatch({ type: 'CLEAR_LINES' })}
      >
        <img src='/images/svg/Clear.svg' alt='Clear' width={28} height={28} />
      </Button>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() =>
          dispatch({ type: 'SUBDIVIDE_LINES_ITR', payload: { itr: 1 } })
        }
      >
        <img
          src='/images/svg/2x2.svg'
          alt='Preset Square 2x2'
          width={28}
          height={28}
        />
      </Button>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() =>
          dispatch({ type: 'SUBDIVIDE_LINES_ITR', payload: { itr: 2 } })
        }
      >
        <img
          src='/images/svg/3x3.svg'
          alt='Preset Square 3x3'
          width={28}
          height={28}
        />
      </Button>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() =>
          dispatch({ type: 'SUBDIVIDE_LINES_ITR', payload: { itr: 3 } })
        }
      >
        <img
          src='/images/svg/4x4.svg'
          alt='Preset Square 4x4'
          width={28}
          height={28}
        />
      </Button>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() =>
          dispatch({
            type: 'SPLIT_INTO_TWO_HORIZONTAL_COMPONENTS',
          })
        }
      >
        <img
          src='/images/svg/Horizontal.svg'
          alt='Preset Square 2x2'
          width={28}
          height={28}
        />
      </Button>
      <Button
        disabled={state.exporting || !state.active}
        onClick={() => dispatch({ type: 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS' })}
      >
        <img
          src='/images/svg/Vertical.svg'
          alt='Preset Square 2x2'
          width={28}
          height={28}
        />
      </Button>
    </>
  );
};

export default EditorPresets;
