import React from 'react';

import type { NamedPreset } from '../types';

export function reindex(list: NamedPreset[]): NamedPreset[] {
  return list.map((p, i) => ({ ...p, order: i }));
}

export function stableOverwriteByName(
  current: NamedPreset[],
  name: string,
  newItem: Omit<NamedPreset, 'order'>
): NamedPreset[] {
  const sorted = [...current].sort((a, b) => a.order - b.order);
  const firstIdx = sorted.findIndex((p) => p.name === name);
  const filtered = sorted.filter((p) => p.name !== name);
  const insertIdx = firstIdx >= 0 ? firstIdx : filtered.length;
  const result = [
    ...filtered.slice(0, insertIdx),
    { ...(newItem as NamedPreset), order: 0 },
    ...filtered.slice(insertIdx),
  ];
  return reindex(result);
}

export function stableImportOverwrite(
  current: NamedPreset[],
  uniques: NamedPreset[],
  duplicates: NamedPreset[]
): NamedPreset[] {
  const nowTs = Date.now();
  const dupWithUpdated = duplicates.map((d) => ({ ...d, updatedAt: nowTs }));
  const sorted = [...current].sort((a, b) => a.order - b.order);
  const dupNames = new Set(dupWithUpdated.map((d) => d.name));
  const base = sorted.filter((p) => !dupNames.has(p.name));
  const firstIndexByName = new Map<string, number>();
  sorted.forEach((p, idx) => {
    if (dupNames.has(p.name) && !firstIndexByName.has(p.name)) {
      firstIndexByName.set(p.name, idx);
    }
  });
  type Insert = { index: number; item: NamedPreset };
  const inserts: Insert[] = [];
  dupWithUpdated.forEach((imp) => {
    const idx = firstIndexByName.get(imp.name);
    if (idx == null || inserts.some((x) => x.index === idx)) {
      inserts.push({ index: base.length + inserts.length, item: imp });
    } else {
      inserts.push({ index: idx, item: imp });
    }
  });
  const sortedInserts = inserts.sort((a, b) => a.index - b.index);
  const result: NamedPreset[] = [];
  let baseCursor = 0;
  let logicalIndex = 0;
  sortedInserts.forEach(({ index, item }) => {
    while (baseCursor < base.length && logicalIndex < index) {
      result.push(base[baseCursor++]);
      logicalIndex++;
    }
    result.push(item);
    logicalIndex++;
  });
  while (baseCursor < base.length) {
    result.push(base[baseCursor++]);
    logicalIndex++;
  }
  const withUniques = [...result, ...uniques];
  return reindex(withUniques);
}

export const fmtDate = (ts: number) => {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
};

export const Bullets: React.FC<{ items: string[]; max?: number }> = ({
  items,
  max = 5,
}) => {
  const head = items.slice(0, max);
  const rest = Math.max(0, items.length - head.length);
  return (
    <>
      <ul className='mb-2 list-inside list-disc text-xs text-gray-300'>
        {head.map((n) => (
          <li key={n} className='truncate'>
            {n}
          </li>
        ))}
      </ul>
      {rest > 0 && <p className='text-xs text-gray-400'>…and {rest} more</p>}
    </>
  );
};
