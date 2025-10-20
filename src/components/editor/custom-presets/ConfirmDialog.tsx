import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

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

  return (
    <AnimatePresence>
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='w-[90vw] max-w-sm rounded-md bg-gray-900 p-4 text-white shadow-xl'
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
