import React from 'react';

import Button from '@/components/buttons/Button';

type FiltersBarProps = {
  loading: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRegenerate: () => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  showOptions: boolean;
  setShowOptions: (v: boolean) => void;
  onMatchFromExportOptions: () => void;
};

export const FiltersBar: React.FC<FiltersBarProps> = ({
  loading,
  onSelectAll,
  onDeselectAll,
  onRegenerate,
  showFilters,
  setShowFilters,
  showOptions,
  setShowOptions,
  onMatchFromExportOptions,
}) => {
  return (
    <div className='mb-3 flex items-center justify-between'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          size='sm'
          onClick={onSelectAll}
          title='Select all filtered items'
          disabled={loading}
        >
          Select all
        </Button>
        <Button
          size='sm'
          onClick={onDeselectAll}
          title='Clear all selections'
          disabled={loading}
        >
          Deselect all
        </Button>
        <Button
          size='sm'
          onClick={onRegenerate}
          title='Re-generate previews from current splits/options'
          aria-label='Regenerate previews'
          disabled={loading}
        >
          <img
            src='/images/svg/Regenerate.svg'
            alt='Regenerate previews'
            width={20}
            height={20}
            style={{ filter: 'invert(1)' }}
          />
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          size='sm'
          onClick={() => !loading && setShowFilters(!showFilters)}
          title={showFilters ? 'Hide filters' : 'Show filters'}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
          disabled={loading}
        >
          <img
            src='/images/svg/Filter.svg'
            alt={showFilters ? 'Hide filters' : 'Show filters'}
            width={20}
            height={20}
            style={{ filter: 'invert(1)' }}
          />
        </Button>
        <Button
          size='sm'
          onClick={() => !loading && setShowOptions(!showOptions)}
          title={
            showOptions
              ? 'Hide preview export options'
              : 'Show preview export options'
          }
          aria-label={
            showOptions
              ? 'Hide preview export options'
              : 'Show preview export options'
          }
          disabled={loading}
        >
          <img
            src='/images/svg/Options.svg'
            alt={
              showOptions
                ? 'Hide preview export options'
                : 'Show preview export options'
            }
            width={20}
            height={20}
            style={{ filter: 'invert(1)' }}
          />
        </Button>
        <Button
          size='sm'
          onClick={onMatchFromExportOptions}
          title='Match Preview filters to current Export Options'
          disabled={loading}
        >
          Match from Export Options
        </Button>
      </div>
    </div>
  );
};

type OptionsBarProps = {
  show: boolean;
  exportZipName: string;
  exportUseZipName: boolean;
  exportFilenamePattern: string;
  exportUseFilenamePattern: boolean;
  setZipName: (v: string) => void;
  setUseZipName: (v: boolean) => void;
  setFilenamePattern: (v: string) => void;
  setUseFilenamePattern: (v: boolean) => void;
  onApplyNaming: () => void;
  onReset: () => void;
};

export const OptionsBar: React.FC<OptionsBarProps> = ({
  show,
  exportZipName,
  exportUseZipName,
  exportFilenamePattern,
  exportUseFilenamePattern,
  setZipName,
  setUseZipName,
  setFilenamePattern,
  setUseFilenamePattern,
  onApplyNaming,
  onReset,
}) => {
  if (!show) return null;
  return (
    <div className='mb-3 rounded-md border border-gray-700 p-2'>
      <div className='mb-2 flex items-center gap-2'>
        <span className='text-sm'>Preview Export Options</span>
      </div>

      <div className='grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='previewZipName'>
          Zip file name
        </label>
        <input
          id='previewZipName'
          name='previewZipName'
          type='text'
          className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
          value={exportZipName}
          onChange={(e) => setZipName(e.target.value || 'export.zip')}
          placeholder='export.zip'
          title='Name of the output zip file'
        />
        <label
          className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'
          title='Use this zip name when exporting'
          htmlFor='previewZipNameUse'
        >
          <input
            id='previewZipNameUse'
            name='previewZipNameUse'
            type='checkbox'
            checked={exportUseZipName}
            onChange={(e) => setUseZipName(e.target.checked)}
          />
          Use
        </label>
      </div>

      <div className='mt-2 grid grid-cols-12 items-center gap-2'>
        <label className='col-span-5 text-gray-300' htmlFor='previewPattern'>
          Filename pattern
        </label>
        <input
          id='previewPattern'
          name='previewPattern'
          type='text'
          className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
          value={exportFilenamePattern}
          onChange={(e) => setFilenamePattern(e.target.value)}
          placeholder='image-{i}-split-{index}.png'
          title='Use placeholders: {i} source, {index} slice-in-source, {w} width, {h} height, {findex} filtered index, {sindex} selected index'
        />
        <label
          className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300'
          title='Use this filename pattern when exporting'
          htmlFor='previewPatternUse'
        >
          <input
            id='previewPatternUse'
            name='previewPatternUse'
            type='checkbox'
            checked={exportUseFilenamePattern}
            onChange={(e) => setUseFilenamePattern(e.target.checked)}
          />
          Use
        </label>
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <Button size='sm' onClick={onReset}>
          Reset options
        </Button>
        <Button size='sm' variant='primary' onClick={onApplyNaming}>
          Apply to Export Options
        </Button>
      </div>
      <p className='mt-2 text-xs text-gray-400'>
        Pattern placeholders: {`{i}`}, {`{index}`}, {`{w}`}, {`{h}`},{' '}
        {`{findex}`} (index after filters), {`{sindex}`} (index in
        selected-for-export).
      </p>
    </div>
  );
};
