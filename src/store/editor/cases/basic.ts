import type { EditorState } from '@/store/editor/types';

export const setActiveSrc = (state: EditorState, src: string): EditorState => ({
  ...state,
  history: { splits: [], offset: 0 },
  activeSrc: src,
});

export const splitIntoTwoHorizontal = (state: EditorState): EditorState => ({
  ...state,
  horizontalSplit: [{ position: 50, size: 100 }],
  verticalSplit: [],
});

export const splitIntoTwoVertical = (state: EditorState): EditorState => ({
  ...state,
  horizontalSplit: [],
  verticalSplit: [{ position: 50, size: 100 }],
});

export const clearLines = (state: EditorState): EditorState => ({
  ...state,
  horizontalSplit: [],
  verticalSplit: [],
});

export const addNewHLine = (state: EditorState): EditorState => ({
  ...state,
  horizontalSplit: [...state.horizontalSplit, { position: 50, size: 100 }],
});

export const addNewVLine = (state: EditorState): EditorState => ({
  ...state,
  verticalSplit: [...state.verticalSplit, { position: 50, size: 100 }],
});

export const removeHLine = (state: EditorState): EditorState => ({
  ...state,
  horizontalSplit: state.horizontalSplit.slice(
    0,
    Math.max(0, state.horizontalSplit.length - 1)
  ),
});

export const removeVLine = (state: EditorState): EditorState => ({
  ...state,
  verticalSplit: state.verticalSplit.slice(
    0,
    Math.max(0, state.verticalSplit.length - 1)
  ),
});

export const setEditorActive = (state: EditorState): EditorState => ({
  ...state,
  active: true,
});

export const setEditorInactive = (state: EditorState): EditorState => ({
  ...state,
  active: false,
});
