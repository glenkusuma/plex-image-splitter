import React, { useState } from 'react';

import { useEditor } from '@/store/editor';

const EditorExportOptions = () => {
  const { state, dispatch } = useEditor();
  const [show, setShow] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  return (
    <div className='mt-2'>
      <div className='rounded-md border border-gray-700 p-2'>
        <button
          type='button'
          onClick={() => setShow((s) => !s)}
          className='w-full text-left cursor-pointer select-none text-xs text-gray-300 flex items-center gap-2'
          title='Show or hide export options'
        >
          <label className='flex items-center gap-2 text-sm'>
            Export Options
          </label>
          <span className='ml-auto text-xs text-gray-400'>{show ? 'Hide' : 'Show'}</span>
        </button>

        {show && (
          <div className='mt-2 space-y-2'>
            <div className='grid grid-cols-12 items-center gap-2'>
              <label className='col-span-5 text-gray-300' htmlFor='zipName'>Zip file name</label>
              <input id='zipName' name='zipName' type='text' className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
                value={state.exportZipName}
                onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { zipName: e.target.value || 'export.zip' } })}
                placeholder='export.zip' title='Name of the output zip file' />
              <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'>
                <input type='checkbox' checked={state.exportUseZipName} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useZipName: e.target.checked } })} />
                Use
              </label>
            </div>
            <div className='grid grid-cols-12 items-center gap-2'>
              <label className='col-span-5 text-gray-300' htmlFor='filenamePattern'>Filename pattern</label>
              <input id='filenamePattern' name='filenamePattern' type='text' className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
                value={state.exportFilenamePattern}
                onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { filenamePattern: e.target.value } })}
                placeholder='image-{i}-split-{index}.png'
                title='Use placeholders: {i} (source index), {index} (slice index), {w} (width), {h} (height)' />
              <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'>
                <input type='checkbox' checked={state.exportUseFilenamePattern} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useFilenamePattern: e.target.checked } })} />
                Use
              </label>
            </div>
            <div className='rounded-md border border-gray-700 p-2'>
              <div className='mb-2 flex items-center gap-2'>
                <label className='text-sm'>Filters</label>
                <label className='ml-auto inline-flex items-center gap-1 text-xs text-gray-300'>
                  <input type='checkbox' checked={state.exportUseFilters} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useFilters: e.target.checked } })} />
                  Enable
                </label>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-5 text-gray-300' htmlFor='minWidthPx'>Min slice width</label>
                <input id='minWidthPx' name='minWidthPx' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
                  value={state.exportMinWidthPx}
                  onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { minWidthPx: Math.max(1, Number(e.target.value || 1)) } })}
                  title='Exclude slices narrower than this width (px)' />
                <label className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'>
                  <input type='checkbox' checked={state.exportUseMinWidth} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useMinWidth: e.target.checked } })} />
                  Use
                </label>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-5 text-gray-300' htmlFor='minHeightPx'>Min slice height</label>
                <input id='minHeightPx' name='minHeightPx' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
                  value={state.exportMinHeightPx}
                  onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { minHeightPx: Math.max(1, Number(e.target.value || 1)) } })}
                  title='Exclude slices shorter than this height (px)' />
                <label className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'>
                  <input type='checkbox' checked={state.exportUseMinHeight} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useMinHeight: e.target.checked } })} />
                  Use
                </label>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-5 text-gray-300' htmlFor='maxWidthPx'>Max slice width</label>
                <input id='maxWidthPx' name='maxWidthPx' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
                  value={Number.isFinite(state.exportMaxWidthPx) ? String(state.exportMaxWidthPx) : ''}
                  onChange={(e) => dispatch({ type: 'SET_EXPORT_MAX', payload: { maxWidthPx: Math.max(1, Number(e.target.value || 1)) } })}
                  title='Exclude slices wider than this width (px)' />
                <label className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'>
                  <input type='checkbox' checked={state.exportUseMaxWidth} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useMaxWidth: e.target.checked } })} />
                  Use
                </label>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-5 text-gray-300' htmlFor='maxHeightPx'>Max slice height</label>
                <input id='maxHeightPx' name='maxHeightPx' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
                  value={Number.isFinite(state.exportMaxHeightPx) ? String(state.exportMaxHeightPx) : ''}
                  onChange={(e) => dispatch({ type: 'SET_EXPORT_MAX', payload: { maxHeightPx: Math.max(1, Number(e.target.value || 1)) } })}
                  title='Exclude slices taller than this height (px)' />
                <label className='col-span-3 inline-flex items-center gap-1 text-xs text-gray-300'>
                  <input type='checkbox' checked={state.exportUseMaxHeight} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useMaxHeight: e.target.checked } })} />
                  Use
                </label>
              </div>
            </div>
            <ul className='list-inside list-disc text-xs text-gray-400'>
              <li>Pattern placeholders: {`{i}`} = source index, {`{index}`} = slice index, {`{w}`} = width, {`{h}`} = height.</li>
              <li>Filters apply only when "Enable" is turned on; you can toggle individual min/max constraints via their "Use" checkbox.</li>
              <li>Use the Preview button in the toolbar to see thumbnails and filenames before exporting.</li>
            </ul>
            <div className='pt-2'>
              <button
                type='button'
                onClick={() => setShowResetConfirm(true)}
                className='rounded border border-red-500 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10'
                title='Reset all export options to defaults'
              >Reset export options</button>
            </div>
            {showResetConfirm && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
                <div className='w-[90vw] max-w-sm rounded-md bg-gray-900 p-4 text-white shadow-xl'>
                  <h4 className='mb-2 text-base font-semibold'>Reset export options?</h4>
                  <p className='mb-4 text-sm text-gray-300'>This will restore filename pattern, zip name, and all filters to their defaults.</p>
                  <div className='flex items-center gap-2'>
                    <button type='button' className='rounded bg-gray-700 px-3 py-1 text-sm' onClick={() => setShowResetConfirm(false)}>Cancel</button>
                    <button type='button' className='ml-auto rounded bg-red-600 px-3 py-1 text-sm' onClick={() => { dispatch({ type: 'RESET_EXPORT_OPTIONS' }); setShowResetConfirm(false); }}>Reset</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorExportOptions;
