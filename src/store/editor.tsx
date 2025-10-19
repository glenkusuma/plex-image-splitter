import { createContext, useContext, useReducer } from 'react';

import { exportImages } from '@/lib/export';

type Align = 'horizontal' | 'vertical';

type Action =
  | { type: 'setActiveSrc'; payload: { src: string } }
  | { type: 'SUBDIVIDE_LINES'; payload: { count: number } }
  | { type: 'SUBDIVIDE_LINES_HORIZONTAL'; payload: { count: number } }
  | { type: 'SUBDIVIDE_LINES_VERTICAL'; payload: { count: number } }
  | { type: 'SUBDIVIDE_LINES_ITR'; payload: { itr: number } }
  | { type: 'GENERATE_GRID'; payload: { hCount: number; vCount: number } }
  | { type: 'SPLIT_INTO_TWO_HORIZONTAL_COMPONENTS' }
  | { type: 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS' }
  | { type: 'CLEAR_LINES' }
  | {
    type: 'SET_LINE_POSITION';
    payload: { index: number; align: Align; position: number };
  }
  | { type: 'ADD_NEW_HLINE'; payload?: { count?: number } }
  | { type: 'ADD_NEW_VLINE'; payload?: { count?: number } }
  | { type: 'REMOVE_HLINE' }
  | { type: 'REMOVE_VLINE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' }
  | { type: 'EXPORT' }
  | { type: 'SET_EXPORTING_FLAG'; payload: { exporting: boolean } }
  | { type: 'SET_EDITOR_ACTIVE' }
  | { type: 'SET_EDITOR_INACTIVE' }
  | { type: 'SET_SELECTED_LINE'; payload: { align: Align; index: number } }
  | { type: 'TOGGLE_SELECTED_LINE'; payload: { align: Align; index: number; multi?: boolean } }
  | { type: 'CLEAR_SELECTED_LINES' }
  | { type: 'SELECT_ALL_LINES' }
  | { type: 'SELECT_ONLY_AXIS_LINES'; payload: { align: Align } }
  | { type: 'SET_GUIDES_VISIBLE'; payload: { visible: boolean } }
  | { type: 'SET_GUIDE_COLOR'; payload: { color: string } }
  | { type: 'SET_GUIDE_COLORS'; payload: { h?: string; v?: string; selected?: string } }
  | { type: 'SET_CANVAS_SIZE'; payload: { width: number; height: number } }
  | { type: 'REMOVE_SELECTED_LINE' }
  | { type: 'REMOVE_SELECTED_LINES' }
  | { type: 'SET_SNAP'; payload: { enabled?: boolean; px?: number } }
  | { type: 'SET_GUIDE_STYLE'; payload: { hAlpha?: number; vAlpha?: number; hSize?: number; vSize?: number; selectedAlpha?: number } }
  | { type: 'SET_EXPORT_OPTIONS'; payload: { zipName?: string; filenamePattern?: string; minWidthPx?: number; minHeightPx?: number; dryRun?: boolean } }
  | { type: 'SET_EXPORT_OPTIONS_FLAGS'; payload: { useZipName?: boolean; useFilenamePattern?: boolean; useFilters?: boolean; useMinWidth?: boolean; useMinHeight?: boolean; useMaxWidth?: boolean; useMaxHeight?: boolean } }
  | { type: 'SET_EXPORT_MAX'; payload: { maxWidthPx?: number; maxHeightPx?: number } }
  | { type: 'RESET_EXPORT_OPTIONS' };

export const EditorContext = createContext(
  {} as {
    state: EditorState;
    dispatch: React.Dispatch<Action>;
  }
);

// Type definitions
export interface SplitLine {
  position: number; // 0 - 100
  size: number; // 0 - 100
}

export interface Split {
  horizontalSplit: SplitLine[];
  verticalSplit: SplitLine[];
}

export interface EditorState {
  activeSrc: string;
  horizontalSplit: SplitLine[];
  verticalSplit: SplitLine[];
  history: {
    splits: Split[];
    offset: number;
  };
  exporting: boolean;
  active: boolean;
  selected: { horizontal: number[]; vertical: number[] };
  guidesVisible: boolean;
  guideColor: string; // default/fallback color
  guideColorH: string;
  guideColorV: string;
  selectedGuideColor: string;
  selectedGuideAlpha: number;
  guideAlphaH: number;
  guideAlphaV: number;
  guideThicknessH: number; // px
  guideThicknessV: number; // px
  canvasSize: { width: number; height: number };
  snapEnabled: boolean;
  snapPx: number;
  // Export options
  exportZipName: string; // e.g., export.zip
  exportFilenamePattern: string; // e.g., image-{i}-split-{index}-{w}x{h}.png
  exportMinWidthPx: number;
  exportMinHeightPx: number;
  exportDryRun: boolean;
  exportMaxWidthPx: number;
  exportMaxHeightPx: number;
  // enable flags
  exportUseZipName: boolean;
  exportUseFilenamePattern: boolean;
  exportUseFilters: boolean;
  exportUseMinWidth: boolean;
  exportUseMinHeight: boolean;
  exportUseMaxWidth: boolean;
  exportUseMaxHeight: boolean;
}

// Constants
export const MAX_SPLITS = 100;
export const MAX_HISTORY = 100;

// Initial state
const initialState: EditorState = {
  activeSrc: '',
  horizontalSplit: [],
  verticalSplit: [],
  history: {
    splits: [],
    offset: 0,
  },
  exporting: false,
  active: false,
  selected: { horizontal: [], vertical: [] },
  guidesVisible: true,
  guideColor: '#000000',
  guideColorH: '#000000',
  guideColorV: '#000000',
  selectedGuideColor: '#fbbf24',
  selectedGuideAlpha: 1,
  guideAlphaH: 1,
  guideAlphaV: 1,
  guideThicknessH: 2,
  guideThicknessV: 2,
  canvasSize: { width: 0, height: 0 },
  snapEnabled: false,
  snapPx: 10,
  exportZipName: 'export.zip',
  exportFilenamePattern: 'image-{i}-split-{index}.png',
  exportMinWidthPx: 1,
  exportMinHeightPx: 1,
  exportDryRun: false,
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

// Actions
const _subdivide = (splits: SplitLine[], count: number) => {
  splits.unshift({
    position: 0,
    size: 100,
  });
  splits.push({
    position: 100,
    size: 100,
  });

  splits = splits.flatMap((line: SplitLine, i: number) => {
    if (i === 0) {
      return [];
    }
    const prevLine = splits[i - 1];
    const deltaDistance = (line.position - prevLine.position) / (count + 1);
    const size = Math.min(prevLine.size, line.size);
    const newLines = Array.from(Array(count).keys()).map((i) => {
      return {
        position: prevLine.position + deltaDistance * (i + 1),
        size,
      };
    });
    return [...newLines, line];
  }, []);
  splits.pop();
  return splits;
};

const subdivide = (splits: Split, count: number) => {
  return {
    horizontalSplit: _subdivide(splits.horizontalSplit, count),
    verticalSplit: _subdivide(splits.verticalSplit, count),
  };
};

const generateEvenSplits = (count: number): SplitLine[] => {
  if (!count || count <= 0) return [];
  // place `count` lines evenly between 0 and 100 (exclusive)
  const delta = 100 / (count + 1);
  return Array.from({ length: count }).map((_, i) => ({
    position: +(delta * (i + 1)).toFixed(6),
    size: 100,
  }));
};

export { generateEvenSplits };

// Reducer
const reducerHelper = (state: EditorState, action: Action) => {
  switch (action.type) {
    case 'setActiveSrc':
      return {
        ...state,
        history: {
          splits: [],
          offset: 0,
        },
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
          {
            horizontalSplit: [],
            verticalSplit: [],
          },
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
        horizontalSplit: [
          {
            position: 50,
            size: 100,
          },
        ],
        verticalSplit: [],
      };
    case 'SPLIT_INTO_TWO_VERTICAL_COMPONENTS':
      return {
        ...state,
        horizontalSplit: [],
        verticalSplit: [
          {
            position: 50,
            size: 100,
          },
        ],
      };
    case 'CLEAR_LINES':
      return {
        ...state,
        horizontalSplit: [],
        verticalSplit: [],
      };
    case 'SET_LINE_POSITION':
      return {
        ...state,
        horizontalSplit: state.horizontalSplit.map(
          (line: SplitLine, i: number) => {
            if (
              i === action.payload.index &&
              action.payload.align === 'horizontal'
            ) {
              return {
                ...line,
                position: Math.max(0, Math.min(100, action.payload.position)),
              };
            }
            return line;
          }
        ),
        verticalSplit: state.verticalSplit.map((line: SplitLine, i: number) => {
          if (
            i === action.payload.index &&
            action.payload.align === 'vertical'
          ) {
            return {
              ...line,
              position: Math.max(0, Math.min(100, action.payload.position)),
            };
          }
          return line;
        }),
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
    case 'UNDO':
      if (state.history.offset > 0) {
        const offset = state.history.offset - 1;
        return {
          ...state,
          ...state.history.splits[offset],
          history: {
            ...state.history,
            offset,
          },
        };
      }
      return state;
    case 'REDO':
      if (state.history.offset < state.history.splits.length - 1) {
        const offset = state.history.offset + 1;
        return {
          ...state,
          ...state.history.splits[offset],
          history: {
            ...state.history,
            offset,
          },
        };
      }
      return state;
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
          a.download = (state.exportUseZipName ? state.exportZipName : 'export.zip') || 'export.zip';
          a.click();
        } else {
          // Dry-run: no download. Could set a preview in state in future.
          // eslint-disable-next-line no-console
          console.log('[Dry Run] Export prepared but not downloaded.');
        }
      }, 0);
      return state;
    case 'SET_EXPORTING_FLAG':
      return {
        ...state,
        exporting: action.payload.exporting,
      };
    case 'SET_EDITOR_ACTIVE':
      return {
        ...state,
        active: true,
      };
    case 'SET_EDITOR_INACTIVE':
      return {
        ...state,
        active: false,
      };
    case 'SET_SELECTED_LINE':
      return {
        ...state,
        selected: action.payload.align === 'horizontal'
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
        return { ...state, selected: { horizontal: Array.from(set).sort((a, b) => a - b), vertical: state.selected.vertical } };
      } else {
        const set = new Set(state.selected.vertical);
        if (set.has(index)) set.delete(index);
        else set.add(index);
        return { ...state, selected: { horizontal: state.selected.horizontal, vertical: Array.from(set).sort((a, b) => a - b) } };
      }
    }
    case 'CLEAR_SELECTED_LINES':
      return {
        ...state,
        selected: { horizontal: [], vertical: [] },
      };
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
      return {
        ...state,
        guidesVisible: action.payload.visible,
      };
    case 'SET_GUIDE_COLOR':
      return {
        ...state,
        guideColor: action.payload.color,
      };
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
        exportFilenamePattern: action.payload.filenamePattern ?? state.exportFilenamePattern,
        exportMinWidthPx: action.payload.minWidthPx != null ? Math.max(1, Math.round(action.payload.minWidthPx)) : state.exportMinWidthPx,
        exportMinHeightPx: action.payload.minHeightPx != null ? Math.max(1, Math.round(action.payload.minHeightPx)) : state.exportMinHeightPx,
        exportDryRun: action.payload.dryRun ?? state.exportDryRun,
      };
    case 'SET_EXPORT_MAX':
      return {
        ...state,
        exportMaxWidthPx: action.payload.maxWidthPx != null ? Math.max(1, Math.round(action.payload.maxWidthPx)) : state.exportMaxWidthPx,
        exportMaxHeightPx: action.payload.maxHeightPx != null ? Math.max(1, Math.round(action.payload.maxHeightPx)) : state.exportMaxHeightPx,
      };
    case 'SET_EXPORT_OPTIONS_FLAGS':
      return {
        ...state,
        exportUseZipName: action.payload.useZipName ?? state.exportUseZipName,
        exportUseFilenamePattern: action.payload.useFilenamePattern ?? state.exportUseFilenamePattern,
        exportUseFilters: action.payload.useFilters ?? state.exportUseFilters,
        exportUseMinWidth: action.payload.useMinWidth ?? state.exportUseMinWidth,
        exportUseMinHeight: action.payload.useMinHeight ?? state.exportUseMinHeight,
        exportUseMaxWidth: action.payload.useMaxWidth ?? state.exportUseMaxWidth,
        exportUseMaxHeight: action.payload.useMaxHeight ?? state.exportUseMaxHeight,
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
    default:
      return state;
  }
};

const HISTORY_AGNOSTIC_ACTIONS = [
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
];
const reducer = (state: EditorState, action: Action) => {
  const newState = reducerHelper(state, action);

  if (newState) {
    if (newState.horizontalSplit.length > MAX_SPLITS) {
      return state;
    }
    if (newState.verticalSplit.length > MAX_SPLITS) {
      return state;
    }
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
      if (newState.history.splits.length > MAX_HISTORY) {
        newState.history.splits.shift();
      }
      newState.history.offset = newState.history.splits.length - 1;
    }
  }

  return newState;
};

// Provider
export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
