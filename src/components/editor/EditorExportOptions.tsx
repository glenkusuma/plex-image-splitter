import React, { useState } from 'react';

import FilenamePatternRow from '@/components/editor/export-options/FilenamePatternRow';
import FiltersSection from '@/components/editor/export-options/FiltersSection';
import ResetOptionsDialog from '@/components/editor/export-options/ResetOptionsDialog';
import ZipNameRow from '@/components/editor/export-options/ZipNameRow';

import { useEditor } from '@/store/editor';

const EditorExportOptions = () => {
  const { dispatch } = useEditor();
  const [show, setShow] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  return (
    <div className='mt-2'>
      <div className='rounded-md border border-gray-700 p-2'>
        <button
          type='button'
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
          aria-controls='export-options-panel'
          className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
          title='Show or hide export options'
        >
          <span className='flex items-center gap-2 text-sm'>
            Export Options
          </span>
          <span className='ml-auto text-xs text-gray-400'>
            {show ? 'Hide' : 'Show'}
          </span>
        </button>

        {show && (
          <div id='export-options-panel' className='mt-2 space-y-2'>
            <ZipNameRow />
            <FilenamePatternRow />
            <FiltersSection />
            <ul className='list-inside list-disc text-xs text-gray-400'>
              <li>
                Pattern placeholders: {`{i}`} = source index, {`{index}`} =
                slice index, {`{w}`} = width, {`{h}`} = height.
              </li>
              <li>
                Filters apply only when "Enable" is turned on; you can toggle
                individual min/max constraints via their "Use" checkbox.
              </li>
              <li>
                Use the Preview button in the toolbar to see thumbnails and
                filenames before exporting.
              </li>
            </ul>
            <div className='pt-2'>
              <button
                type='button'
                onClick={() => setShowResetConfirm(true)}
                className='rounded border border-red-500 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10'
                title='Reset all export options to defaults'
              >
                Reset export options
              </button>
            </div>
            <ResetOptionsDialog
              show={showResetConfirm}
              onCancel={() => setShowResetConfirm(false)}
              onConfirm={() => {
                dispatch({ type: 'RESET_EXPORT_OPTIONS' });
                setShowResetConfirm(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorExportOptions;
