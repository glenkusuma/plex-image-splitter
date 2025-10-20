import { exportImages } from '@/lib/export';

import type { EditorState } from '@/store/editor/types';

export const exportNow = (state: EditorState): EditorState => {
  setTimeout(async () => {
    const file = await exportImages(state, [state.activeSrc]);
    if (!state.exportDryRun) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download =
        (state.exportUseZipName ? state.exportZipName : 'export.zip') ||
        'export.zip';
      a.click();
    } else {
      // eslint-disable-next-line no-console
      console.log('[Dry Run] Export prepared but not downloaded.');
    }
  }, 0);
  return state;
};

export const setExportingFlag = (
  state: EditorState,
  exporting: boolean
): EditorState => ({ ...state, exporting });
