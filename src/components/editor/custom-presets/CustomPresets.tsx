import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import Button from '@/components/buttons/Button';

import ConfirmDialog from './ConfirmDialog';
import { useCustomPresets } from './hooks/useCustomPresets';
import ModalToolbar from './ModalToolbar';
import NameRow from './NameRow';
import PresetGrid from './PresetGrid';
import Toasts from './Toasts';

const CustomPresets: React.FC = () => {
  const {
    editorActive,
    editorExporting,
    presets,
    persist,
    newName,
    setNewName,
    showLauncher,
    setShowLauncher,
    openModal,
    setOpenModal,
    fullscreen,
    setFullscreen,
    pendingAction,
    setPendingAction,
    busy,
    setBusy,
    toasts,
    toPresetData,
    onApplyPreset,
    showToast,
    exportCurrentState,
    importPresetFromFile,
    renameState,
  } = useCustomPresets();

  return (
    <div className='mt-2'>
      <div className='rounded-md border border-gray-700 p-2'>
        <button
          type='button'
          onClick={() => setShowLauncher((s) => !s)}
          className='flex w-full cursor-pointer select-none items-center gap-2 text-left text-xs text-gray-300'
          title='Show or hide Custom Presets actions'
        >
          <div className='flex items-center gap-2 text-sm'>Custom Presets</div>
          <span className='ml-auto text-xs text-gray-400'>
            {showLauncher ? 'Hide' : 'Show'}
          </span>
        </button>
        {showLauncher && (
          <div className='mt-2 grid grid-cols-1 gap-2'>
            <Button
              onClick={() => setOpenModal(true)}
              title='Open presets modal'
              disabled={!editorActive || editorExporting}
            >
              Open
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={[
                'flex flex-col overflow-hidden rounded-md bg-gray-900 p-4 text-white shadow-xl',
                fullscreen
                  ? 'fixed inset-0 m-0 h-screen w-screen max-w-none rounded-none'
                  : 'max-h-[85vh] w-[95vw] sm:max-w-3xl md:max-w-5xl xl:max-w-7xl',
              ].join(' ')}
            >
              <ModalToolbar
                fullscreen={fullscreen}
                setFullscreen={(v) => setFullscreen(v)}
                onExport={exportCurrentState}
                onImportFile={importPresetFromFile}
                onClose={() => setOpenModal(false)}
              />
              <NameRow
                value={newName}
                onChange={setNewName}
                onSave={() => setPendingAction({ kind: 'save' })}
                onClearAll={() => setPendingAction({ kind: 'clear' })}
                disabledSave={!editorActive || editorExporting}
              />
              <div className='flex-1 overflow-auto rounded border border-gray-700'>
                <PresetGrid
                  presets={presets}
                  exporting={editorExporting}
                  active={editorActive}
                  onApply={(p) =>
                    setPendingAction({ kind: 'apply', payload: p })
                  }
                  onOverwrite={(p) =>
                    setPendingAction({
                      kind: 'overwrite',
                      payload: { id: p.id, name: p.name },
                    })
                  }
                  onRename={(p) => {
                    renameState.setTarget(p);
                    renameState.setValue(p.name);
                    renameState.setConflict(null);
                    setPendingAction({ kind: 'rename', payload: p });
                  }}
                  onDelete={(p) =>
                    setPendingAction({ kind: 'delete', payload: p })
                  }
                  onSort={(next) => persist(next)}
                />
              </div>

              <ConfirmDialog
                action={pendingAction}
                busy={busy}
                setBusy={setBusy}
                presets={presets}
                onCancel={() => setPendingAction(null)}
                onPersist={persist}
                onApplyPreset={onApplyPreset}
                toPresetData={toPresetData}
                showToast={showToast}
                saveName={newName}
                renameState={renameState}
              />

              <Toasts toasts={toasts} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomPresets;
