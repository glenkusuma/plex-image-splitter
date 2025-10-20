import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef } from 'react';

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  intent?: 'normal' | 'danger';
  size?: 'sm' | 'lg';
  children: React.ReactNode;
};

const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  title,
  intent = 'normal',
  size = 'sm',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevActive = useRef<HTMLElement | null>(null);

  const tint = useMemo(
    () =>
      intent === 'danger'
        ? {
            header: 'from-red-500 to-red-600',
            ring: 'ring-red-500/30 border-red-500/20',
            title: 'text-red-50',
          }
        : {
            header: 'from-blue-500 to-blue-600',
            ring: 'ring-blue-500/30 border-blue-500/20',
            title: 'text-blue-50',
          },
    [intent]
  );

  useEffect(() => {
    if (!open) return;
    prevActive.current = document.activeElement as HTMLElement | null;
    // Focus container when opened
    containerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Restore focus
      prevActive.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'
        >
          <motion.div
            ref={containerRef}
            tabIndex={-1}
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-shell-title'
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={[
              'overflow-hidden rounded-lg border bg-gray-900 text-white shadow-2xl',
              tint.ring,
              size === 'sm' && 'w-[90vw] max-w-sm',
              size === 'lg' &&
                'w-[95vw] sm:max-w-3xl md:max-w-5xl xl:max-w-7xl',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center justify-between bg-gradient-to-r px-4 py-2',
                tint.header,
              ].join(' ')}
            >
              <h3
                id='modal-shell-title'
                className={['text-sm font-semibold', tint.title].join(' ')}
              >
                {title}
              </h3>
              <button
                type='button'
                onClick={onClose}
                title='Close'
                aria-label='Close'
                className='inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10 focus-visible:ring focus-visible:ring-white/40'
              >
                <img
                  src='images/svg/Close.svg'
                  alt='Close'
                  width={16}
                  height={16}
                  style={{ filter: 'invert(1)' }}
                />
              </button>
            </div>
            <div className='p-4'>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalShell;
