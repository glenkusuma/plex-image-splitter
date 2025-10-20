import { useCallback, useMemo, useState } from 'react';

import { type SlicePreview, preparePreview } from '@/lib/export';

import { useEditor } from '@/store/editor';

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
  }, [
    filtersEnabled,
    items,
    useMinW,
    useMinH,
    useMaxW,
    useMaxH,
    minW,
    minH,
    maxW,
    maxH,
  ]);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const formatName = useCallback(
    (p: SlicePreview) => {
      const pattern =
        (state.exportUseFilenamePattern
          ? state.exportFilenamePattern
          : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';
      return pattern
        .replace('{i}', String(p.i))
        .replace('{index}', String(p.index))
        .replace('{w}', String(p.width))
        .replace('{h}', String(p.height));
    },
    [state.exportUseFilenamePattern, state.exportFilenamePattern]
  );

  const openPreview = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    const previews = await preparePreview(
      state,
      state.activeSrc ? [state.activeSrc] : []
    );
    setItems(previews);
    const initial: Record<string, boolean> = {};
    previews.forEach((p) => (initial[`${p.i}-${p.index}`] = true));
    setSelected(initial);
    setLoading(false);
  }, [state]);

  const regenerate = useCallback(async () => {
    setLoading(true);
    const previews = await preparePreview(
      state,
      state.activeSrc ? [state.activeSrc] : []
    );
    setItems(previews);
    const initial: Record<string, boolean> = {};
    previews.forEach((p) => (initial[`${p.i}-${p.index}`] = true));
    setSelected(initial);
    setLoading(false);
  }, [state]);

  const matchFromExportOptions = useCallback(() => {
    setFiltersEnabled(!!state.exportUseFilters);
    setUseMinW(!!state.exportUseMinWidth);
    setUseMinH(!!state.exportUseMinHeight);
    setUseMaxW(!!state.exportUseMaxWidth);
    setUseMaxH(!!state.exportUseMaxHeight);
    setMinW(Math.max(1, state.exportMinWidthPx || 1));
    setMinH(Math.max(1, state.exportMinHeightPx || 1));
    setMaxW(Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER));
    setMaxH(Math.max(1, state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER));
  }, [state]);

  const applyNaming = useCallback(() => {
    dispatch({
      type: 'SET_EXPORT_OPTIONS_FLAGS',
      payload: {
        useZipName: state.exportUseZipName,
        useFilenamePattern: state.exportUseFilenamePattern,
      },
    });
    dispatch({
      type: 'SET_EXPORT_OPTIONS',
      payload: {
        zipName: state.exportZipName,
        filenamePattern: state.exportFilenamePattern,
      },
    });
  }, [
    dispatch,
    state.exportUseZipName,
    state.exportUseFilenamePattern,
    state.exportZipName,
    state.exportFilenamePattern,
  ]);

  const resetFilters = useCallback(() => {
    setFiltersEnabled(false);
    setUseMinW(false);
    setUseMinH(false);
    setUseMaxW(false);
    setUseMaxH(false);
    setMinW(1);
    setMinH(1);
    setMaxW(Number.MAX_SAFE_INTEGER);
    setMaxH(Number.MAX_SAFE_INTEGER);
    dispatch({
      type: 'SET_EXPORT_OPTIONS_FLAGS',
      payload: {
        useFilters: false,
        useMinWidth: false,
        useMinHeight: false,
        useMaxWidth: false,
        useMaxHeight: false,
      },
    });
    dispatch({
      type: 'SET_EXPORT_OPTIONS',
      payload: { minWidthPx: 1, minHeightPx: 1 },
    });
    dispatch({
      type: 'SET_EXPORT_MAX',
      payload: {
        maxWidthPx: Number.MAX_SAFE_INTEGER,
        maxHeightPx: Number.MAX_SAFE_INTEGER,
      },
    });
  }, [dispatch]);

  const applyFiltersToExport = useCallback(() => {
    dispatch({
      type: 'SET_EXPORT_OPTIONS_FLAGS',
      payload: {
        useFilters: filtersEnabled,
        useMinWidth: useMinW,
        useMinHeight: useMinH,
        useMaxWidth: useMaxW,
        useMaxHeight: useMaxH,
      },
    });
    dispatch({
      type: 'SET_EXPORT_OPTIONS',
      payload: { minWidthPx: minW, minHeightPx: minH },
    });
    dispatch({
      type: 'SET_EXPORT_MAX',
      payload: { maxWidthPx: maxW, maxHeightPx: maxH },
    });
  }, [
    dispatch,
    filtersEnabled,
    useMinW,
    useMinH,
    useMaxW,
    useMaxH,
    minW,
    minH,
    maxW,
    maxH,
  ]);

  const exportAll = useCallback(async () => {
    const whitelist = new Set<string>();
    filteredItems.forEach((p) => whitelist.add(`${p.i}-${p.index}`));
    const blob = await (
      await import('@/lib/export')
    ).exportImages(state, state.activeSrc ? [state.activeSrc] : [], {
      whitelist,
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download =
      (state.exportUseZipName ? state.exportZipName : 'export.zip') ||
      'export.zip';
    a.click();
  }, [filteredItems, state]);

  const exportSelected = useCallback(async () => {
    const whitelist = new Set<string>();
    filteredItems.forEach((p) => {
      const key = `${p.i}-${p.index}`;
      if (selected[key]) whitelist.add(key);
    });
    const blob = await (
      await import('@/lib/export')
    ).exportImages(state, state.activeSrc ? [state.activeSrc] : [], {
      whitelist,
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download =
      (state.exportUseZipName ? state.exportZipName : 'export.zip') ||
      'export.zip';
    a.click();
  }, [filteredItems, selected, state]);

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
    applyFiltersToExport,
    exportAll,
    exportSelected,
  } as const;
};
