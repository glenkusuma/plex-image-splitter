import { exportImages } from '@/lib/export';

import {
  _subdivide,
  generateEvenSplits,
  initialState,
  subdivide,
} from './state';
import {
  Action,
  EditorState,
  MAX_HISTORY,
  MAX_SPLITS,
  PresetData,
  SplitLine,
} from './types';

export const reducerHelper = (
  state: EditorState,
  action: Action
): EditorState => {
  switch (action.type) {
    case 'HYDRATE_SESSION': {
      const d = action.payload.data;
      return {
        ...state,
        horizontalSplit: d.horizontalSplit ?? state.horizontalSplit,
        verticalSplit: d.verticalSplit ?? state.verticalSplit,
        guidesVisible: d.guidesVisible ?? state.guidesVisible,
        guideColor: d.guideColor ?? state.guideColor,
        guideColorH: d.guideColorH ?? state.guideColorH,
        guideColorV: d.guideColorV ?? state.guideColorV,
        selectedGuideColor: d.selectedGuideColor ?? state.selectedGuideColor,
        selectedGuideAlpha: d.selectedGuideAlpha ?? state.selectedGuideAlpha,
        guideAlphaH: d.guideAlphaH ?? state.guideAlphaH,
        guideAlphaV: d.guideAlphaV ?? state.guideAlphaV,
        guideThicknessH: d.guideThicknessH ?? state.guideThicknessH,
        guideThicknessV: d.guideThicknessV ?? state.guideThicknessV,
        snapEnabled: d.snapEnabled ?? state.snapEnabled,
        snapPx: d.snapPx ?? state.snapPx,
      };
    }
    case 'APPLY_PRESET': {
      const d = action.payload.data as PresetData;
      const clampSplit = (arr: SplitLine[]) =>
        arr.map((l) => ({
          position: Math.max(0, Math.min(100, l.position)),
          size: Math.max(0, Math.min(100, l.size)),
        }));
      return {
        ...state,
        horizontalSplit: d.horizontalSplit
          ? clampSplit(d.horizontalSplit)
          : state.horizontalSplit,
        verticalSplit: d.verticalSplit
          ? clampSplit(d.verticalSplit)
          : state.verticalSplit,
        guidesVisible: d.guidesVisible ?? state.guidesVisible,
        guideColor: d.guideColor ?? state.guideColor,
        guideColorH: d.guideColorH ?? state.guideColorH,
        guideColorV: d.guideColorV ?? state.guideColorV,
        selectedGuideColor: d.selectedGuideColor ?? state.selectedGuideColor,
        selectedGuideAlpha: d.selectedGuideAlpha ?? state.selectedGuideAlpha,
        guideAlphaH: d.guideAlphaH ?? state.guideAlphaH,
        guideAlphaV: d.guideAlphaV ?? state.guideAlphaV,
        guideThicknessH: d.guideThicknessH ?? state.guideThicknessH,
        guideThicknessV: d.guideThicknessV ?? state.guideThicknessV,
        snapEnabled: d.snapEnabled ?? state.snapEnabled,
        snapPx: d.snapPx ?? state.snapPx,
        selected: { horizontal: [], vertical: [] },
      };
    }
    case 'setActiveSrc':
      return {
        ...state,
        history: { splits: [], offset: 0 },
        activeSrc: action.payload.src,
      };
    case 'SUBDIVIDE_LINES':
      return {
        ...state,
        ...subdivide(
          {
            horizontalSplit: [...state.horizontalSplit],
            verticalSplit: [...state.verticalSplit],
          },
          action.payload.count
        ),
      };
    case 'SUBDIVIDE_LINES_HORIZONTAL':
      return {
        ...state,
        horizontalSplit: _subdivide(
          [...state.horizontalSplit],
          action.payload.count
        ),
      };
    case 'SUBDIVIDE_LINES_VERTICAL':
      return {
        ...state,
        verticalSplit: _subdivide(
          [...state.verticalSplit],
          action.payload.count
        ),
      };
    case 'SUBDIVIDE_LINES_ITR':
      return {
        ...state,
        ...subdivide(
          { horizontalSplit: [], verticalSplit: [] },
          action.payload.itr
        ),
      };
    case 'GENERATE_GRID':
      return {
        ...state,
        horizontalSplit: generateEvenSplits(action.payload.hCount),
        verticalSplit: generateEvenSplits(action.payload.vCount),
      };
    case 'SPLIT_INTO_TWO_HORIZONTAL_COMPONENTS':
      return {
        ...state,
        horizontalSplit: [{ position: 50, size: 100 }],
        verticalSplit: [],
      };
    case 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS':
      return {
        ...state,
        horizontalSplit: [],
        verticalSplit: [{ position: 50, size: 100 }],
      };
    case 'CLEAR_LINES':
      return { ...state, horizontalSplit: [], verticalSplit: [] };
    case 'SET_LINE_POSITION':
      return {
        ...state,
        horizontalSplit: state.horizontalSplit.map((line, i) =>
          i === action.payload.index && action.payload.align === 'horizontal'
            ? {
                ...line,
                position: Math.max(0, Math.min(100, action.payload.position)),
              }
            : line
        ),
        verticalSplit: state.verticalSplit.map((line, i) =>
          i === action.payload.index && action.payload.align === 'vertical'
            ? {
                ...line,
                position: Math.max(0, Math.min(100, action.payload.position)),
              }
            : line
        ),
      };
    case 'ADD_NEW_HLINE':
      return {
        ...state,
        horizontalSplit: [
          ...state.horizontalSplit,
          { position: 50, size: 100 },
        ],
      };
    case 'ADD_NEW_VLINE':
      return {
        ...state,
        verticalSplit: [...state.verticalSplit, { position: 50, size: 100 }],
      };
    case 'REMOVE_HLINE':
      return {
        ...state,
        horizontalSplit: state.horizontalSplit.slice(
          0,
          Math.max(0, state.horizontalSplit.length - 1)
        ),
      };
    case 'REMOVE_VLINE':
      return {
        ...state,
        verticalSplit: state.verticalSplit.slice(
          0,
          Math.max(0, state.verticalSplit.length - 1)
        ),
      };
    case 'UNDO': {
      if (state.history.offset > 0) {
        const offset = state.history.offset - 1;
        return {
          ...state,
          ...state.history.splits[offset],
          history: { ...state.history, offset },
        };
      }
      return state;
    }
    case 'REDO': {
      if (state.history.offset < state.history.splits.length - 1) {
        const offset = state.history.offset + 1;
        return {
          ...state,
          ...state.history.splits[offset],
          history: { ...state.history, offset },
        };
      }
      return state;
    }
    case 'PUSH_HISTORY':
      return {
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
      };
    case 'EXPORT':
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
    case 'SET_EXPORTING_FLAG':
      return { ...state, exporting: action.payload.exporting };
    case 'SET_EDITOR_ACTIVE':
      return { ...state, active: true };
    case 'SET_EDITOR_INACTIVE':
      return { ...state, active: false };
    case 'SET_SELECTED_LINE':
      return {
        ...state,
        selected:
          action.payload.align === 'horizontal'
            ? { horizontal: [action.payload.index], vertical: [] }
            : { horizontal: [], vertical: [action.payload.index] },
      };
    case 'TOGGLE_SELECTED_LINE': {
      const { align, index, multi } = action.payload;
      if (!multi) {
        return align === 'horizontal'
          ? { ...state, selected: { horizontal: [index], vertical: [] } }
          : { ...state, selected: { horizontal: [], vertical: [index] } };
      }
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
    }
    case 'CLEAR_SELECTED_LINES':
      return { ...state, selected: { horizontal: [], vertical: [] } };
    case 'SELECT_ALL_LINES': {
      const allH = state.horizontalSplit.map((_, i) => i);
      const allV = state.verticalSplit.map((_, i) => i);
      return { ...state, selected: { horizontal: allH, vertical: allV } };
    }
    case 'SELECT_ONLY_AXIS_LINES': {
      if (action.payload.align === 'horizontal') {
        const allH = state.horizontalSplit.map((_, i) => i);
        return { ...state, selected: { horizontal: allH, vertical: [] } };
      }
      const allV = state.verticalSplit.map((_, i) => i);
      return { ...state, selected: { horizontal: [], vertical: allV } };
    }
    case 'SET_GUIDES_VISIBLE':
      return { ...state, guidesVisible: action.payload.visible };
    case 'SET_GUIDE_COLOR':
      return { ...state, guideColor: action.payload.color };
    case 'SET_GUIDE_COLORS':
      return {
        ...state,
        guideColorH: action.payload.h ?? state.guideColorH,
        guideColorV: action.payload.v ?? state.guideColorV,
        selectedGuideColor: action.payload.selected ?? state.selectedGuideColor,
      };
    case 'SET_CANVAS_SIZE':
      return {
        ...state,
        canvasSize: {
          width: Math.max(0, Math.floor(action.payload.width || 0)),
          height: Math.max(0, Math.floor(action.payload.height || 0)),
        },
      };
    case 'REMOVE_SELECTED_LINE':
      if (state.selected.horizontal.length) {
        const toRemove = new Set(state.selected.horizontal);
        return {
          ...state,
          horizontalSplit: state.horizontalSplit.filter(
            (_, i) => !toRemove.has(i)
          ),
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
    case 'REMOVE_SELECTED_LINES': {
      const remH = new Set(state.selected.horizontal);
      const remV = new Set(state.selected.vertical);
      return {
        ...state,
        horizontalSplit: state.horizontalSplit.filter((_, i) => !remH.has(i)),
        verticalSplit: state.verticalSplit.filter((_, i) => !remV.has(i)),
        selected: { horizontal: [], vertical: [] },
      };
    }
    case 'SET_SNAP':
      return {
        ...state,
        snapEnabled: action.payload.enabled ?? state.snapEnabled,
        snapPx: action.payload.px ?? state.snapPx,
      };
    case 'SET_GUIDE_STYLE':
      return {
        ...state,
        guideAlphaH:
          action.payload.hAlpha != null
            ? Math.max(0, Math.min(1, action.payload.hAlpha))
            : state.guideAlphaH,
        guideAlphaV:
          action.payload.vAlpha != null
            ? Math.max(0, Math.min(1, action.payload.vAlpha))
            : state.guideAlphaV,
        selectedGuideAlpha:
          action.payload.selectedAlpha != null
            ? Math.max(0, Math.min(1, action.payload.selectedAlpha))
            : state.selectedGuideAlpha,
        guideThicknessH:
          action.payload.hSize != null
            ? Math.max(1, Math.round(action.payload.hSize))
            : state.guideThicknessH,
        guideThicknessV:
          action.payload.vSize != null
            ? Math.max(1, Math.round(action.payload.vSize))
            : state.guideThicknessV,
      };
    case 'SET_EXPORT_OPTIONS':
      return {
        ...state,
        exportZipName: action.payload.zipName ?? state.exportZipName,
        exportFilenamePattern:
          action.payload.filenamePattern ?? state.exportFilenamePattern,
        exportMinWidthPx:
          action.payload.minWidthPx != null
            ? Math.max(1, Math.round(action.payload.minWidthPx))
            : state.exportMinWidthPx,
        exportMinHeightPx:
          action.payload.minHeightPx != null
            ? Math.max(1, Math.round(action.payload.minHeightPx))
            : state.exportMinHeightPx,
        exportDryRun: action.payload.dryRun ?? state.exportDryRun,
      };
    case 'SET_EXPORT_MAX':
      return {
        ...state,
        exportMaxWidthPx:
          action.payload.maxWidthPx != null
            ? Math.max(1, Math.round(action.payload.maxWidthPx))
            : state.exportMaxWidthPx,
        exportMaxHeightPx:
          action.payload.maxHeightPx != null
            ? Math.max(1, Math.round(action.payload.maxHeightPx))
            : state.exportMaxHeightPx,
      };
    case 'SET_EXPORT_OPTIONS_FLAGS':
      return {
        ...state,
        exportUseZipName: action.payload.useZipName ?? state.exportUseZipName,
        exportUseFilenamePattern:
          action.payload.useFilenamePattern ?? state.exportUseFilenamePattern,
        exportUseFilters: action.payload.useFilters ?? state.exportUseFilters,
        exportUseMinWidth:
          action.payload.useMinWidth ?? state.exportUseMinWidth,
        exportUseMinHeight:
          action.payload.useMinHeight ?? state.exportUseMinHeight,
        exportUseMaxWidth:
          action.payload.useMaxWidth ?? state.exportUseMaxWidth,
        exportUseMaxHeight:
          action.payload.useMaxHeight ?? state.exportUseMaxHeight,
      };
    case 'RESET_EXPORT_OPTIONS':
      return {
        ...state,
        exportZipName: 'export.zip',
        exportFilenamePattern: 'image-{i}-split-{index}.png',
        exportMinWidthPx: 1,
        exportMinHeightPx: 1,
        exportMaxWidthPx: Number.MAX_SAFE_INTEGER,
        exportMaxHeightPx: Number.MAX_SAFE_INTEGER,
        exportUseZipName: true,
        exportUseFilenamePattern: true,
        exportUseFilters: false,
        exportUseMinWidth: false,
        exportUseMinHeight: false,
        exportUseMaxWidth: false,
        exportUseMaxHeight: false,
      };
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
