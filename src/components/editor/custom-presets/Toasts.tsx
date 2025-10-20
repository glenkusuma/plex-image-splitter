import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import type { Toast } from './types';

type Props = { toasts: Toast[] };

const Toasts: React.FC<Props> = ({ toasts }) => {
  return (
    <div className='pointer-events-none fixed right-3 top-3 z-[60] flex max-w-sm flex-col gap-2'>
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className={[
              'pointer-events-auto rounded px-3 py-2 text-sm shadow',
              t.kind === 'success'
                ? 'bg-green-600 text-white'
                : t.kind === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-100',
            ].join(' ')}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
