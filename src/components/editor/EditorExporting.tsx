import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { useEditor } from '@/store/editor';

const EditorExporting = () => {
  const { state } = useEditor();
  return (
    <>
      <AnimatePresence>
        {state.exporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50'
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className='rounded-lg bg-white p-4'
            >
              <div className='flex items-center justify-center'>
                <img src='/1485.gif' alt='loading' className='h-8 w-8' />
                <span className='ml-2'>Exporting...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditorExporting;
