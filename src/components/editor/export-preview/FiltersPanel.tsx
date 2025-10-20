import React from 'react';

import Button from '@/components/buttons/Button';

import FilterRow from './FilterRow';

type Props = {
  show: boolean;
  filtersEnabled: boolean;
  setFiltersEnabled: (v: boolean) => void;
  minW: number;
  setMinW: (v: number) => void;
  minH: number;
  setMinH: (v: number) => void;
  maxW: number;
  setMaxW: (v: number) => void;
  maxH: number;
  setMaxH: (v: number) => void;
  useMinW: boolean;
  setUseMinW: (v: boolean) => void;
  useMinH: boolean;
  setUseMinH: (v: boolean) => void;
  useMaxW: boolean;
  setUseMaxW: (v: boolean) => void;
  useMaxH: boolean;
  setUseMaxH: (v: boolean) => void;
  onReset: () => void;
  onApplyToExport: () => void;
};

const FiltersPanel: React.FC<Props> = ({
  show,
  filtersEnabled,
  setFiltersEnabled,
  minW,
  setMinW,
  minH,
  setMinH,
  maxW,
  setMaxW,
  maxH,
  setMaxH,
  useMinW,
  setUseMinW,
  useMinH,
  setUseMinH,
  useMaxW,
  setUseMaxW,
  useMaxH,
  setUseMaxH,
  onReset,
  onApplyToExport,
}) => {
  if (!show) return null;
  return (
    <div className='mb-3 rounded-md border border-gray-700 p-2'>
      <div className='mb-2 flex items-center gap-2'>
        <label className='text-sm' htmlFor='filtersEnable'>
          Filters
        </label>
        <label
          className='ml-auto inline-flex items-center gap-1 text-xs text-gray-300'
          htmlFor='filtersEnable'
        >
          <input
            id='filtersEnable'
            name='filtersEnable'
            type='checkbox'
            checked={filtersEnabled}
            onChange={(e) => setFiltersEnabled(e.target.checked)}
          />
          Enable
        </label>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <FilterRow
          id='modalMinW'
          label='Min width'
          value={minW}
          onChange={setMinW}
          useFlag={useMinW}
          onToggleUse={setUseMinW}
        />
        <FilterRow
          id='modalMinH'
          label='Min height'
          value={minH}
          onChange={setMinH}
          useFlag={useMinH}
          onToggleUse={setUseMinH}
        />
        <FilterRow
          id='modalMaxW'
          label='Max width'
          value={maxW}
          onChange={setMaxW}
          useFlag={useMaxW}
          onToggleUse={setUseMaxW}
        />
        <FilterRow
          id='modalMaxH'
          label='Max height'
          value={maxH}
          onChange={setMaxH}
          useFlag={useMaxH}
          onToggleUse={setUseMaxH}
        />
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <Button size='sm' onClick={onReset}>
          Reset filters
        </Button>
        <Button size='sm' variant='primary' onClick={onApplyToExport}>
          Apply to Export Options
        </Button>
      </div>
      <p className='mt-2 text-xs text-gray-400'>
        Toggle filters here, then “Apply to Export Options” to use them during
        export. “Reset filters” affects only filter-related export options.
      </p>
    </div>
  );
};

export default FiltersPanel;
