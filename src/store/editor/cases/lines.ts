import {
  _subdivide,
  generateEvenSplits,
  subdivide,
} from '@/store/editor/state';
import type {
  EditorState,
  PresetData,
  SessionData,
  SplitLine,
} from '@/store/editor/types';

export const hydrateSession = (
  state: EditorState,
  d: SessionData
): EditorState => ({
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
  // export options
  exportZipName: d.exportZipName ?? state.exportZipName,
  exportFilenamePattern: d.exportFilenamePattern ?? state.exportFilenamePattern,
  exportMinWidthPx: d.exportMinWidthPx ?? state.exportMinWidthPx,
  exportMinHeightPx: d.exportMinHeightPx ?? state.exportMinHeightPx,
  exportDryRun: d.exportDryRun ?? state.exportDryRun,
  exportMaxWidthPx: d.exportMaxWidthPx ?? state.exportMaxWidthPx,
  exportMaxHeightPx: d.exportMaxHeightPx ?? state.exportMaxHeightPx,
  exportUseZipName: d.exportUseZipName ?? state.exportUseZipName,
  exportUseFilenamePattern:
    d.exportUseFilenamePattern ?? state.exportUseFilenamePattern,
  exportUseFilters: d.exportUseFilters ?? state.exportUseFilters,
  exportUseMinWidth: d.exportUseMinWidth ?? state.exportUseMinWidth,
  exportUseMinHeight: d.exportUseMinHeight ?? state.exportUseMinHeight,
  exportUseMaxWidth: d.exportUseMaxWidth ?? state.exportUseMaxWidth,
  exportUseMaxHeight: d.exportUseMaxHeight ?? state.exportUseMaxHeight,
});

export const applyPreset = (
  state: EditorState,
  preset: PresetData
): EditorState => {
  const clampSplit = (arr: SplitLine[]) =>
    arr.map((l) => ({
      position: Math.max(0, Math.min(100, l.position)),
      size: Math.max(0, Math.min(100, l.size)),
    }));
  return {
    ...state,
    horizontalSplit: preset.horizontalSplit
      ? clampSplit(preset.horizontalSplit)
      : state.horizontalSplit,
    verticalSplit: preset.verticalSplit
      ? clampSplit(preset.verticalSplit)
      : state.verticalSplit,
    guidesVisible: preset.guidesVisible ?? state.guidesVisible,
    guideColor: preset.guideColor ?? state.guideColor,
    guideColorH: preset.guideColorH ?? state.guideColorH,
    guideColorV: preset.guideColorV ?? state.guideColorV,
    selectedGuideColor: preset.selectedGuideColor ?? state.selectedGuideColor,
    selectedGuideAlpha: preset.selectedGuideAlpha ?? state.selectedGuideAlpha,
    guideAlphaH: preset.guideAlphaH ?? state.guideAlphaH,
    guideAlphaV: preset.guideAlphaV ?? state.guideAlphaV,
    guideThicknessH: preset.guideThicknessH ?? state.guideThicknessH,
    guideThicknessV: preset.guideThicknessV ?? state.guideThicknessV,
    snapEnabled: preset.snapEnabled ?? state.snapEnabled,
    snapPx: preset.snapPx ?? state.snapPx,
    selected: { horizontal: [], vertical: [] },
  };
};

export const setLinePosition = (
  state: EditorState,
  align: 'horizontal' | 'vertical',
  index: number,
  position: number
): EditorState => ({
  ...state,
  horizontalSplit: state.horizontalSplit.map((line, i) =>
    i === index && align === 'horizontal'
      ? { ...line, position: Math.max(0, Math.min(100, position)) }
      : line
  ),
  verticalSplit: state.verticalSplit.map((line, i) =>
    i === index && align === 'vertical'
      ? { ...line, position: Math.max(0, Math.min(100, position)) }
      : line
  ),
});

export const subdivideBoth = (state: EditorState, count: number) => ({
  ...state,
  ...subdivide(
    {
      horizontalSplit: [...state.horizontalSplit],
      verticalSplit: [...state.verticalSplit],
    },
    count
  ),
});

export const subdivideH = (state: EditorState, count: number) => ({
  ...state,
  horizontalSplit: _subdivide([...state.horizontalSplit], count),
});

export const subdivideV = (state: EditorState, count: number) => ({
  ...state,
  verticalSplit: _subdivide([...state.verticalSplit], count),
});

export const subdivideItr = (state: EditorState, itr: number) => ({
  ...state,
  ...subdivide({ horizontalSplit: [], verticalSplit: [] }, itr),
});

export const generateGrid = (
  state: EditorState,
  hCount: number,
  vCount: number
) => ({
  ...state,
  horizontalSplit: generateEvenSplits(hCount),
  verticalSplit: generateEvenSplits(vCount),
});
