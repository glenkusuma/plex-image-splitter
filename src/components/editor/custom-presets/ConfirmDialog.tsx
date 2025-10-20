import React from 'react';

import ModalShell from '@/components/ui/ModalShell';

import ApplyView from './confirm/ApplyView';
import ClearView from './confirm/ClearView';
import DeleteView from './confirm/DeleteView';
import ImportConfirmView from './confirm/ImportConfirmView';
import OverwriteView from './confirm/OverwriteView';
import RenameView from './confirm/RenameView';
import SaveView from './confirm/SaveView';
import type { RenameState } from './hooks/useCustomPresets';
import type { NamedPreset, PendingAction } from './types';

type Props = {
  action: PendingAction;
  busy: boolean;
  setBusy: (b: boolean) => void;
  presets: NamedPreset[];
  onCancel: () => void;
  onPersist: (
    next: NamedPreset[] | ((prev: NamedPreset[]) => NamedPreset[])
  ) => void;
  onApplyPreset: (data: NamedPreset['data']) => void;
  toPresetData: () => NamedPreset['data'];
  showToast: (message: string, kind?: 'success' | 'error' | 'info') => void;
  saveName: string;
  renameState: RenameState;
};

const ConfirmDialog: React.FC<Props> = ({
  action,
  busy,
  setBusy,
  presets,
  onCancel,
  onPersist,
  onApplyPreset,
  toPresetData,
  showToast,
  saveName,
  renameState,
}) => {
  if (!action) return null;

  const dangerKinds = ['delete', 'clear', 'overwrite'] as const;
  const mapTitle = {
    importConfirm: 'Import Presets',
    apply: 'Apply Preset',
    save: 'Save Preset',
    delete: 'Delete Preset',
    clear: 'Clear All Presets',
    overwrite: 'Overwrite Preset',
    rename: 'Rename Preset',
  } as const;
  const title = mapTitle[action.kind];
  const intent = (dangerKinds as readonly string[]).includes(action.kind)
    ? 'danger'
    : 'normal';

  return (
    <ModalShell
      open={Boolean(action)}
      onClose={onCancel}
      title={title}
      intent={intent}
      size='sm'
    >
      {action.kind === 'importConfirm' && (
        <ImportConfirmView
          presets={presets}
          toAdd={action.payload.toAdd}
          duplicates={action.payload.duplicates}
          onPersist={(next) => onPersist(next)}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'apply' && (
        <ApplyView
          preset={action.payload}
          busy={busy}
          onApply={(data) => {
            setBusy(true);
            onApplyPreset(data);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'save' && (
        <SaveView
          presets={presets}
          name={(saveName || '').trim() || `Preset ${presets.length + 1}`}
          toPresetData={toPresetData}
          busy={busy}
          onPersist={(next) => {
            setBusy(true);
            onPersist(next);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'delete' && (
        <DeleteView
          presets={presets}
          name={action.payload.name}
          createdAt={action.payload.createdAt}
          busy={busy}
          onPersist={(next) => {
            setBusy(true);
            onPersist(next);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'clear' && (
        <ClearView
          busy={busy}
          onPersist={(next) => {
            setBusy(true);
            onPersist(next);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'overwrite' && (
        <OverwriteView
          presets={presets}
          name={action.payload.name}
          toPresetData={toPresetData}
          busy={busy}
          onPersist={(next) => {
            setBusy(true);
            onPersist(next);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}

      {action.kind === 'rename' && renameState.target && (
        <RenameView
          presets={presets}
          renameState={renameState}
          busy={busy}
          onPersist={(next) => {
            setBusy(true);
            onPersist(next);
            setBusy(false);
          }}
          onCancel={onCancel}
          showToast={showToast}
        />
      )}
    </ModalShell>
  );
};

export default ConfirmDialog;
