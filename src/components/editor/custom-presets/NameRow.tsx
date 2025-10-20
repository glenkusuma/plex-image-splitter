import React from 'react';

import Button from '@/components/buttons/Button';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClearAll: () => void;
  disabledSave?: boolean;
};

const NameRow: React.FC<Props> = ({
  value,
  onChange,
  onSave,
  onClearAll,
  disabledSave,
}) => {
  return (
    <div className='mb-3 grid grid-cols-12 items-center gap-2'>
      <label className='col-span-2 text-gray-300' htmlFor='presetName'>
        Name
      </label>
      <input
        id='presetName'
        name='presetName'
        type='text'
        className='col-span-7 rounded bg-gray-800 px-2 py-1 text-white'
        placeholder='My preset'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className='col-span-3 flex gap-2'>
        <Button
          size='sm'
          onClick={onSave}
          disabled={disabledSave}
          title='Save current guidelines as a preset'
        >
          Save
        </Button>
        <Button size='sm' onClick={onClearAll} title='Delete all saved presets'>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default NameRow;
