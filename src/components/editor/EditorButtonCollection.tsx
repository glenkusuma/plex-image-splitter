import React from 'react';

import Boundary from '@/components/Boundary';
import EditorBatchApplyButton from '@/components/editor/EditorBatchApplyButton';
import EditorExportOptions from '@/components/editor/EditorExportOptions';
import EditorExportPreviewModal from '@/components/editor/EditorExportPreviewModal';
import EditorPresets from '@/components/editor/EditorPresets';
import EditorSelectedGuidePanel from '@/components/editor/EditorSelectedGuidePanel';
import EditorTools from '@/components/editor/EditorTools';
import EditorUndoRedo from '@/components/editor/EditorUndoRedo';

// no store usage here; individual components consume the store as needed

const EditorButtonCollection = () => {
  return (
    <>
      {/* Editor Tools */}
      <div className='pt-4'>
        <h2 className='text-xl font-bold'>Editor Tools</h2>
        <Boundary />
      </div>
      <EditorTools />

      <EditorSelectedGuidePanel />

      {/* Presets */}
      <div className='pt-4'>
        <h2 className='text-xl font-bold'>Presets</h2>
        <Boundary />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <EditorPresets />
      </div>

      {/* History & Export */}
      <div className='pt-4'>
        <h2 className='text-xl font-bold'>History & Export</h2>
        <Boundary />
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <EditorUndoRedo />
      </div>
      <EditorExportOptions />
      <EditorExportPreviewModal />
      <EditorBatchApplyButton />
    </>
  );
};

export default EditorButtonCollection;
