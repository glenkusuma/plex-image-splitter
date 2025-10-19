import type React from 'react';

export type Align = 'horizontal' | 'vertical';

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

// Minimal preset/session schema
export interface PresetData {
  version: number;
  horizontalSplit: SplitLine[];
  verticalSplit: SplitLine[];
  guidesVisible: boolean;
  guideColor: string;
  guideColorH: string;
  guideColorV: string;
  selectedGuideColor: string;
  selectedGuideAlpha: number;
  guideAlphaH: number;
  guideAlphaV: number;
  guideThicknessH: number;
  guideThicknessV: number;
  snapEnabled: boolean;
  snapPx: number;
}

export const MAX_SPLITS = 100;
export const MAX_HISTORY = 100;

export type Action =
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
  | { type: 'APPLY_PRESET'; payload: { data: PresetData } }
  | { type: 'HYDRATE_SESSION'; payload: { data: PresetData } }
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
  | {
      type: 'TOGGLE_SELECTED_LINE';
      payload: { align: Align; index: number; multi?: boolean };
    }
  | { type: 'CLEAR_SELECTED_LINES' }
  | { type: 'SELECT_ALL_LINES' }
  | { type: 'SELECT_ONLY_AXIS_LINES'; payload: { align: Align } }
  | { type: 'SET_GUIDES_VISIBLE'; payload: { visible: boolean } }
  | { type: 'SET_GUIDE_COLOR'; payload: { color: string } }
  | {
      type: 'SET_GUIDE_COLORS';
      payload: { h?: string; v?: string; selected?: string };
    }
  | { type: 'SET_CANVAS_SIZE'; payload: { width: number; height: number } }
  | { type: 'REMOVE_SELECTED_LINE' }
  | { type: 'REMOVE_SELECTED_LINES' }
  | { type: 'SET_SNAP'; payload: { enabled?: boolean; px?: number } }
  | {
      type: 'SET_GUIDE_STYLE';
      payload: {
        hAlpha?: number;
        vAlpha?: number;
        hSize?: number;
        vSize?: number;
        selectedAlpha?: number;
      };
    }
  | {
      type: 'SET_EXPORT_OPTIONS';
      payload: {
        zipName?: string;
        filenamePattern?: string;
        minWidthPx?: number;
        minHeightPx?: number;
        dryRun?: boolean;
      };
    }
  | {
      type: 'SET_EXPORT_OPTIONS_FLAGS';
      payload: {
        useZipName?: boolean;
        useFilenamePattern?: boolean;
        useFilters?: boolean;
        useMinWidth?: boolean;
        useMinHeight?: boolean;
        useMaxWidth?: boolean;
        useMaxHeight?: boolean;
      };
    }
  | {
      type: 'SET_EXPORT_MAX';
      payload: { maxWidthPx?: number; maxHeightPx?: number };
    }
  | { type: 'RESET_EXPORT_OPTIONS' }
  | { type: 'RESET_ALL' };

export type EditorContextType = {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
};
