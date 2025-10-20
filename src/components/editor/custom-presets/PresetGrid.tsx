import React from 'react';

import Button from '@/components/buttons/Button';

import type { NamedPreset } from './types';

type Props = {
  presets: NamedPreset[];
  exporting: boolean;
  active: boolean;
  onApply: (p: NamedPreset) => void;
  onOverwrite: (p: NamedPreset) => void;
  onRename: (p: NamedPreset) => void;
  onDelete: (p: NamedPreset) => void;
};

const PresetGrid: React.FC<Props> = ({
  presets,
  exporting,
  active,
  onApply,
  onOverwrite,
  onRename,
  onDelete,
}) => {
  if (presets.length === 0) {
    return <p className='p-3 text-xs text-gray-400'>No presets saved yet.</p>;
  }
  return (
    <div className='grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {presets.map((p) => (
        <div key={p.id} className='rounded border border-gray-700 p-2'>
          <div className='mb-2 text-sm font-medium'>{p.name}</div>
          <div className='mb-2 text-xs text-gray-400'>
            H{p.data.horizontalSplit?.length || 0} • V
            {p.data.verticalSplit?.length || 0}
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              size='sm'
              onClick={() => onApply(p)}
              disabled={exporting}
              title='Apply this preset'
            >
              Apply
            </Button>
            <Button
              size='sm'
              onClick={() => onOverwrite(p)}
              disabled={!active || exporting}
              title='Overwrite with current state'
            >
              Overwrite
            </Button>
            <Button
              size='sm'
              onClick={() => onRename(p)}
              disabled={!active || exporting}
              title='Rename preset'
            >
              Rename
            </Button>
            <Button
              size='sm'
              onClick={() => onDelete(p)}
              title='Delete preset'
              className='rounded border border-red-500 text-red-300 hover:bg-red-500'
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PresetGrid;
