import React from 'react';

import Button from '@/components/buttons/Button';

import { Bullets, reindex, stableImportOverwrite } from './utils';
import type { NamedPreset } from '../types';

type Props = {
  presets: NamedPreset[];
  toAdd: NamedPreset[];
  duplicates: NamedPreset[];
  onPersist: (next: NamedPreset[]) => void;
  onCancel: () => void;
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
};

const ImportConfirmView: React.FC<Props> = ({
  presets,
  toAdd,
  duplicates,
  onPersist,
  onCancel,
  showToast,
}) => {
  return (
    <>
      <h4 className='mb-2 text-base font-semibold'>
        Import presets: duplicates found
      </h4>
      <div className='mb-4 text-sm text-gray-300'>
        <p className='mb-2'>
          Total incoming: {toAdd.length + duplicates.length}
        </p>
        <p className='mb-1'>Unique: {toAdd.length}</p>
        {!!toAdd.length && (
          <div className='mb-2'>
            <p className='text-xs text-gray-400'>Names:</p>
            <Bullets items={toAdd.map((p) => p.name)} />
          </div>
        )}
        <p className='mb-1'>Duplicates: {duplicates.length}</p>
        {!!duplicates.length && (
          <div>
            <p className='text-xs text-gray-400'>Duplicate names:</p>
            <Bullets items={duplicates.map((p) => p.name)} />
          </div>
        )}
        <p className='mt-2 text-xs text-gray-400'>
          Choose Overwrite to replace matching names, or Skip to keep your
          existing presets.
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          className='rounded bg-gray-700 px-3 py-1 text-sm'
          onClick={onCancel}
        >
          Cancel
        </button>
        <Button
          size='sm'
          onClick={() => {
            const ordered = stableImportOverwrite(presets, toAdd, duplicates);
            onPersist(ordered);
            showToast(
              `Imported ${toAdd.length + duplicates.length} preset${
                toAdd.length + duplicates.length !== 1 ? 's' : ''
              } (overwrote ${duplicates.length})`,
              'success'
            );
            onCancel();
          }}
        >
          Overwrite duplicates
        </Button>
        <Button
          size='sm'
          className='ml-auto'
          onClick={() => {
            const current = [...presets].sort((a, b) => a.order - b.order);
            const next = reindex([...current, ...toAdd]);
            onPersist(next);
            showToast(
              `Imported ${toAdd.length} preset${
                toAdd.length !== 1 ? 's' : ''
              } (skipped ${duplicates.length})`,
              'success'
            );
            onCancel();
          }}
        >
          Skip duplicates
        </Button>
      </div>
    </>
  );
};

export default ImportConfirmView;
