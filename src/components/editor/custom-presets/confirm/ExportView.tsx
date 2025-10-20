import React, { useMemo, useState } from 'react';

import Button from '@/components/buttons/Button';

type Props = {
  defaultName: string;
  busy: boolean;
  onExport: (name: string) => void;
  onCancel: () => void;
};

const ExportView: React.FC<Props> = ({
  defaultName,
  busy,
  onExport,
  onCancel,
}) => {
  const [name, setName] = useState(defaultName);
  const valid = useMemo(() => name.trim().length > 0, [name]);

  return (
    <div className='space-y-3'>
      <p className='text-sm text-gray-300'>
        Enter a name for the exported preset file.
      </p>
      <div className='grid grid-cols-12 items-center gap-2'>
        <label htmlFor='exportPresetName' className='col-span-4 text-gray-300'>
          Preset name
        </label>
        <input
          id='exportPresetName'
          name='exportPresetName'
          type='text'
          className='col-span-8 rounded bg-gray-800 px-2 py-1 text-white'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Preset name'
        />
      </div>
      <div className='flex items-center justify-end gap-2'>
        <Button size='sm' onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          size='sm'
          variant='primary'
          onClick={() => valid && onExport(name.trim())}
          disabled={!valid || busy}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default ExportView;
