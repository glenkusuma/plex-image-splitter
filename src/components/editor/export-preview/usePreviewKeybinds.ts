import type { SlicePreview } from '@/lib/export';
import { useKeybind } from '@/lib/useKeybind';

export function usePreviewKeybinds(
  open: boolean,
  loading: boolean,
  filteredItems: SlicePreview[],
  setSelected: (next: Record<string, boolean>) => void,
  setFullscreen: (updater: (f: boolean) => boolean) => void,
  regenerate: () => void,
  setOpen: (v: boolean) => void
) {
  useKeybind(
    [
      {
        key: 'f',
        when: () => open && !loading,
        handler: () => setFullscreen((f) => !f),
      },
      {
        key: 'r',
        when: () => open && !loading,
        handler: () => void regenerate(),
      },
      {
        key: 'a',
        when: () => open && !loading,
        handler: () => {
          const all: Record<string, boolean> = {};
          filteredItems.forEach((p) => (all[`${p.i}-${p.index}`] = true));
          setSelected(all);
        },
      },
      {
        key: 'n',
        when: () => open && !loading,
        handler: () => setSelected({}),
      },
      {
        key: 'Escape',
        when: () => open,
        preventDefault: false,
        handler: () => setOpen(false),
      },
    ],
    [
      open,
      loading,
      filteredItems,
      setSelected,
      setOpen,
      setFullscreen,
      regenerate,
    ]
  );
}
