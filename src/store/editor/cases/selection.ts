import type { EditorState } from '@/store/editor/types';

export const setSelectedLine = (
  state: EditorState,
  align: 'horizontal' | 'vertical',
  index: number
): EditorState => ({
  ...state,
  selected:
    align === 'horizontal'
      ? { horizontal: [index], vertical: [] }
      : { horizontal: [], vertical: [index] },
});

export const toggleSelectedLine = (
  state: EditorState,
  align: 'horizontal' | 'vertical',
  index: number,
  multi: boolean
): EditorState => {
  if (!multi) return setSelectedLine(state, align, index);
  if (align === 'horizontal') {
    const set = new Set(state.selected.horizontal);
    if (set.has(index)) set.delete(index);
    else set.add(index);
    return {
      ...state,
      selected: {
        horizontal: Array.from(set).sort((a, b) => a - b),
        vertical: state.selected.vertical,
      },
    };
  }
  const set = new Set(state.selected.vertical);
  if (set.has(index)) set.delete(index);
  else set.add(index);
  return {
    ...state,
    selected: {
      horizontal: state.selected.horizontal,
      vertical: Array.from(set).sort((a, b) => a - b),
    },
  };
};

export const clearSelectedLines = (state: EditorState): EditorState => ({
  ...state,
  selected: { horizontal: [], vertical: [] },
});

export const selectAllLines = (state: EditorState): EditorState => ({
  ...state,
  selected: {
    horizontal: state.horizontalSplit.map((_, i) => i),
    vertical: state.verticalSplit.map((_, i) => i),
  },
});

export const selectOnlyAxis = (
  state: EditorState,
  align: 'horizontal' | 'vertical'
): EditorState => ({
  ...state,
  selected:
    align === 'horizontal'
      ? { horizontal: state.horizontalSplit.map((_, i) => i), vertical: [] }
      : { horizontal: [], vertical: state.verticalSplit.map((_, i) => i) },
});

export const removeSelectedLine = (state: EditorState): EditorState => {
  if (state.selected.horizontal.length) {
    const toRemove = new Set(state.selected.horizontal);
    return {
      ...state,
      horizontalSplit: state.horizontalSplit.filter((_, i) => !toRemove.has(i)),
      selected: { horizontal: [], vertical: [] },
    };
  }
  if (state.selected.vertical.length) {
    const toRemove = new Set(state.selected.vertical);
    return {
      ...state,
      verticalSplit: state.verticalSplit.filter((_, i) => !toRemove.has(i)),
      selected: { horizontal: [], vertical: [] },
    };
  }
  return state;
};

export const removeSelectedLines = (state: EditorState): EditorState => {
  const remH = new Set(state.selected.horizontal);
  const remV = new Set(state.selected.vertical);
  return {
    ...state,
    horizontalSplit: state.horizontalSplit.filter((_, i) => !remH.has(i)),
    verticalSplit: state.verticalSplit.filter((_, i) => !remV.has(i)),
    selected: { horizontal: [], vertical: [] },
  };
};
