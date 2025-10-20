import React, { useMemo, useState } from 'react';

import type { SlicePreview } from '@/lib/export';

export type FiltersState = {
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

export type FiltersSetters = {
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

export const useFilters = (items: SlicePreview[]) => {
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

  const state: FiltersState = {
    filtersEnabled,
    useMinW,
    useMinH,
    useMaxW,
    useMaxH,
    minW,
    minH,
    maxW,
    maxH,
  };

  const setters: FiltersSetters = {
    setFiltersEnabled,
    setUseMinW,
    setUseMinH,
    setUseMaxW,
    setUseMaxH,
    setMinW,
    setMinH,
    setMaxW,
    setMaxH,
  };

  return { ...state, ...setters, filteredItems } as const;
};
