import {
  addNewHLine,
  addNewVLine,
  clearLines,
  removeHLine,
  removeVLine,
  setActiveSrc,
  setEditorActive,
  setEditorInactive,
  splitIntoTwoHorizontal,
  splitIntoTwoVertical,
} from './cases/basic';
import { exportNow, setExportingFlag } from './cases/exporting';
import { pushHistory, redo, undo } from './cases/history';
import {
  applyPreset,
  generateGrid,
  hydrateSession,
  setLinePosition,
  subdivideBoth,
  subdivideH,
  subdivideItr,
  subdivideV,
} from './cases/lines';
import {
  resetExportOptions,
  setCanvasSize,
  setExportFlags,
  setExportMax,
  setExportOptions,
  setGuideColor,
  setGuideColors,
  setGuideStyle,
  setGuidesVisible,
  setSnap,
} from './cases/options';
import {
  clearSelectedLines,
  removeSelectedLine,
  removeSelectedLines,
  selectAllLines,
  selectOnlyAxis,
  setSelectedLine,
  toggleSelectedLine,
} from './cases/selection';
import { initialState } from './state';
import { Action, EditorState, PresetData } from './types';

export const reducerHelper = (
  state: EditorState,
  action: Action
): EditorState => {
  switch (action.type) {
    case 'HYDRATE_SESSION':
      return hydrateSession(state, action.payload.data);
    case 'APPLY_PRESET': {
      const d = action.payload.data as PresetData;
      return applyPreset(state, d);
    }
    case 'setActiveSrc':
      return setActiveSrc(state, action.payload.src);
    case 'SUBDIVIDE_LINES':
      return subdivideBoth(state, action.payload.count);
    case 'SUBDIVIDE_LINES_HORIZONTAL':
      return subdivideH(state, action.payload.count);
    case 'SUBDIVIDE_LINES_VERTICAL':
      return subdivideV(state, action.payload.count);
    case 'SUBDIVIDE_LINES_ITR':
      return subdivideItr(state, action.payload.itr);
    case 'GENERATE_GRID':
      return generateGrid(state, action.payload.hCount, action.payload.vCount);
    case 'SPLIT_INTO_TWO_HORIZONTAL_COMPONENTS':
      return splitIntoTwoHorizontal(state);
    case 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS':
      return splitIntoTwoVertical(state);
    case 'CLEAR_LINES':
      return clearLines(state);
    case 'SET_LINE_POSITION':
      return setLinePosition(
        state,
        action.payload.align,
        action.payload.index,
        action.payload.position
      );
    case 'ADD_NEW_HLINE':
      return addNewHLine(state);
    case 'ADD_NEW_VLINE':
      return addNewVLine(state);
    case 'REMOVE_HLINE':
      return removeHLine(state);
    case 'REMOVE_VLINE':
      return removeVLine(state);
    case 'UNDO': {
      return undo(state);
    }
    case 'REDO': {
      return redo(state);
    }
    case 'PUSH_HISTORY':
      return pushHistory(state);
    case 'EXPORT':
      return exportNow(state);
    case 'SET_EXPORTING_FLAG':
      return setExportingFlag(state, action.payload.exporting);
    case 'SET_EDITOR_ACTIVE':
      return setEditorActive(state);
    case 'SET_EDITOR_INACTIVE':
      return setEditorInactive(state);
    case 'SET_SELECTED_LINE':
      return setSelectedLine(state, action.payload.align, action.payload.index);
    case 'TOGGLE_SELECTED_LINE':
      return toggleSelectedLine(
        state,
        action.payload.align,
        action.payload.index,
        Boolean(action.payload.multi)
      );
    case 'CLEAR_SELECTED_LINES':
      return clearSelectedLines(state);
    case 'SELECT_ALL_LINES':
      return selectAllLines(state);
    case 'SELECT_ONLY_AXIS_LINES':
      return selectOnlyAxis(state, action.payload.align);
    case 'SET_GUIDES_VISIBLE':
      return setGuidesVisible(state, action.payload.visible);
    case 'SET_GUIDE_COLOR':
      return setGuideColor(state, action.payload.color);
    case 'SET_GUIDE_COLORS':
      return setGuideColors(state, {
        h: action.payload.h,
        v: action.payload.v,
        selected: action.payload.selected,
      });
    case 'SET_CANVAS_SIZE':
      return setCanvasSize(state, action.payload.width, action.payload.height);
    case 'REMOVE_SELECTED_LINE':
      return removeSelectedLine(state);
    case 'REMOVE_SELECTED_LINES':
      return removeSelectedLines(state);
    case 'SET_SNAP':
      return setSnap(state, action.payload.enabled, action.payload.px);
    case 'SET_GUIDE_STYLE':
      return setGuideStyle(state, {
        hAlpha: action.payload.hAlpha,
        vAlpha: action.payload.vAlpha,
        selectedAlpha: action.payload.selectedAlpha,
        hSize: action.payload.hSize,
        vSize: action.payload.vSize,
      });
    case 'SET_EXPORT_OPTIONS':
      return setExportOptions(state, action.payload);
    case 'SET_EXPORT_MAX':
      return setExportMax(state, action.payload);
    case 'SET_EXPORT_OPTIONS_FLAGS':
      return setExportFlags(state, action.payload);
    case 'RESET_EXPORT_OPTIONS':
      return resetExportOptions(state);
    case 'RESET_ALL': {
      // Preserve activeSrc; reset everything else to defaults
      const preservedActive = state.activeSrc;
      return {
        ...initialState,
        activeSrc: preservedActive,
        history: { splits: [], offset: 0 },
      } as EditorState;
    }
    default:
      return state;
  }
};
