import type { EditorState } from '@/store/editor/types';

export const setGuidesVisible = (state: EditorState, visible: boolean) => ({
  ...state,
  guidesVisible: visible,
});

export const setGuideColor = (state: EditorState, color: string) => ({
  ...state,
  guideColor: color,
});

export const setGuideColors = (
  state: EditorState,
  payload: { h?: string; v?: string; selected?: string }
) => ({
  ...state,
  guideColorH: payload.h ?? state.guideColorH,
  guideColorV: payload.v ?? state.guideColorV,
  selectedGuideColor: payload.selected ?? state.selectedGuideColor,
});

export const setCanvasSize = (
  state: EditorState,
  width?: number,
  height?: number
) => ({
  ...state,
  canvasSize: {
    width: Math.max(0, Math.floor(width || 0)),
    height: Math.max(0, Math.floor(height || 0)),
  },
});

export const setSnap = (
  state: EditorState,
  enabled?: boolean,
  px?: number
) => ({
  ...state,
  snapEnabled: enabled ?? state.snapEnabled,
  snapPx: px ?? state.snapPx,
});

export const setGuideStyle = (
  state: EditorState,
  payload: {
    hAlpha?: number;
    vAlpha?: number;
    selectedAlpha?: number;
    hSize?: number;
    vSize?: number;
  }
) => ({
  ...state,
  guideAlphaH:
    payload.hAlpha != null
      ? Math.max(0, Math.min(1, payload.hAlpha))
      : state.guideAlphaH,
  guideAlphaV:
    payload.vAlpha != null
      ? Math.max(0, Math.min(1, payload.vAlpha))
      : state.guideAlphaV,
  selectedGuideAlpha:
    payload.selectedAlpha != null
      ? Math.max(0, Math.min(1, payload.selectedAlpha))
      : state.selectedGuideAlpha,
  guideThicknessH:
    payload.hSize != null
      ? Math.max(1, Math.round(payload.hSize))
      : state.guideThicknessH,
  guideThicknessV:
    payload.vSize != null
      ? Math.max(1, Math.round(payload.vSize))
      : state.guideThicknessV,
});

export const setExportOptions = (
  state: EditorState,
  payload: Partial<{
    zipName: string;
    filenamePattern: string;
    minWidthPx: number;
    minHeightPx: number;
    dryRun: boolean;
  }>
) => ({
  ...state,
  exportZipName: payload.zipName ?? state.exportZipName,
  exportFilenamePattern: payload.filenamePattern ?? state.exportFilenamePattern,
  exportMinWidthPx:
    payload.minWidthPx != null
      ? Math.max(1, Math.round(payload.minWidthPx))
      : state.exportMinWidthPx,
  exportMinHeightPx:
    payload.minHeightPx != null
      ? Math.max(1, Math.round(payload.minHeightPx))
      : state.exportMinHeightPx,
  exportDryRun: payload.dryRun ?? state.exportDryRun,
});

export const setExportMax = (
  state: EditorState,
  payload: Partial<{ maxWidthPx: number; maxHeightPx: number }>
) => ({
  ...state,
  exportMaxWidthPx:
    payload.maxWidthPx != null
      ? Math.max(1, Math.round(payload.maxWidthPx))
      : state.exportMaxWidthPx,
  exportMaxHeightPx:
    payload.maxHeightPx != null
      ? Math.max(1, Math.round(payload.maxHeightPx))
      : state.exportMaxHeightPx,
});

export const setExportFlags = (
  state: EditorState,
  payload: Partial<{
    useZipName: boolean;
    useFilenamePattern: boolean;
    useFilters: boolean;
    useMinWidth: boolean;
    useMinHeight: boolean;
    useMaxWidth: boolean;
    useMaxHeight: boolean;
  }>
) => ({
  ...state,
  exportUseZipName: payload.useZipName ?? state.exportUseZipName,
  exportUseFilenamePattern:
    payload.useFilenamePattern ?? state.exportUseFilenamePattern,
  exportUseFilters: payload.useFilters ?? state.exportUseFilters,
  exportUseMinWidth: payload.useMinWidth ?? state.exportUseMinWidth,
  exportUseMinHeight: payload.useMinHeight ?? state.exportUseMinHeight,
  exportUseMaxWidth: payload.useMaxWidth ?? state.exportUseMaxWidth,
  exportUseMaxHeight: payload.useMaxHeight ?? state.exportUseMaxHeight,
});

export const resetExportOptions = (state: EditorState) => ({
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
});
