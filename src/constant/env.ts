export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true';

// Editor limits
export const MAX_SPLITS = Number(process.env.NEXT_PUBLIC_MAX_SPLITS ?? 100);
export const MAX_HISTORY = Number(process.env.NEXT_PUBLIC_MAX_HISTORY ?? 100);
