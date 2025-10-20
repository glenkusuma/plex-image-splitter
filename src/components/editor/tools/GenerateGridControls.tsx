import React, { useMemo, useState } from 'react';

import Button from '@/components/buttons/Button';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const GenerateGridControls: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [hCount, setHCount] = useState<number>(1);
  const [vCount, setVCount] = useState<number>(1);

  const disabledGenerate = useMemo(() => {
    if (!state.active || state.exporting) return true;
    if (hCount < 0 || vCount < 0) return true;
    if (hCount + state.horizontalSplit.length > MAX_SPLITS) return true;
    if (vCount + state.verticalSplit.length > MAX_SPLITS) return true;
    return false;
  }, [
    hCount,
    vCount,
    state.active,
    state.exporting,
    state.horizontalSplit.length,
    state.verticalSplit.length,
  ]);

  const onGenerate = () => {
    if (hCount <= 0 && vCount <= 0) return;
    dispatch({ type: 'GENERATE_GRID', payload: { hCount, vCount } });
  };

  return (
    <div>
      <label className='text-sm' htmlFor='genGridH'>
        Generate Grid
      </label>
      <div className='flex gap-2 pt-2'>
        <label htmlFor='genGridH' className='sr-only'>
          Horizontal count
        </label>
        <input
          id='genGridH'
          name='genGridH'
          type='number'
          min={0}
          value={hCount}
          onChange={(e) => setHCount(Math.max(0, Number(e.target.value || 0)))}
          className='w-16 rounded bg-gray-800 px-2 py-1 text-white'
          aria-label='Horizontal count'
          title='Horizontal guides: number of evenly spaced lines to generate'
        />
        <label htmlFor='genGridV' className='sr-only'>
          Vertical count
        </label>
        <input
          id='genGridV'
          name='genGridV'
          type='number'
          min={0}
          value={vCount}
          onChange={(e) => setVCount(Math.max(0, Number(e.target.value || 0)))}
          className='w-16 rounded bg-gray-800 px-2 py-1 text-white'
          aria-label='Vertical count'
          title='Vertical guides: number of evenly spaced lines to generate'
        />
        <Button
          size='sm'
          title='Generate evenly spaced guides based on the counts above'
          onClick={onGenerate}
          disabled={disabledGenerate}
        >
          Generate
        </Button>
      </div>
      <p className='pt-1 text-xs text-gray-400'>
        H / V — number of slices to insert (evenly distributed)
      </p>
    </div>
  );
};

export default GenerateGridControls;
