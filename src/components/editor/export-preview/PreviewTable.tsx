import React from 'react';

import { SlicePreview } from '@/lib/export';

type TableProps = {
  loading: boolean;
  filteredItems: SlicePreview[];
  selected: Record<string, boolean>;
  setSelected: (next: Record<string, boolean>) => void;
  formatName: (p: SlicePreview) => string;
};

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className='w-full'>
      <div className='relative h-1 w-full overflow-hidden bg-gray-800'>
        <div className='bg-primary-500 absolute left-0 top-0 h-1 w-1/3 animate-[loading_1.2s_linear_infinite]' />
      </div>
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className='px-2 py-3'>
        <div className='mb-2 flex items-center justify-center gap-3'>
          <svg
            className='h-5 w-5 animate-spin text-gray-300'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
            ></path>
          </svg>
          <span className='text-sm text-gray-300'>Generating previews…</span>
        </div>
        <table className='w-full text-sm'>
          <thead className='sticky top-0 bg-gray-800'>
            <tr>
              <th className='px-2 py-2 text-left'>Sel</th>
              <th className='px-2 py-2 text-left'>Index</th>
              <th className='px-2 py-2 text-left'>Filename</th>
              <th className='px-2 py-2 text-left'>W×H</th>
              <th className='px-2 py-2 text-left'>Preview</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className='border-t border-gray-800'>
                <td className='px-2 py-3'>
                  <div className='h-4 w-4 rounded-sm bg-gray-800' />
                </td>
                <td className='px-2 py-3'>
                  <div className='h-4 w-6 rounded bg-gray-800' />
                </td>
                <td className='px-2 py-3'>
                  <div className='h-4 w-48 rounded bg-gray-800' />
                </td>
                <td className='px-2 py-3'>
                  <div className='h-4 w-12 rounded bg-gray-800' />
                </td>
                <td className='px-2 py-3'>
                  <div className='h-16 w-24 rounded bg-gray-800' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PreviewTable: React.FC<TableProps> = ({
  loading,
  filteredItems,
  selected,
  setSelected,
  formatName,
}) => {
  if (loading) return <LoadingSkeleton />;
  return (
    <table className='w-full text-sm'>
      <thead className='sticky top-0 bg-gray-800'>
        <tr>
          <th className='px-2 py-2 text-left'>Sel</th>
          <th className='px-2 py-2 text-left'>Index</th>
          <th className='px-2 py-2 text-left'>Filename</th>
          <th className='px-2 py-2 text-left'>W×H</th>
          <th className='px-2 py-2 text-left'>Preview</th>
        </tr>
      </thead>
      <tbody>
        {filteredItems.map((p) => {
          const key = `${p.i}-${p.index}`;
          const checked = !!selected[key];
          return (
            <tr key={key} className='border-t border-gray-800'>
              <td className='px-2 py-2'>
                <input
                  type='checkbox'
                  name={`select-${key}`}
                  aria-label={`Select slice source ${p.i} index ${p.index}`}
                  checked={checked}
                  onChange={(e) =>
                    setSelected({ ...selected, [key]: e.target.checked })
                  }
                />
              </td>
              <td className='px-2 py-2'>{p.index}</td>
              <td className='px-2 py-2'>{formatName(p)}</td>
              <td className='px-2 py-2'>
                {p.width}×{p.height}
              </td>
              <td className='px-2 py-2'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.dataUrl}
                  alt={p.name}
                  className='h-16 w-auto rounded border border-gray-700 bg-black object-contain'
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PreviewTable;
