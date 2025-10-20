import type { Dispatch, SetStateAction } from 'react';

import { type SlicePreview, preparePreview } from '@/lib/export';

import type { EditorState } from '@/store/editor';
import type { Action } from '@/store/editor/types';

export const openPreviewFn = async (
  state: EditorState,
  setOpen: (v: boolean) => void,
  setLoading: (v: boolean) => void,
  setItems: (items: SlicePreview[]) => void,
  setSelected: (sel: Record<string, boolean>) => void
) => {
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
};

export const regenerateFn = async (
  state: EditorState,
  setLoading: (v: boolean) => void,
  setItems: (items: SlicePreview[]) => void,
  setSelected: (sel: Record<string, boolean>) => void
) => {
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
};

export const matchFromExportOptionsFn = (
  state: EditorState,
  setters: {
    setFiltersEnabled: Dispatch<SetStateAction<boolean>>;
    setUseMinW: Dispatch<SetStateAction<boolean>>;
    setUseMinH: Dispatch<SetStateAction<boolean>>;
    setUseMaxW: Dispatch<SetStateAction<boolean>>;
    setUseMaxH: Dispatch<SetStateAction<boolean>>;
    setMinW: Dispatch<SetStateAction<number>>;
    setMinH: Dispatch<SetStateAction<number>>;
    setMaxW: Dispatch<SetStateAction<number>>;
    setMaxH: Dispatch<SetStateAction<number>>;
  }
) => {
  setters.setFiltersEnabled(!!state.exportUseFilters);
  setters.setUseMinW(!!state.exportUseMinWidth);
  setters.setUseMinH(!!state.exportUseMinHeight);
  setters.setUseMaxW(!!state.exportUseMaxWidth);
  setters.setUseMaxH(!!state.exportUseMaxHeight);
  setters.setMinW(Math.max(1, state.exportMinWidthPx || 1));
  setters.setMinH(Math.max(1, state.exportMinHeightPx || 1));
  setters.setMaxW(
    Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER)
  );
  setters.setMaxH(
    Math.max(1, state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER)
  );
};

export const applyNamingFn = (
  state: EditorState,
  dispatch: (action: Action) => void
) => {
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
};

export const resetFiltersFn = (
  dispatch: (action: Action) => void,
  setters: {
    setFiltersEnabled: Dispatch<SetStateAction<boolean>>;
    setUseMinW: Dispatch<SetStateAction<boolean>>;
    setUseMinH: Dispatch<SetStateAction<boolean>>;
    setUseMaxW: Dispatch<SetStateAction<boolean>>;
    setUseMaxH: Dispatch<SetStateAction<boolean>>;
    setMinW: Dispatch<SetStateAction<number>>;
    setMinH: Dispatch<SetStateAction<number>>;
    setMaxW: Dispatch<SetStateAction<number>>;
    setMaxH: Dispatch<SetStateAction<number>>;
  }
) => {
  setters.setFiltersEnabled(false);
  setters.setUseMinW(false);
  setters.setUseMinH(false);
  setters.setUseMaxW(false);
  setters.setUseMaxH(false);
  setters.setMinW(1);
  setters.setMinH(1);
  setters.setMaxW(Number.MAX_SAFE_INTEGER);
  setters.setMaxH(Number.MAX_SAFE_INTEGER);
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
};

export const applyFiltersToExportFn = (
  dispatch: (action: Action) => void,
  filters: {
    filtersEnabled: boolean;
    useMinW: boolean;
    useMinH: boolean;
    useMaxW: boolean;
    useMaxH: boolean;
    minW: number;
    minH: number;
    maxW: number;
    maxH: number;
  }
) => {
  dispatch({
    type: 'SET_EXPORT_OPTIONS_FLAGS',
    payload: {
      useFilters: filters.filtersEnabled,
      useMinWidth: filters.useMinW,
      useMinHeight: filters.useMinH,
      useMaxWidth: filters.useMaxW,
      useMaxHeight: filters.useMaxH,
    },
  });
  dispatch({
    type: 'SET_EXPORT_OPTIONS',
    payload: { minWidthPx: filters.minW, minHeightPx: filters.minH },
  });
  dispatch({
    type: 'SET_EXPORT_MAX',
    payload: { maxWidthPx: filters.maxW, maxHeightPx: filters.maxH },
  });
};

// export helpers moved to actionsExport.ts

export const resetOptionsFn = (dispatch: (action: Action) => void) => {
  // Reset preview naming options back to sane defaults
  dispatch({
    type: 'SET_EXPORT_OPTIONS_FLAGS',
    payload: { useZipName: true, useFilenamePattern: true },
  });
  dispatch({
    type: 'SET_EXPORT_OPTIONS',
    payload: {
      zipName: 'export.zip',
      filenamePattern: 'image-{i}-split-{index}.png',
    },
  });
};
