import { useCallback, useMemo, useState } from 'react';

import type { SlicePreview } from '@/lib/export';

import { useEditor } from '@/store/editor';

import { useExportPreviewActions } from './useExportPreviewActions';
import { useFilters } from './useFilters';

export const useExportPreviewState = () => {
  const { state, dispatch } = useEditor();

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [items, setItems] = useState<SlicePreview[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Filter state (independent from export options until applied)
  const {
    filtersEnabled,
    setFiltersEnabled,
    useMinW,
    setUseMinW,
    useMinH,
    setUseMinH,
    useMaxW,
    setUseMaxW,
    useMaxH,
    setUseMaxH,
    minW,
    setMinW,
    minH,
    setMinH,
    maxW,
    setMaxW,
    maxH,
    setMaxH,
    filteredItems,
  } = useFilters(items);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  // Index maps for preview filename pattern substitutions
  const findexMap = useMemo(() => {
    const m = new Map<string, number>();
    filteredItems.forEach((p, idx) => m.set(`${p.i}-${p.index}`, idx));
    return m;
  }, [filteredItems]);

  const sindexMap = useMemo(() => {
    const m = new Map<string, number>();
    let count = 0;
    filteredItems.forEach((p) => {
      const key = `${p.i}-${p.index}`;
      if (selected[key]) {
        m.set(key, count);
        count += 1;
      }
    });
    return m;
  }, [filteredItems, selected]);

  const formatName = useCallback(
    (p: SlicePreview) => {
      const pattern =
        (state.exportUseFilenamePattern
          ? state.exportFilenamePattern
          : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';
      const key = `${p.i}-${p.index}`;
      const findex = findexMap.get(key);
      const sindex = sindexMap.get(key);
      return pattern
        .replace('{i}', String(p.i))
        .replace('{index}', String(p.index))
        .replace('{w}', String(p.width))
        .replace('{h}', String(p.height))
        .replace('{findex}', findex !== undefined ? String(findex) : '')
        .replace('{sindex}', sindex !== undefined ? String(sindex) : '');
    },
    [
      state.exportUseFilenamePattern,
      state.exportFilenamePattern,
      findexMap,
      sindexMap,
    ]
  );

  const {
    openPreview,
    regenerate,
    matchFromExportOptions,
    applyNaming,
    resetFilters,
    resetOptions,
    applyFiltersToExport,
    exportAll,
    exportSelected,
  } = useExportPreviewActions(
    state,
    dispatch,
    {
      setOpen,
      setLoading,
      setItems,
      setSelected,
      setFiltersEnabled,
      setUseMinW,
      setUseMinH,
      setUseMaxW,
      setUseMaxH,
      setMinW,
      setMinH,
      setMaxW,
      setMaxH,
    },
    {
      filtersEnabled,
      useMinW,
      useMinH,
      useMaxW,
      useMaxH,
      minW,
      minH,
      maxW,
      maxH,
    },
    filteredItems,
    selected
  );

  return {
    // editor
    state,
    dispatch,
    // modal state
    open,
    setOpen,
    fullscreen,
    setFullscreen,
    items,
    setItems,
    selected,
    setSelected,
    loading,
    setLoading,
    showFilters,
    setShowFilters,
    showOptions,
    setShowOptions,
    // filters
    filtersEnabled,
    setFiltersEnabled,
    useMinW,
    setUseMinW,
    useMinH,
    setUseMinH,
    useMaxW,
    setUseMaxW,
    useMaxH,
    setUseMaxH,
    minW,
    setMinW,
    minH,
    setMinH,
    maxW,
    setMaxW,
    maxH,
    setMaxH,
    filteredItems,
    selectedCount,
    // helpers
    formatName,
    // actions
    openPreview,
    regenerate,
    matchFromExportOptions,
    applyNaming,
    resetFilters,
    resetOptions,
    applyFiltersToExport,
    exportAll,
    exportSelected,
  } as const;
};
