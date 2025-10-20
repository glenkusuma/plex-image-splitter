import React from 'react';

import HLineStyles from './HLineStyles';
import SelectedLineStyles from './SelectedLineStyles';
import VLineStyles from './VLineStyles';

const GuidelineStyles: React.FC = () => {
  return (
    <>
      <HLineStyles />
      <VLineStyles />
      <SelectedLineStyles />
    </>
  );
};

export default GuidelineStyles;
