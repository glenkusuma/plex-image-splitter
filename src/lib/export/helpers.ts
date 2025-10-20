import type { EditorState, SplitLine } from '@/store/editor';

export const loadImages = async (src: string[]) => {
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < src.length; i++) {
    const image = new Image();
    const imageBlob = await fetch(src[i]).then((response) => response.blob());
    image.src = URL.createObjectURL(imageBlob);
    await new Promise((resolve) => (image.onload = resolve));
    images.push(image);
  }
  return images;
};

export const cleanUpSplits = (splits: SplitLine[]) => {
  let supplemented = [
    { position: 0, size: 100 },
    ...splits,
    { position: 100, size: 100 },
  ];
  supplemented = supplemented.sort((a, b) => a.position - b.position);
  supplemented = supplemented.filter(
    (split, index) =>
      index === 0 || split.position !== supplemented[index - 1].position
  );
  return supplemented;
};

export type PixelSplit = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const computePixelSplits = (
  image: HTMLImageElement,
  hsplits: SplitLine[],
  vsplits: SplitLine[]
): PixelSplit[] => {
  const result: PixelSplit[] = [];
  for (let hi = 0; hi < hsplits.length - 1; hi++) {
    for (let vj = 0; vj < vsplits.length - 1; vj++) {
      const [currHSplit, nextHSplit] = [hsplits[hi], hsplits[hi + 1]];
      const [currVSplit, nextVSplit] = [vsplits[vj], vsplits[vj + 1]];
      result.push({
        x: (currVSplit.position * image.width) / 100,
        y: (currHSplit.position * image.height) / 100,
        width:
          ((nextVSplit.position - currVSplit.position) * image.width) / 100,
        height:
          ((nextHSplit.position - currHSplit.position) * image.height) / 100,
      });
    }
  }
  return result;
};

export const getFilterFlags = (state: EditorState) => ({
  useFilters: !!state.exportUseFilters,
  useMinW: !!state.exportUseMinWidth,
  useMinH: !!state.exportUseMinHeight,
  useMaxW: !!state.exportUseMaxWidth,
  useMaxH: !!state.exportUseMaxHeight,
  minW: Math.max(1, state.exportMinWidthPx || 1),
  minH: Math.max(1, state.exportMinHeightPx || 1),
  maxW: Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER),
  maxH: Math.max(1, state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER),
});

export const passesFilters = (
  flags: ReturnType<typeof getFilterFlags>,
  w: number,
  h: number
) => {
  if (!flags.useFilters) return true;
  if ((flags.useMinW && w < flags.minW) || (flags.useMinH && h < flags.minH))
    return false;
  if ((flags.useMaxW && w > flags.maxW) || (flags.useMaxH && h > flags.maxH))
    return false;
  return true;
};

export const getPattern = (state: EditorState) =>
  (state.exportUseFilenamePattern
    ? state.exportFilenamePattern
    : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';

export const formatName = (
  pattern: string,
  vars: Record<string, string | number>
) =>
  Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    pattern
  );

export const drawSliceToFile = (
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  name: string
) =>
  new Promise<File | null>((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    if (!context) return resolve(null);
    context.drawImage(image, x, y, w, h, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return resolve(null);
      const file = new File([blob], name, { type: 'image/png' });
      resolve(file);
    });
  });
