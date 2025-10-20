import React from 'react';

import { useEditor } from '@/store/editor';

const ZipNameRow: React.FC = () => {
  const { state, dispatch } = useEditor();
  return (
    <div className='grid grid-cols-12 items-center gap-2'>
      <label className='col-span-5 text-gray-300' htmlFor='zipName'>
        Zip file name
      </label>
      <input
        id='zipName'
        name='zipName'
        type='text'
        className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
        value={state.exportZipName}
        onChange={(e) =>
          dispatch({
            type: 'SET_EXPORT_OPTIONS',
            payload: { zipName: e.target.value || 'export.zip' },
          })
        }
        placeholder='export.zip'
        title='Name of the output zip file'
      />
      <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'>
        <input
          type='checkbox'
          id='useZipName'
          name='useZipName'
          checked={state.exportUseZipName}
          onChange={(e) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS_FLAGS',
              payload: { useZipName: e.target.checked },
            })
          }
        />
        Use
      </label>
    </div>
  );
};

export default ZipNameRow;
