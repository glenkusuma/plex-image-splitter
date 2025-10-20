import { reducerHelper } from './reducerHelper';
import { Action, EditorState, MAX_HISTORY, MAX_SPLITS } from './types';

const HISTORY_AGNOSTIC_ACTIONS: Action['type'][] = [
  'SET_LINE_POSITION',
  'UNDO',
  'REDO',
  'PUSH_HISTORY',
  'EXPORT',
  'SET_SELECTED_LINE',
  'TOGGLE_SELECTED_LINE',
  'CLEAR_SELECTED_LINES',
  'SELECT_ALL_LINES',
  'SELECT_ONLY_AXIS_LINES',
  'SET_GUIDES_VISIBLE',
  'SET_GUIDE_COLOR',
  'SET_GUIDE_COLORS',
  'SET_CANVAS_SIZE',
  'SET_SNAP',
  'REMOVE_SELECTED_LINE',
  'REMOVE_SELECTED_LINES',
  'SET_GUIDE_STYLE',
  'SET_EXPORT_OPTIONS',
  'SET_EXPORT_OPTIONS_FLAGS',
  'SET_EXPORT_MAX',
  'RESET_EXPORT_OPTIONS',
  'HYDRATE_SESSION',
];

export const reducer = (state: EditorState, action: Action): EditorState => {
  const newState = reducerHelper(state, action);
  if (newState) {
    if (newState.horizontalSplit.length > MAX_SPLITS) return state;
    if (newState.verticalSplit.length > MAX_SPLITS) return state;
    if (newState !== state && !HISTORY_AGNOSTIC_ACTIONS.includes(action.type)) {
      if (state.history.offset < state.history.splits.length - 1) {
        newState.history.splits = newState.history.splits.slice(
          0,
          state.history.offset + 1
        );
      }
      newState.history = {
        splits: [
          ...newState.history.splits,
          {
            horizontalSplit: [...newState.horizontalSplit],
            verticalSplit: [...newState.verticalSplit],
          },
        ],
        offset: newState.history.splits.length,
      };
      if (newState.history.splits.length > MAX_HISTORY)
        newState.history.splits.shift();
      newState.history.offset = newState.history.splits.length - 1;
    }
  }
  return newState;
};
