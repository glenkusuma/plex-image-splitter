import JSZip from 'jszip';

import { EditorState, SplitLine } from '@/store/editor';

import zipMD from '@/constant/zip';

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
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < src.length; i++) {
    const image = new Image();
    const imageBlob = await fetch(src[i]).then((response) => response.blob());
    image.src = URL.createObjectURL(imageBlob);
    await new Promise((resolve) => (image.onload = resolve));
    images.push(image);
  }

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

  const cleanUp = (splits: SplitLine[]) => {
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

  const useFilters = !!state.exportUseFilters;
  const minW = Math.max(1, state.exportMinWidthPx || 1);
  const minH = Math.max(1, state.exportMinHeightPx || 1);
  const maxW = Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER);
  const maxH = Math.max(1, state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER);

  const candidates: Candidate[] = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const [hsplits, vsplits] = [
      cleanUp(state.horizontalSplit),
      cleanUp(state.verticalSplit),
    ];
    const percentSplits: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];
    for (let hi = 0; hi < hsplits.length - 1; hi++) {
      for (let vj = 0; vj < vsplits.length - 1; vj++) {
        const [currHSplit, nextHSplit] = [hsplits[hi], hsplits[hi + 1]];
        const [currVSplit, nextVSplit] = [vsplits[vj], vsplits[vj + 1]];
        percentSplits.push({
          x: currVSplit.position,
          y: currHSplit.position,
          width: nextVSplit.position - currVSplit.position,
          height: nextHSplit.position - currHSplit.position,
        });
      }
    }
    const pixelSplits = percentSplits.map((split) => ({
      x: (split.x * image.width) / 100,
      y: (split.y * image.height) / 100,
      width: (split.width * image.width) / 100,
      height: (split.height * image.height) / 100,
    }));
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
  const filtered = candidates.filter((c) => {
    if (!useFilters) return true;
    if (
      (state.exportUseMinWidth && c.width < minW) ||
      (state.exportUseMinHeight && c.height < minH)
    )
      return false;
    if (
      (state.exportUseMaxWidth && c.width > maxW) ||
      (state.exportUseMaxHeight && c.height > maxH)
    )
      return false;
    return true;
  });

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
  const pattern =
    (state.exportUseFilenamePattern
      ? state.exportFilenamePattern
      : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';
  const files: File[] = [];
  const filePromises = finalSelected.map((c) => {
    const image = images[c.i];
    const w = Math.floor(c.width);
    const h = Math.floor(c.height);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    if (!context) return Promise.resolve<File | null>(null);
    context.drawImage(image, c.x, c.y, w, h, 0, 0, w, h);
    const name = pattern
      .replace('{i}', String(c.i))
      .replace('{index}', String(c.index))
      .replace('{w}', String(w))
      .replace('{h}', String(h))
      .replace('{findex}', String(findexMap.get(c.key) ?? ''))
      .replace('{sindex}', String(sindexMap.get(c.key) ?? ''));
    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], name, { type: 'image/png' });
        resolve(file);
      });
    });
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
    const image = new Image();
    const imageBlob = await fetch(src[i]).then((response) => response.blob());
    image.src = URL.createObjectURL(imageBlob);
    await new Promise((resolve) => (image.onload = resolve));

    const files: SlicePreview[] = [];

    const cleanUp = (splits: SplitLine[]) => {
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

    const [hsplits, vsplits] = [
      cleanUp(state.horizontalSplit),
      cleanUp(state.verticalSplit),
    ];
    const splits: { x: number; y: number; width: number; height: number }[] =
      [];
    for (let ii = 0; ii < hsplits.length - 1; ii++) {
      for (let j = 0; j < vsplits.length - 1; j++) {
        const [currHSplit, nextHSplit] = [hsplits[ii], hsplits[ii + 1]];
        const [currVSplit, nextVSplit] = [vsplits[j], vsplits[j + 1]];
        splits.push({
          x: (currVSplit.position * image.width) / 100,
          y: (currHSplit.position * image.height) / 100,
          width:
            ((nextVSplit.position - currVSplit.position) * image.width) / 100,
          height:
            ((nextHSplit.position - currHSplit.position) * image.height) / 100,
        });
      }
    }

    const useFilters = !!state.exportUseFilters;
    const minW = Math.max(1, state.exportMinWidthPx || 1);
    const minH = Math.max(1, state.exportMinHeightPx || 1);
    const maxW = Math.max(1, state.exportMaxWidthPx || Number.MAX_SAFE_INTEGER);
    const maxH = Math.max(
      1,
      state.exportMaxHeightPx || Number.MAX_SAFE_INTEGER
    );
    const formatName = (idx: number, w: number, h: number) => {
      const pattern =
        (state.exportUseFilenamePattern
          ? state.exportFilenamePattern
          : 'image-{i}-split-{index}.png') || 'image-{i}-split-{index}.png';
      return pattern
        .replace('{i}', String(i))
        .replace('{index}', String(idx))
        .replace('{w}', String(w))
        .replace('{h}', String(h));
    };

    const previewPromises = splits.map((split, index) => {
      const w = Math.floor(split.width);
      const h = Math.floor(split.height);
      if (useFilters) {
        if (
          (state.exportUseMinWidth && w < minW) ||
          (state.exportUseMinHeight && h < minH)
        )
          return Promise.resolve<SlicePreview | null>(null);
        if (
          (state.exportUseMaxWidth && w > maxW) ||
          (state.exportUseMaxHeight && h > maxH)
        )
          return Promise.resolve<SlicePreview | null>(null);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext('2d');
      if (!context) return Promise.resolve<SlicePreview | null>(null);
      context.drawImage(image, split.x, split.y, w, h, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/png');
      return Promise.resolve({
        i,
        index,
        width: w,
        height: h,
        name: formatName(index, w, h),
        dataUrl,
      });
    });

    const previews = await Promise.all(previewPromises);
    previews.forEach((p) => {
      if (p) files.push(p);
    });

    items.push(...files);
  }
  return items;
};
