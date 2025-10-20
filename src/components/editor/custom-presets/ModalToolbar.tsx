import React, { useRef } from 'react';

import Button from '@/components/buttons/Button';

type Props = {
  fullscreen: boolean;
  setFullscreen: (v: boolean) => void;
  onExport: () => void;
  onImportFile: (f: File) => void;
  onClose: () => void;
};

const ModalToolbar: React.FC<Props> = ({
  fullscreen,
  setFullscreen,
  onExport,
  onImportFile,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className='mb-3 flex items-center gap-2'>
      <h3 className='text-lg font-semibold'>Custom Presets</h3>
      <div className='ml-auto flex items-center gap-2'>
        <Button
          size='sm'
          onClick={onExport}
          title='Export current guidelines as a JSON preset'
        >
          Export current state
        </Button>
        <input
          id='importPresetFile'
          name='importPresetFile'
          ref={fileInputRef}
          type='file'
          accept='application/json'
          className='hidden'
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
          }}
          aria-hidden='true'
        />
        <Button
          size='sm'
          onClick={() => fileInputRef.current?.click()}
          title='Import preset from JSON'
        >
          Import preset
        </Button>
        <Button
          size='sm'
          onClick={() => setFullscreen(!fullscreen)}
          title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <img
            src={
              fullscreen
                ? '/images/svg/Minimize.svg'
                : '/images/svg/Fullscreen.svg'
            }
            alt={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            width={20}
            height={20}
            style={{ filter: 'invert(1)' }}
          />
        </Button>
        <Button size='sm' onClick={onClose} title='Close' aria-label='Close'>
          <img
            src='/images/svg/Close.svg'
            alt='Close'
            width={20}
            height={20}
            style={{ filter: 'invert(1)' }}
          />
        </Button>
      </div>
    </div>
  );
};

export default ModalToolbar;
