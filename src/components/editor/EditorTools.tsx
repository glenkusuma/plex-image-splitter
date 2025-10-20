import React from 'react';

import GenerateGridControls from '@/components/editor/tools/GenerateGridControls';
import GuidelineOptions from '@/components/editor/tools/GuidelineOptions';
import SubdivideAddSplit from '@/components/editor/tools/SubdivideAddSplit';

const EditorTools: React.FC = () => {
  return (
    <div className='space-y-3'>
      <SubdivideAddSplit />
      <GenerateGridControls />
      <GuidelineOptions />
    </div>
  );
};

export default EditorTools;
