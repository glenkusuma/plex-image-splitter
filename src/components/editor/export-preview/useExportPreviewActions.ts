import type React from 'react';
import { useCallback } from 'react';

import type { SlicePreview } from '@/lib/export';

import type { EditorState } from '@/store/editor';
import type { Action } from '@/store/editor/types';

import {
  applyFiltersToExportFn,
  applyNamingFn,
  matchFromExportOptionsFn,
  openPreviewFn,
  regenerateFn,
  resetFiltersFn,
  resetOptionsFn,
} from './actions';
import { exportAllFn, exportSelectedFn } from './actionsExport';

type Setters = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setItems: React.Dispatch<React.SetStateAction<SlicePreview[]>>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setFiltersEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setUseMinW: React.Dispatch<React.SetStateAction<boolean>>;
  setUseMinH: React.Dispatch<React.SetStateAction<boolean>>;
  setUseMaxW: React.Dispatch<React.SetStateAction<boolean>>;
  setUseMaxH: React.Dispatch<React.SetStateAction<boolean>>;
  setMinW: React.Dispatch<React.SetStateAction<number>>;
  setMinH: React.Dispatch<React.SetStateAction<number>>;
  setMaxW: React.Dispatch<React.SetStateAction<number>>;
  setMaxH: React.Dispatch<React.SetStateAction<number>>;
};

type Filters = {
  filtersEnabled: boolean;
  useMinW: boolean;
  useMinH: boolean;
  useMaxW: boolean;
  useMaxH: boolean;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
};

export const useExportPreviewActions = (
  state: EditorState,
  dispatch: (action: Action) => void,
  setters: Setters,
  filters: Filters,
  filteredItems: SlicePreview[],
  selected: Record<string, boolean>
) => {
  const openPreview = useCallback(() => {
    openPreviewFn(
      state,
      setters.setOpen,
      setters.setLoading,
      setters.setItems,
      setters.setSelected
    );
  }, [
    state,
    setters.setOpen,
    setters.setLoading,
    setters.setItems,
    setters.setSelected,
  ]);

  const regenerate = useCallback(() => {
    regenerateFn(
      state,
      setters.setLoading,
      setters.setItems,
      setters.setSelected
    );
  }, [state, setters.setLoading, setters.setItems, setters.setSelected]);

  const matchFromExportOptions = useCallback(() => {
    matchFromExportOptionsFn(state, {
      setFiltersEnabled: setters.setFiltersEnabled,
      setUseMinW: setters.setUseMinW,
      setUseMinH: setters.setUseMinH,
      setUseMaxW: setters.setUseMaxW,
      setUseMaxH: setters.setUseMaxH,
      setMinW: setters.setMinW,
      setMinH: setters.setMinH,
      setMaxW: setters.setMaxW,
      setMaxH: setters.setMaxH,
    });
  }, [
    state,
    setters.setFiltersEnabled,
    setters.setUseMinW,
    setters.setUseMinH,
    setters.setUseMaxW,
    setters.setUseMaxH,
    setters.setMinW,
    setters.setMinH,
    setters.setMaxW,
    setters.setMaxH,
  ]);

  const applyNaming = useCallback(() => {
    applyNamingFn(state, dispatch);
  }, [dispatch, state]);

  const resetFilters = useCallback(() => {
    resetFiltersFn(dispatch, {
      setFiltersEnabled: setters.setFiltersEnabled,
      setUseMinW: setters.setUseMinW,
      setUseMinH: setters.setUseMinH,
      setUseMaxW: setters.setUseMaxW,
      setUseMaxH: setters.setUseMaxH,
      setMinW: setters.setMinW,
      setMinH: setters.setMinH,
      setMaxW: setters.setMaxW,
      setMaxH: setters.setMaxH,
    });
  }, [
    dispatch,
    setters.setFiltersEnabled,
    setters.setUseMinW,
    setters.setUseMinH,
    setters.setUseMaxW,
    setters.setUseMaxH,
    setters.setMinW,
    setters.setMinH,
    setters.setMaxW,
    setters.setMaxH,
  ]);

  const resetOptions = useCallback(() => {
    resetOptionsFn(dispatch);
  }, [dispatch]);

  const applyFiltersToExport = useCallback(() => {
    applyFiltersToExportFn(dispatch, filters);
  }, [dispatch, filters]);

  const exportAll = useCallback(() => {
    return exportAllFn(state, filteredItems);
  }, [filteredItems, state]);

  const exportSelected = useCallback(() => {
    return exportSelectedFn(state, filteredItems, selected);
  }, [filteredItems, selected, state]);

  return {
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
