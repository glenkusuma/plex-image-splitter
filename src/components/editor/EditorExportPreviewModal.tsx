import React, { useEffect, useMemo, useState } from 'react';

import { preparePreview, SlicePreview } from '@/lib/export';

import Button from '@/components/buttons/Button';

import { useEditor } from '@/store/editor';

declare global {
  interface Window { __openExportPreview?: () => Promise<void> | void }
}

const EditorExportPreviewModal = () => {
  const { state, dispatch } = useEditor();
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [items, setItems] = useState<SlicePreview[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(false);
  const [useMinW, setUseMinW] = useState<boolean>(false);
  const [useMinH, setUseMinH] = useState<boolean>(false);
  const [useMaxW, setUseMaxW] = useState<boolean>(false);
  const [useMaxH, setUseMaxH] = useState<boolean>(false);
  const [minW, setMinW] = useState<number>(1);
  const [minH, setMinH] = useState<number>(1);
  const [maxW, setMaxW] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [maxH, setMaxH] = useState<number>(Number.MAX_SAFE_INTEGER);
  const filteredItems = useMemo(() => {
    if (!filtersEnabled) return items;
    return items.filter((p) => {
      if (useMinW && p.width < minW) return false;
      if (useMinH && p.height < minH) return false;
      if (useMaxW && p.width > maxW) return false;
      if (useMaxH && p.height > maxH) return false;
      return true;
    });
  }, [filtersEnabled, items, useMinW, useMinH, useMaxW, useMaxH, minW, minH, maxW, maxH]);
  // Maps for filename placeholders
  const findexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredItems.forEach((p, idx) => map.set(`${p.i}-${p.index}`, idx));
    return map;
  }, [filteredItems]);
  const sindexMap = useMemo(() => {
    const map = new Map<string, number>();
    let s = 0;
    filteredItems.forEach((p) => {
      const key = `${p.i}-${p.index}`;
      if (selected[key]) {
        map.set(key, s);
        s += 1;
      }
    });
    return map;
  }, [filteredItems, selected]);
  const formatName = useMemo(() => {
    const pattern = (state.exportUseFilenamePattern ? state.exportFilenamePattern : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';
    return (p: SlicePreview): string => {
      const key = `${p.i}-${p.index}`;
      return pattern
        .replace('{i}', String(p.i))
        .replace('{index}', String(p.index))
        .replace('{w}', String(p.width))
        .replace('{h}', String(p.height))
        .replace('{findex}', String(findexMap.get(key) ?? ''))
        .replace('{sindex}', String(sindexMap.get(key) ?? ''));
    };
  }, [state.exportUseFilenamePattern, state.exportFilenamePattern, findexMap, sindexMap]);
  const selectedCount = useMemo(() => Object.entries(selected).filter(([k, v]) => v && filteredItems.find((p) => `${p.i}-${p.index}` === k)).length, [selected, filteredItems]);

  useEffect(() => {
    // listen for a custom event to open preview
    const onOpen = async () => {
      setOpen(true);
      setFullscreen(false);
      const srcs = state.activeSrc ? [state.activeSrc] : [];
      const previews = await preparePreview(state, srcs);
      setItems(previews);
      const initial: Record<string, boolean> = {};
      previews.forEach((p) => (initial[`${p.i}-${p.index}`] = true));
      setSelected(initial);
    };
    window.__openExportPreview = onOpen;
    return () => {
      if (window.__openExportPreview === onOpen) {
        window.__openExportPreview = undefined;
      }
    };
  }, [state]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className={
        [
          'overflow-hidden rounded-md bg-gray-900 p-4 text-white shadow-xl flex flex-col',
          fullscreen ? 'fixed inset-0 m-0 h-screen w-screen max-w-none rounded-none' : 'max-h-[85vh] w-[95vw] sm:max-w-3xl md:max-w-5xl xl:max-w-7xl',
        ].join(' ')
      }>
        <div className='mb-3 flex items-center gap-2'>
          <h3 className='text-lg font-semibold'>Export Preview</h3>
          <span className='ml-auto text-sm text-gray-300' title='Number of selected items out of filtered list'>Selected {selectedCount} / {filteredItems.length}</span>
          <Button size='sm' onClick={() => setFullscreen((f) => !f)} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{fullscreen ? 'Windowed' : 'Fullscreen'}</Button>
          <Button size='sm' onClick={() => setOpen(false)} title='Close preview'>Close</Button>
        </div>
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <Button size='sm' onClick={() => {
            const all: Record<string, boolean> = {};
            filteredItems.forEach((p) => (all[`${p.i}-${p.index}`] = true));
            setSelected(all);
          }} title='Select all filtered items'>Select all</Button>
          <Button size='sm' onClick={() => setSelected({})} title='Clear all selections'>Deselect all</Button>
          <Button size='sm' onClick={async () => {
            const previews = await preparePreview(state, state.activeSrc ? [state.activeSrc] : []);
            setItems(previews);
          }} title='Re-generate previews from current splits/options'>Regenerate</Button>
          <Button size='sm' onClick={() => setShowFilters((s) => !s)} title={showFilters ? 'Hide filters' : 'Show filters'}>{showFilters ? 'Hide filters' : 'Show filters'}</Button>
          <Button size='sm' onClick={() => setShowOptions((s) => !s)} title={showOptions ? 'Hide preview export options' : 'Show preview export options'}>{showOptions ? 'Hide options' : 'Show options'}</Button>
          <Button size='sm' onClick={() => {
            // Pull current Export Options into the preview controls
            setFiltersEnabled(!!state.exportUseFilters);
            setUseMinW(!!state.exportUseMinWidth);
            setUseMinH(!!state.exportUseMinHeight);
            setUseMaxW(!!state.exportUseMaxWidth);
            setUseMaxH(!!state.exportUseMaxHeight);
            setMinW(Math.max(1, state.exportMinWidthPx || 1));
            setMinH(Math.max(1, state.exportMinHeightPx || 1));
            setMaxW(Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER));
            setMaxH(Math.max(1, state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER));
          }} title='Match Preview filters to current Export Options'>Match from Export Options</Button>
        </div>
        {/* Naming & Zip options within preview (collapsible) */}
        {showOptions && (
          <div className='mb-3 rounded-md border border-gray-700 p-2'>
            <div className='mb-2 flex items-center gap-2'>
              <label className='text-sm'>Preview Export Options</label>
              <Button
                size='sm'
                className='ml-auto'
                onClick={() => {
                  // "Apply" ensures flags are set; values already update live via onChange
                  dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useZipName: state.exportUseZipName, useFilenamePattern: state.exportUseFilenamePattern } });
                  dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { zipName: state.exportZipName, filenamePattern: state.exportFilenamePattern } });
                }}
                title='Apply zip and filename pattern to export options'
              >Apply naming to Export</Button>
            </div>
            <div className='grid grid-cols-12 items-center gap-2'>
              <label className='col-span-5 text-gray-300' htmlFor='previewZipName'>Zip file name</label>
              <input id='previewZipName' name='previewZipName' type='text' className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
                value={state.exportZipName}
                onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { zipName: e.target.value || 'export.zip' } })}
                placeholder='export.zip' title='Name of the output zip file' />
              <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300' title='Use this zip name when exporting' htmlFor='previewZipNameUse'>
                <input id='previewZipNameUse' name='previewZipNameUse' type='checkbox' checked={state.exportUseZipName} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useZipName: e.target.checked } })} />
                Use
              </label>
            </div>
            <div className='mt-2 grid grid-cols-12 items-center gap-2'>
              <label className='col-span-5 text-gray-300' htmlFor='previewPattern'>Filename pattern</label>
              <input id='previewPattern' name='previewPattern' type='text' className='col-span-6 rounded bg-gray-800 px-2 py-1 text-white'
                value={state.exportFilenamePattern}
                onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { filenamePattern: e.target.value } })}
                placeholder='image-{i}-split-{index}.png'
                title='Use placeholders: {i} source, {index} slice-in-source, {w} width, {h} height, {findex} filtered index, {sindex} selected index' />
              <label className='col-span-1 inline-flex items-center gap-1 text-xs text-gray-300' title='Use this filename pattern when exporting' htmlFor='previewPatternUse'>
                <input id='previewPatternUse' name='previewPatternUse' type='checkbox' checked={state.exportUseFilenamePattern} onChange={(e) => dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useFilenamePattern: e.target.checked } })} />
                Use
              </label>
            </div>
            <p className='mt-2 text-xs text-gray-400'>Pattern placeholders: {`{i}`}, {`{index}`}, {`{w}`}, {`{h}`}, {`{findex}`} (index after filters), {`{sindex}`} (index in selected-for-export).</p>
          </div>
        )}
        {showFilters && (
          <div className='mb-3 rounded-md border border-gray-700 p-2'>
            <div className='mb-2 flex items-center gap-2'>
              <label className='text-sm' htmlFor='filtersEnable'>Filters</label>
              <label className='ml-auto inline-flex items-center gap-1 text-xs text-gray-300' htmlFor='filtersEnable'>
                <input id='filtersEnable' name='filtersEnable' type='checkbox' checked={filtersEnabled} onChange={(e) => setFiltersEnabled(e.target.checked)} />
                Enable
              </label>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {/* Min width */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-6 text-gray-300' htmlFor='modalMinW'>Min width</label>
                <input id='modalMinW' name='modalMinW' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white' value={String(minW)} onChange={(e) => setMinW(Math.max(1, Number(e.target.value || 1)))} />
                <label className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300' htmlFor='modalMinWUse'>
                  <input id='modalMinWUse' name='modalMinWUse' type='checkbox' checked={useMinW} onChange={(e) => setUseMinW(e.target.checked)} />
                  Use
                </label>
              </div>
              {/* Min height */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-6 text-gray-300' htmlFor='modalMinH'>Min height</label>
                <input id='modalMinH' name='modalMinH' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white' value={String(minH)} onChange={(e) => setMinH(Math.max(1, Number(e.target.value || 1)))} />
                <label className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300' htmlFor='modalMinHUse'>
                  <input id='modalMinHUse' name='modalMinHUse' type='checkbox' checked={useMinH} onChange={(e) => setUseMinH(e.target.checked)} />
                  Use
                </label>
              </div>
              {/* Max width */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-6 text-gray-300' htmlFor='modalMaxW'>Max width</label>
                <input id='modalMaxW' name='modalMaxW' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white' value={String(maxW)} onChange={(e) => setMaxW(Math.max(1, Number(e.target.value || 1)))} />
                <label className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300' htmlFor='modalMaxWUse'>
                  <input id='modalMaxWUse' name='modalMaxWUse' type='checkbox' checked={useMaxW} onChange={(e) => setUseMaxW(e.target.checked)} />
                  Use
                </label>
              </div>
              {/* Max height */}
              <div className='grid grid-cols-12 items-center gap-2'>
                <label className='col-span-6 text-gray-300' htmlFor='modalMaxH'>Max height</label>
                <input id='modalMaxH' name='modalMaxH' type='number' min={1} className='col-span-4 rounded bg-gray-800 px-2 py-1 text-white' value={String(maxH)} onChange={(e) => setMaxH(Math.max(1, Number(e.target.value || 1)))} />
                <label className='col-span-2 inline-flex items-center gap-1 text-xs text-gray-300' htmlFor='modalMaxHUse'>
                  <input id='modalMaxHUse' name='modalMaxHUse' type='checkbox' checked={useMaxH} onChange={(e) => setUseMaxH(e.target.checked)} />
                  Use
                </label>
              </div>
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <Button size='sm' onClick={() => {
                // reset local
                setFiltersEnabled(false);
                setUseMinW(false); setUseMinH(false); setUseMaxW(false); setUseMaxH(false);
                setMinW(1); setMinH(1); setMaxW(Number.MAX_SAFE_INTEGER); setMaxH(Number.MAX_SAFE_INTEGER);
                // reset only export filter-related options
                dispatch({ type: 'SET_EXPORT_OPTIONS_FLAGS', payload: { useFilters: false, useMinWidth: false, useMinHeight: false, useMaxWidth: false, useMaxHeight: false } });
                dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { minWidthPx: 1, minHeightPx: 1 } });
                dispatch({ type: 'SET_EXPORT_MAX', payload: { maxWidthPx: Number.MAX_SAFE_INTEGER, maxHeightPx: Number.MAX_SAFE_INTEGER } });
              }}>Reset filters</Button>
              <Button size='sm' variant='primary' onClick={() => {
                // apply local to export options
                dispatch({
                  type: 'SET_EXPORT_OPTIONS_FLAGS', payload: {
                    useFilters: filtersEnabled,
                    useMinWidth: useMinW,
                    useMinHeight: useMinH,
                    useMaxWidth: useMaxW,
                    useMaxHeight: useMaxH,
                  }
                });
                dispatch({ type: 'SET_EXPORT_OPTIONS', payload: { minWidthPx: minW, minHeightPx: minH } });
                dispatch({ type: 'SET_EXPORT_MAX', payload: { maxWidthPx: maxW, maxHeightPx: maxH } });
              }}>Apply to Export</Button>
            </div>
            <p className='mt-2 text-xs text-gray-400'>Toggle filters here, then “Apply to Export” to use them during export. “Reset filters” affects only filter-related export options.</p>
          </div>
        )}
        <div className='flex-1 overflow-auto rounded border border-gray-700'>
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
                      <input type='checkbox' name={`select-${key}`} aria-label={`Select slice source ${p.i} index ${p.index}`} checked={checked} onChange={(e) => setSelected((s) => ({ ...s, [key]: e.target.checked }))} />
                    </td>
                    <td className='px-2 py-2'>{p.index}</td>
                    <td className='px-2 py-2'>{formatName(p)}</td>
                    <td className='px-2 py-2'>{p.width}×{p.height}</td>
                    <td className='px-2 py-2'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.dataUrl} alt={p.name} className='h-16 w-auto rounded border border-gray-700 bg-black object-contain' />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <Button size='sm' onClick={async () => {
            // Export all filtered
            const whitelist = new Set<string>();
            filteredItems.forEach((p) => whitelist.add(`${p.i}-${p.index}`));
            const blob = await (await import('@/lib/export')).exportImages(state, state.activeSrc ? [state.activeSrc] : [], { whitelist });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = (state.exportUseZipName ? state.exportZipName : 'export.zip') || 'export.zip';
            a.click();
          }} title='Export all filtered items using current options'>Export All</Button>
          <Button size='sm' onClick={async () => {
            const whitelist = new Set<string>();
            filteredItems.forEach((p) => {
              const key = `${p.i}-${p.index}`;
              if (selected[key]) whitelist.add(key);
            });
            const blob = await (await import('@/lib/export')).exportImages(state, state.activeSrc ? [state.activeSrc] : [], { whitelist });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = (state.exportUseZipName ? state.exportZipName : 'export.zip') || 'export.zip';
            a.click();
          }} title='Export only the selected items using current options'>Export Selected</Button>
          <Button size='sm' onClick={() => setOpen(false)} title='Close preview'>Close</Button>
          <span className='ml-auto text-xs text-gray-400'>Tips: hover icons for tooltips; fullscreen removes gaps.</span>
        </div>
      </div>
    </div>
  );
};

export default EditorExportPreviewModal;
