import JSZip from 'jszip';

import { EditorState } from '@/store/editor';

import zipMD from '@/constant/zip';

import {
  cleanUpSplits,
  computePixelSplits,
  drawSliceToFile,
  formatName,
  getFilterFlags,
  getPattern,
  loadImages,
} from './export/helpers';

export interface SlicePreview {
  i: number; // source image index
  index: number; // slice index
  width: number;
  height: number;
  name: string;
  dataUrl: string;
}

export const exportImages = async (
  state: EditorState,
  src: string[],
  options?: { whitelist?: Set<string> }
): Promise<Blob> => {
  const zip = new JSZip();

  // 1) Load all images
  const images = await loadImages(src);

  // 2) Build split candidates across all images
  type Candidate = {
    key: string; // `${i}-${index}`
    i: number;
    index: number; // slice index within image before any filtering
    x: number;
    y: number;
    width: number;
    height: number; // in pixels
  };

  const useFiltersFlags = getFilterFlags(state);

  const candidates: Candidate[] = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const [hsplits, vsplits] = [
      cleanUpSplits(state.horizontalSplit),
      cleanUpSplits(state.verticalSplit),
    ];
    const pixelSplits = computePixelSplits(image, hsplits, vsplits);
    pixelSplits.forEach((split, index) => {
      candidates.push({
        key: `${i}-${index}`,
        i,
        index,
        x: split.x,
        y: split.y,
        width: split.width,
        height: split.height,
      });
    });
  }

  // 3) Apply filters and whitelist
  const filtered = candidates.filter((c) =>
    getFilterFlags(state).useFilters
      ? !(
          (useFiltersFlags.useMinW && c.width < useFiltersFlags.minW) ||
          (useFiltersFlags.useMinH && c.height < useFiltersFlags.minH) ||
          (useFiltersFlags.useMaxW && c.width > useFiltersFlags.maxW) ||
          (useFiltersFlags.useMaxH && c.height > useFiltersFlags.maxH)
        )
      : true
  );

  const finalSelected =
    options && options.whitelist
      ? filtered.filter(
          (c) => options.whitelist && options.whitelist.has(c.key)
        )
      : filtered;

  // 4) Build index maps for {findex} and {sindex}
  const findexMap = new Map<string, number>();
  filtered.forEach((c, idx) => findexMap.set(c.key, idx));
  const sindexMap = new Map<string, number>();
  finalSelected.forEach((c, idx) => sindexMap.set(c.key, idx));

  // 5) Create files only for finalSelected
  const pattern = getPattern(state);
  const files: File[] = [];
  const filePromises = finalSelected.map((c) => {
    const image = images[c.i];
    const w = Math.floor(c.width);
    const h = Math.floor(c.height);
    const name = formatName(pattern, {
      i: c.i,
      index: c.index,
      w,
      h,
      findex: findexMap.get(c.key) ?? '',
      sindex: sindexMap.get(c.key) ?? '',
    });
    return drawSliceToFile(image, c.x, c.y, w, h, name);
  });

  const created = await Promise.all(filePromises);
  created.forEach((f) => {
    if (f) files.push(f);
  });

  // 6) Add to zip and finalize
  const addPromises = files.map((file) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        zip.file(file.name, reader?.result as ArrayBuffer);
        resolve();
      };
      reader.readAsArrayBuffer(file);
    });
  });
  await Promise.all(addPromises);

  zip.file('README.md', zipMD);
  const file = await zip.generateAsync({ type: 'blob' });
  return file;
};

export const preparePreview = async (
  state: EditorState,
  src: string[]
): Promise<SlicePreview[]> => {
  const items: SlicePreview[] = [];
  for (let i = 0; i < src.length; i++) {
    const image = (await loadImages([src[i]]))[0];

    const files: SlicePreview[] = [];

    const [hsplits, vsplits] = [
      cleanUpSplits(state.horizontalSplit),
      cleanUpSplits(state.verticalSplit),
    ];
    const splits = computePixelSplits(image, hsplits, vsplits);

    const flags = getFilterFlags(state);
    const pattern = getPattern(state);

    const previewPromises = splits.map((split, index) => {
      const w = Math.floor(split.width);
      const h = Math.floor(split.height);
      if (
        flags.useFilters &&
        ((flags.useMinW && w < flags.minW) ||
          (flags.useMinH && h < flags.minH) ||
          (flags.useMaxW && w > flags.maxW) ||
          (flags.useMaxH && h > flags.maxH))
      )
        return Promise.resolve<SlicePreview | null>(null);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext('2d');
      if (!context) return Promise.resolve<SlicePreview | null>(null);
      context.drawImage(image, split.x, split.y, w, h, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/png');
      const name = formatName(pattern, { i, index, w, h });
      return Promise.resolve({ i, index, width: w, height: h, name, dataUrl });
    });

    const previews = await Promise.all(previewPromises);
    previews.forEach((p) => {
      if (p) files.push(p);
    });

    items.push(...files);
  }
  return items;
};
