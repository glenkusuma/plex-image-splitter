import React, { useEffect } from 'react';

import {
  FiltersBar,
  OptionsBar,
} from '@/components/editor/export-preview/Controls';
import FiltersPanel from '@/components/editor/export-preview/FiltersPanel';
import Footer from '@/components/editor/export-preview/Footer';
import Header from '@/components/editor/export-preview/Header';
import PreviewTable from '@/components/editor/export-preview/PreviewTable';
import { useExportPreviewState } from '@/components/editor/export-preview/useExportPreviewState';

declare global {
  interface Window {
    __openExportPreview?: () => Promise<void> | void;
  }
}

const EditorExportPreviewModal: React.FC = () => {
  const {
    state,
    dispatch,
    open,
    setOpen,
    fullscreen,
    setFullscreen,
    loading,
    showFilters,
    setShowFilters,
    showOptions,
    setShowOptions,
    filtersEnabled,
    setFiltersEnabled,
    useMinW,
    setUseMinW,
    useMinH,
    setUseMinH,
    useMaxW,
    setUseMaxW,
    useMaxH,
    setUseMaxH,
    minW,
    setMinW,
    minH,
    setMinH,
    maxW,
    setMaxW,
    maxH,
    setMaxH,
    filteredItems,
    selected,
    setSelected,
    selectedCount,
    formatName,
    openPreview,
    regenerate,
    matchFromExportOptions,
    applyNaming,
    resetFilters,
    resetOptions,
    applyFiltersToExport,
    exportAll,
    exportSelected,
  } = useExportPreviewState();

  useEffect(() => {
    window.__openExportPreview = openPreview;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      if (window.__openExportPreview) delete window.__openExportPreview;
      document.removeEventListener('keydown', onKey);
    };
  }, [openPreview, setOpen]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      <div
        className={[
          'flex flex-col overflow-hidden rounded-lg border border-blue-500/20 bg-gray-900 p-4 text-white shadow-2xl ring ring-blue-500/20',
          fullscreen
            ? 'fixed inset-0 m-0 h-screen w-screen max-w-none rounded-none'
            : 'max-h-[85vh] w-[95vw] sm:max-w-3xl md:max-w-5xl xl:max-w-7xl',
        ].join(' ')}
      >
        <Header
          selectedCount={selectedCount}
          totalFiltered={filteredItems.length}
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((f) => !f)}
          onClose={() => setOpen(false)}
        />
        <FiltersBar
          loading={loading}
          onSelectAll={() => {
            if (loading) return;
            const all: Record<string, boolean> = {};
            filteredItems.forEach((p) => (all[`${p.i}-${p.index}`] = true));
            setSelected(all);
          }}
          onDeselectAll={() => {
            if (!loading) setSelected({});
          }}
          onRegenerate={async () => {
            if (loading) return;
            await regenerate();
          }}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
          onMatchFromExportOptions={() => {
            if (loading) return;
            matchFromExportOptions();
          }}
        />
        <OptionsBar
          show={showOptions}
          exportZipName={state.exportZipName}
          exportUseZipName={state.exportUseZipName}
          exportFilenamePattern={state.exportFilenamePattern}
          exportUseFilenamePattern={state.exportUseFilenamePattern}
          setZipName={(v) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS',
              payload: { zipName: v || 'export.zip' },
            })
          }
          setUseZipName={(v) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS_FLAGS',
              payload: { useZipName: v },
            })
          }
          setFilenamePattern={(v) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS',
              payload: { filenamePattern: v },
            })
          }
          setUseFilenamePattern={(v) =>
            dispatch({
              type: 'SET_EXPORT_OPTIONS_FLAGS',
              payload: { useFilenamePattern: v },
            })
          }
          onApplyNaming={applyNaming}
          onReset={() => {
            if (loading) return;
            resetOptions();
          }}
        />
        <FiltersPanel
          show={showFilters}
          filtersEnabled={filtersEnabled}
          setFiltersEnabled={setFiltersEnabled}
          minW={minW}
          setMinW={(v) => setMinW(Math.max(1, v))}
          minH={minH}
          setMinH={(v) => setMinH(Math.max(1, v))}
          maxW={maxW}
          setMaxW={(v) => setMaxW(Math.max(1, v))}
          maxH={maxH}
          setMaxH={(v) => setMaxH(Math.max(1, v))}
          useMinW={useMinW}
          setUseMinW={setUseMinW}
          useMinH={useMinH}
          setUseMinH={setUseMinH}
          useMaxW={useMaxW}
          setUseMaxW={setUseMaxW}
          useMaxH={useMaxH}
          setUseMaxH={setUseMaxH}
          onReset={resetFilters}
          onApplyToExport={applyFiltersToExport}
        />
        <div className='flex-1 overflow-auto rounded border border-gray-700'>
          <PreviewTable
            loading={loading}
            filteredItems={filteredItems}
            selected={selected}
            setSelected={(next) => setSelected(next)}
            formatName={formatName}
          />
        </div>
        <Footer
          loading={loading}
          onExportAll={async () => {
            if (loading) return;
            await exportAll();
          }}
          onExportSelected={async () => {
            if (loading) return;
            await exportSelected();
          }}
        />
      </div>
    </div>
  );
};

export default EditorExportPreviewModal;
