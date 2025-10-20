import React, { useEffect, useMemo, useState } from 'react';

import Button from '@/components/buttons/Button';

import { MAX_SPLITS, useEditor } from '@/store/editor';

const EditorTools = () => {
  const { state, dispatch } = useEditor();
  const [hCount, setHCount] = useState<number>(1);
  const [vCount, setVCount] = useState<number>(1);
  const [showGuideColors, setShowGuideColors] = useState<boolean>(false);

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

  useEffect(() => {
    setHCount(state.horizontalSplit.length);
    setVCount(state.verticalSplit.length);
  }, [state.horizontalSplit.length, state.verticalSplit.length]);

  return (
    <div className='space-y-3'>
      {/* Group 1: Subdivide / Split / Add (three rows) */}
      <div className='space-y-2'>
        {/* Row 1: Subdivide (full-width) */}
        <div>
          <Button
            size='sm'
            title='Insert 1 evenly spaced guide between each pair of existing guides (both axes)'
            onClick={() =>
              dispatch({ type: 'SUBDIVIDE_LINES', payload: { count: 1 } })
            }
            disabled={
              state.horizontalSplit.length >= MAX_SPLITS / 2 ||
              state.verticalSplit.length >= MAX_SPLITS / 2 ||
              state.exporting ||
              !state.active
            }
            className='w-full'
          >
            Subdivide
          </Button>
        </div>

        {/* Row 2: H Split / V Split */}
        <div className='grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            title='Insert 1 evenly spaced horizontal guide between each pair'
            onClick={() =>
              dispatch({
                type: 'SUBDIVIDE_LINES_HORIZONTAL',
                payload: { count: 1 },
              })
            }
            disabled={
              state.horizontalSplit.length >= MAX_SPLITS / 2 ||
              !state.active ||
              state.exporting
            }
            className='w-full'
          >
            H Split
          </Button>
          <Button
            size='sm'
            title='Insert 1 evenly spaced vertical guide between each pair'
            onClick={() =>
              dispatch({
                type: 'SUBDIVIDE_LINES_VERTICAL',
                payload: { count: 1 },
              })
            }
            disabled={
              state.verticalSplit.length >= MAX_SPLITS / 2 ||
              !state.active ||
              state.exporting
            }
            className='w-full'
          >
            V Split
          </Button>
        </div>

        {/* Row 3: + H Line / + V Line */}
        <div className='grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            title='Add a new horizontal guide at 50% (center)'
            onClick={() =>
              dispatch({ type: 'ADD_NEW_HLINE', payload: { count: 1 } })
            }
            disabled={
              state.horizontalSplit.length >= MAX_SPLITS ||
              !state.active ||
              state.exporting
            }
            className='w-full'
          >
            <img
              src='/images/svg/Plus.svg'
              alt='+'
              width={12}
              height={12}
              style={{ filter: 'invert(1)' }}
              className='mr-2'
            />{' '}
            H Line
          </Button>
          <Button
            size='sm'
            title='Add a new vertical guide at 50% (center)'
            onClick={() =>
              dispatch({ type: 'ADD_NEW_VLINE', payload: { count: 1 } })
            }
            disabled={
              state.verticalSplit.length >= MAX_SPLITS ||
              !state.active ||
              state.exporting
            }
            className='w-full'
          >
            <img
              src='/images/svg/Plus.svg'
              alt='+'
              width={12}
              height={12}
              style={{ filter: 'invert(1)' }}
              className='mr-2'
            />{' '}
            V Line
          </Button>
        </div>
      </div>

      {/* Generate grid controls */}
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
            onChange={(e) =>
              setHCount(Math.max(0, Number(e.target.value || 0)))
            }
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
            onChange={(e) =>
              setVCount(Math.max(0, Number(e.target.value || 0)))
            }
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

      {/* Guidelines section */}
      <div className='rounded-md border border-gray-700 p-2'>
        {/* Collapsible guideline block */}
        <div className='gap-2 space-y-2 text-xs'>
          <button
            type='button'
            onClick={() => setShowGuideColors((s) => !s)}
            className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
            title='Show or hide guide colors and style options'
          >
            <span className='flex items-center gap-2 text-sm'>
              Guideline Options
            </span>
            <span className='ml-auto text-xs text-gray-400'>
              {showGuideColors ? 'Hide' : 'Show'}
            </span>
          </button>

          {showGuideColors && (
            <>
              {/* Show guides row (replaced with grid layout) */}
              <div className='mb-2 grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-12 flex items-center gap-2 text-sm'
                  htmlFor='guidesVisible'
                >
                  <input
                    id='guidesVisible'
                    name='guidesVisible'
                    type='checkbox'
                    title='Toggle guide visibility'
                    checked={state.guidesVisible}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_GUIDES_VISIBLE',
                        payload: { visible: e.target.checked },
                      })
                    }
                    disabled={!state.active || state.exporting}
                  />
                  Show guides
                </label>
              </div>

              {/* Snap row (replaced with grid layout) */}
              <div className='mt-2 grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 flex items-center gap-2 text-sm'
                  htmlFor='snapEnabled'
                >
                  <input
                    id='snapEnabled'
                    name='snapEnabled'
                    type='checkbox'
                    title={`Enable snapping. Dragging and arrow keys move by ${state.snapPx}px (hold Shift = ×4)`}
                    checked={state.snapEnabled}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_SNAP',
                        payload: { enabled: e.target.checked },
                      })
                    }
                  />
                  Snap to
                </label>

                <label htmlFor='snapPx' className='sr-only'>
                  Snap step (px)
                </label>
                <input
                  id='snapPx'
                  name='snapPx'
                  type='number'
                  min={1}
                  title='Snap step in pixels (applied to drag and arrow keys)'
                  value={state.snapPx}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SNAP',
                      payload: { px: Math.max(1, Number(e.target.value || 1)) },
                    })
                  }
                  className='col-span-4 w-full rounded bg-gray-800 px-2 py-1 text-white'
                  disabled={!state.snapEnabled}
                  aria-label='Snap step (px)'
                />
                <div
                  className='col-span-2 text-xs text-gray-400'
                  id='snapPxSuffix'
                >
                  px
                </div>
              </div>

              {/* H block */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <span className='col-span-6 text-gray-100'>H Line</span>
                <input
                  type='color'
                  id='guideColorH'
                  name='guideColorH'
                  value={state.guideColorH}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_GUIDE_COLORS',
                      payload: { h: e.target.value },
                    })
                  }
                  className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
                  aria-label='Horizontal color'
                  title='Horizontal guide color'
                />
                <div className='col-span-2' />
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 ml-4 text-gray-400'
                  htmlFor='guideOpacityH'
                >
                  Opacity
                </label>
                <input
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  id='guideOpacityH'
                  name='guideOpacityH'
                  value={Math.round(state.guideAlphaH * 100)}
                  onChange={(e) => {
                    const raw = isNaN(e.currentTarget.valueAsNumber)
                      ? 0
                      : e.currentTarget.valueAsNumber;
                    const clampedPct = Math.max(0, Math.min(100, raw));
                    dispatch({
                      type: 'SET_GUIDE_STYLE',
                      payload: { hAlpha: clampedPct / 100 },
                    });
                  }}
                  className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
                  title='Horizontal guide opacity (0 – 100%)'
                  aria-label='Horizontal opacity (%)'
                />
                <div className='col-span-2 text-gray-500'>%</div>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 ml-4 text-gray-400'
                  htmlFor='guideThicknessH'
                >
                  Thickness
                </label>
                <input
                  type='number'
                  min={1}
                  id='guideThicknessH'
                  name='guideThicknessH'
                  value={state.guideThicknessH}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_GUIDE_STYLE',
                      payload: {
                        hSize: Math.max(
                          1,
                          Math.round(
                            isNaN(e.currentTarget.valueAsNumber)
                              ? 1
                              : e.currentTarget.valueAsNumber
                          )
                        ),
                      },
                    })
                  }
                  className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
                  title='Horizontal guide thickness (px)'
                  aria-label='Horizontal thickness'
                />
                <div className='col-span-2 text-gray-500'>px</div>
              </div>

              {/* V block */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <span className='col-span-6 text-gray-100'>V Line</span>
                <input
                  type='color'
                  id='guideColorV'
                  name='guideColorV'
                  value={state.guideColorV}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_GUIDE_COLORS',
                      payload: { v: e.target.value },
                    })
                  }
                  className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
                  aria-label='Vertical color'
                  title='Vertical guide color'
                />
                <div className='col-span-2' />
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 ml-4 text-gray-400'
                  htmlFor='guideOpacityV'
                >
                  Opacity
                </label>
                <input
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  id='guideOpacityV'
                  name='guideOpacityV'
                  value={Math.round(state.guideAlphaV * 100)}
                  onChange={(e) => {
                    const raw = isNaN(e.currentTarget.valueAsNumber)
                      ? 0
                      : e.currentTarget.valueAsNumber;
                    const clampedPct = Math.max(0, Math.min(100, raw));
                    dispatch({
                      type: 'SET_GUIDE_STYLE',
                      payload: { vAlpha: clampedPct / 100 },
                    });
                  }}
                  className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
                  title='Vertical guide opacity (0 – 100%)'
                  aria-label='Vertical opacity (%)'
                />
                <div className='col-span-2 text-gray-500'>%</div>
              </div>
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 ml-4 text-gray-400'
                  htmlFor='guideThicknessV'
                >
                  Thickness
                </label>
                <input
                  type='number'
                  min={1}
                  id='guideThicknessV'
                  name='guideThicknessV'
                  value={state.guideThicknessV}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_GUIDE_STYLE',
                      payload: {
                        vSize: Math.max(
                          1,
                          Math.round(
                            isNaN(e.currentTarget.valueAsNumber)
                              ? 1
                              : e.currentTarget.valueAsNumber
                          )
                        ),
                      },
                    })
                  }
                  className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
                  title='Vertical guide thickness (px)'
                  aria-label='Vertical thickness'
                />
                <div className='col-span-2 text-gray-500'>px</div>
              </div>

              {/* Selected color block */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 text-gray-100'
                  htmlFor='selectedGuideColor'
                >
                  Selected Line
                </label>
                <input
                  id='selectedGuideColor'
                  name='selectedGuideColor'
                  type='color'
                  title='Selected guide color'
                  value={state.selectedGuideColor}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_GUIDE_COLORS',
                      payload: { selected: e.target.value },
                    })
                  }
                  className='col-span-4 h-8 w-16 rounded-sm border border-gray-700 bg-gray-800 p-0'
                />
                <div className='col-span-2' />
              </div>

              {/* Selected alpha */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label
                  className='col-span-6 ml-4 text-gray-400'
                  htmlFor='selectedGuideOpacity'
                >
                  Opacity
                </label>
                <input
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  id='selectedGuideOpacity'
                  name='selectedGuideOpacity'
                  value={Math.round(state.selectedGuideAlpha * 100)}
                  onChange={(e) => {
                    const raw = isNaN(e.currentTarget.valueAsNumber)
                      ? 0
                      : e.currentTarget.valueAsNumber;
                    const clampedPct = Math.max(0, Math.min(100, raw));
                    dispatch({
                      type: 'SET_GUIDE_STYLE',
                      payload: { selectedAlpha: clampedPct / 100 },
                    });
                  }}
                  className='col-span-4 h-8 w-16 rounded bg-gray-800 px-2 py-1 text-white'
                  title='Selected guide opacity (0 – 100%)'
                  aria-label='Selected guide opacity (%)'
                />
                <div className='col-span-2 text-gray-500'>%</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorTools;
