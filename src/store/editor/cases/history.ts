import type { EditorState } from '@/store/editor/types';

export const undo = (state: EditorState): EditorState => {
  if (state.history.offset > 0) {
    const offset = state.history.offset - 1;
    return {
      ...state,
      ...state.history.splits[offset],
      history: { ...state.history, offset },
    };
  }
  return state;
};

export const redo = (state: EditorState): EditorState => {
  if (state.history.offset < state.history.splits.length - 1) {
    const offset = state.history.offset + 1;
    return {
      ...state,
      ...state.history.splits[offset],
      history: { ...state.history, offset },
    };
  }
  return state;
};

export const pushHistory = (state: EditorState): EditorState => ({
  ...state,
  history: {
    ...state.history,
    splits: [
      ...state.history.splits,
      {
        horizontalSplit: [...state.horizontalSplit],
        verticalSplit: [...state.verticalSplit],
      },
    ],
    offset: state.history.splits.length,
  },
});
