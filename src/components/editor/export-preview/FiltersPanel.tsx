import React from 'react';

import Button from '@/components/buttons/Button';

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
        {/* Min width */}
        <div className='grid grid-cols-12 items-center gap-2'>
          <label className='col-span-6 text-gray-300' htmlFor='modalMinW'>
            Min width
          </label>
          <input
            id='modalMinW'
            name='modalMinW'
            type='number'
            min={1}
            className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
            value={String(minW)}
            onChange={(e) => setMinW(Math.max(1, Number(e.target.value || 1)))}
          />
          <label
            className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300'
            htmlFor='modalMinWUse'
          >
            <input
              id='modalMinWUse'
              name='modalMinWUse'
              type='checkbox'
              checked={useMinW}
              onChange={(e) => setUseMinW(e.target.checked)}
            />
            Use
          </label>
        </div>
        {/* Min height */}
        <div className='grid grid-cols-12 items-center gap-2'>
          <label className='col-span-6 text-gray-300' htmlFor='modalMinH'>
            Min height
          </label>
          <input
            id='modalMinH'
            name='modalMinH'
            type='number'
            min={1}
            className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
            value={String(minH)}
            onChange={(e) => setMinH(Math.max(1, Number(e.target.value || 1)))}
          />
          <label
            className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300'
            htmlFor='modalMinHUse'
          >
            <input
              id='modalMinHUse'
              name='modalMinHUse'
              type='checkbox'
              checked={useMinH}
              onChange={(e) => setUseMinH(e.target.checked)}
            />
            Use
          </label>
        </div>
        {/* Max width */}
        <div className='grid grid-cols-12 items-center gap-2'>
          <label className='col-span-6 text-gray-300' htmlFor='modalMaxW'>
            Max width
          </label>
          <input
            id='modalMaxW'
            name='modalMaxW'
            type='number'
            min={1}
            className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
            value={String(maxW)}
            onChange={(e) => setMaxW(Math.max(1, Number(e.target.value || 1)))}
          />
          <label
            className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300'
            htmlFor='modalMaxWUse'
          >
            <input
              id='modalMaxWUse'
              name='modalMaxWUse'
              type='checkbox'
              checked={useMaxW}
              onChange={(e) => setUseMaxW(e.target.checked)}
            />
            Use
          </label>
        </div>
        {/* Max height */}
        <div className='grid grid-cols-12 items-center gap-2'>
          <label className='col-span-6 text-gray-300' htmlFor='modalMaxH'>
            Max height
          </label>
          <input
            id='modalMaxH'
            name='modalMaxH'
            type='number'
            min={1}
            className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white'
            value={String(maxH)}
            onChange={(e) => setMaxH(Math.max(1, Number(e.target.value || 1)))}
          />
          <label
            className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300'
            htmlFor='modalMaxHUse'
          >
            <input
              id='modalMaxHUse'
              name='modalMaxHUse'
              type='checkbox'
              checked={useMaxH}
              onChange={(e) => setUseMaxH(e.target.checked)}
            />
            Use
          </label>
        </div>
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <Button size='sm' onClick={onReset}>
          Reset filters
        </Button>
        <Button size='sm' variant='primary' onClick={onApplyToExport}>
          Apply to Export
        </Button>
      </div>
      <p className='mt-2 text-xs text-gray-400'>
        Toggle filters here, then “Apply to Export” to use them during export.
        “Reset filters” affects only filter-related export options.
      </p>
    </div>
  );
};

export default FiltersPanel;
