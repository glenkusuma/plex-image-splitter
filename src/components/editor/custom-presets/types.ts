import type { PresetData } from '@/store/editor';

export const PRESETS_KEY = 'pis.presets.v1';

export interface NamedPreset {
  id: string;
  name: string;
  data: PresetData;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export type PendingAction =
  | { kind: 'apply'; payload: NamedPreset }
  | { kind: 'delete'; payload: NamedPreset }
  | { kind: 'clear' }
  | { kind: 'overwrite'; payload: { id: string; name: string } }
  | {
      kind: 'importConfirm';
      payload: { toAdd: NamedPreset[]; duplicates: NamedPreset[] };
    }
  | { kind: 'save' }
  | { kind: 'rename'; payload: NamedPreset }
  | null;

export type ToastKind = 'success' | 'error' | 'info';
export type Toast = { id: string; kind: ToastKind; message: string };

export const now = () => Date.now();
export const uid = () => Math.random().toString(36).slice(2, 10);
