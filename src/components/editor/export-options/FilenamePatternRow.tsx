import React from 'react';

import { useEditor } from '@/store/editor';

const FilenamePatternRow: React.FC = () => {
  const { state, dispatch } = useEditor();
  return (
    <div className='grid grid-cols-12 items-center gap-2'>
      <label className='col-span-5 text-gray-300' htmlFor='filenamePattern'>
        Filename pattern
      </label>
      <input
        id='filenamePattern'
        name='filenamePattern'
        type='text'
        className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
        value={state.exportFilenamePattern}
        onChange={(e) =>
          dispatch({
            type: 'SET_EXPORT_OPTIONS',
            payload: { filenamePattern: e.target.value },
          })
        }
        placeholder='image-{i}-split-{index}.png'
        title='Use placeholders: {i} (source index), {index} (slice index), {w} (width), {h} (height)'
      />
      <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'>
        <input
          type='checkbox'
          checked={state.exportUseFilenamePattern}
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS_FLAGS',
              payload: { useFilenamePattern: e.target.checked },
            })
          }
        />
        Use
      </label>
    </div>
  );
};

export default FilenamePatternRow;
