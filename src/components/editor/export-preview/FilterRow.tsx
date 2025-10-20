import React from 'react';

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  useFlag: boolean;
  onToggleUse: (v: boolean) => void;
};

const FilterRow: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  useFlag,
  onToggleUse,
}) => {
  const inputId = `${id}`;
  const useId = `${id}Use`;
  return (
    <div className='grid grid-cols-12 items-center gap-2'>
      <label className='col-span-6 text-gray-300' htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        name={inputId}
        type='number'
        min={1}
        className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
        value={String(value)}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value || 1)))}
      />
      <label
        className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300'
        htmlFor={useId}
      >
        <input
          id={useId}
          name={useId}
          type='checkbox'
          checked={useFlag}
          onChange={(e) => onToggleUse(e.target.checked)}
        />
        Use
      </label>
    </div>
  );
};

export default FilterRow;
