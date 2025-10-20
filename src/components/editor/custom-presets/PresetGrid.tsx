import React, { useState } from 'react';

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
  onSort: (next: NamedPreset[]) => void;
};

const PresetGrid: React.FC<Props> = ({
  presets,
  exporting,
  active,
  onApply,
  onOverwrite,
  onRename,
  onDelete,
  onSort,
}) => {
  const [sortKey, setSortKey] = useState<'id' | 'createdAt' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const fmtDate = (ts: number) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return String(ts);
    }
  };

  const handleSort = (key: 'id' | 'createdAt') => {
    const nextDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    const sorted = [...presets].sort((a, b) => {
      let comp = 0;
      if (key === 'id') comp = String(a.id).localeCompare(String(b.id));
      if (key === 'createdAt') comp = a.createdAt - b.createdAt;
      return nextDir === 'asc' ? comp : -comp;
    });
    const reindexed = sorted.map((p, i) => ({ ...p, order: i }));
    onSort(reindexed);
    setSortKey(key);
    setSortDir(nextDir);
  };

  if (presets.length === 0) {
    return <p className='p-3 text-xs text-gray-400'>No presets saved yet.</p>;
  }
  return (
    <div className='p-2'>
      <div className='mb-2 flex items-center gap-2'>
        <span className='text-xs text-gray-400'>Sort by:</span>
        <Button
          size='sm'
          variant='outline'
          onClick={() => handleSort('id')}
          title='Sort by ID'
        >
          ID {sortKey === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => handleSort('createdAt')}
          title='Sort by Created At'
        >
          Created{' '}
          {sortKey === 'createdAt' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </Button>
      </div>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {presets.map((p) => (
          <div key={p.id} className='rounded border border-gray-700 p-2'>
            <div className='mb-2 text-sm font-medium'>{p.name}</div>
            <div className='mb-2 text-xs text-gray-400'>
              H{p.data.horizontalSplit?.length || 0} • V
              {p.data.verticalSplit?.length || 0}
            </div>
            <div className='mb-2 space-y-0.5'>
              <div className='text-[10px] text-gray-500'>ID: {p.id}</div>
              <div className='text-[10px] text-gray-500'>
                Created: {fmtDate(p.createdAt)}
              </div>
              <div className='text-[10px] text-gray-500'>
                Updated: {fmtDate(p.updatedAt)}
              </div>
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
    </div>
  );
};

export default PresetGrid;
