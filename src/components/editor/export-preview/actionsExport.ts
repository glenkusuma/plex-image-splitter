import type { SlicePreview } from '@/lib/export';
import { exportImages } from '@/lib/export';

import type { EditorState } from '@/store/editor';

export const exportAllFn = async (
  state: EditorState,
  filteredItems: SlicePreview[]
) => {
  const whitelist = new Set<string>();
  filteredItems.forEach((p) => whitelist.add(`${p.i}-${p.index}`));
  const blob = await exportImages(
    state,
    state.activeSrc ? [state.activeSrc] : [],
    { whitelist }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download =
    (state.exportUseZipName ? state.exportZipName : 'export.zip') ||
    'export.zip';
  a.click();
};

export const exportSelectedFn = async (
  state: EditorState,
  filteredItems: SlicePreview[],
  selected: Record<string, boolean>
) => {
  const whitelist = new Set<string>();
  filteredItems.forEach((p) => {
    const key = `${p.i}-${p.index}`;
    if (selected[key]) whitelist.add(key);
  });
  const blob = await exportImages(
    state,
    state.activeSrc ? [state.activeSrc] : [],
    { whitelist }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download =
    (state.exportUseZipName ? state.exportZipName : 'export.zip') ||
    'export.zip';
  a.click();
};
