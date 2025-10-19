import { EditorState, Split, SplitLine } from './types';

// Initial state
export const initialState: EditorState = {
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

// Utilities
export const _subdivide = (splits: SplitLine[], count: number) => {
  splits.unshift({ position: 0, size: 100 });
  splits.push({ position: 100, size: 100 });
  splits = splits.flatMap((line: SplitLine, i: number) => {
    if (i === 0) return [];
    const prevLine = splits[i - 1];
    const deltaDistance = (line.position - prevLine.position) / (count + 1);
    const size = Math.min(prevLine.size, line.size);
    const newLines = Array.from(Array(count).keys()).map((i) => ({
      position: prevLine.position + deltaDistance * (i + 1),
      size,
    }));
    return [...newLines, line];
  }, []);
  splits.pop();
  return splits;
};

export const subdivide = (splits: Split, count: number) => ({
  horizontalSplit: _subdivide(splits.horizontalSplit, count),
  verticalSplit: _subdivide(splits.verticalSplit, count),
});

export const generateEvenSplits = (count: number): SplitLine[] => {
  if (!count || count <= 0) return [];
  const delta = 100 / (count + 1);
  return Array.from({ length: count }).map((_, i) => ({
    position: +(delta * (i + 1)).toFixed(6),
    size: 100,
  }));
};
