# Copilot instructions for plex-image-splitter

Purpose: give AI coding agents just enough project context to contribute safely and quickly. Keep suggestions concrete, reference files below, and mirror the repo’s patterns.

## Architecture

- Next.js (pages router) + React 18 + TypeScript + TailwindCSS.
- Editor state lives under `src/store/editor/` and is provided via a React Context + useReducer.
  - Files: `context.tsx` (provider/hooks), `reducer.ts` (pure cases in `reducerHelper`, history in outer `reducer`), `state.ts` (initial state + helpers), `types.ts` (state/action types), `index.ts` (re-exports).
  - Types: `SplitLine { position:number; size:number }` use percent (0–100). State holds `horizontalSplit`, `verticalSplit`, `history`, `activeSrc`, `exporting`, `active`, guideline styles, and export options.
  - Undo/redo/history baked into the outer `reducer`. Actions in `HISTORY_AGNOSTIC_ACTIONS` do not push history. Limits: `MAX_SPLITS=100`, `MAX_HISTORY=100`.
- UI composition: `src/pages/index.tsx` wraps the app in `EditorProvider` and renders `EditorSidebar` (controls) + `EditorCanvas` (image + guides).
  - Guides: `EditorCanvas.tsx` + `EditorGuidelines.tsx` render draggable lines via `EditorLine.tsx`, translating mouse deltas to percent relative to the container.
  - Controls: `EditorButtonCollection.tsx` groups presets/tools/history (`EditorPresets.tsx`, `EditorTools.tsx`, `EditorUndoRedo.tsx`, `EditorBatchApplyButton.tsx`, `EditorExporting.tsx`).
- Export: client-only via canvas + JSZip in `src/lib/export.ts`.
  - Computes rects from percent lines, draws slices to canvases, zips PNGs, adds `src/constant/zip.ts` content, returns a Blob.
- Export Preview: `src/components/editor/export-preview/` provides a windowed modal to preview and filter slices before exporting.
  - State hook: `useExportPreviewState.ts` (open/fullscreen, items, selection, filters, naming apply/match, export all/selected, regenerate).
  - UI parts: `Header.tsx`, `Controls.tsx`, `FiltersPanel.tsx`, `PreviewTable.tsx`, `Footer.tsx`.
- Export Options: `src/components/editor/export-options/` with small focused components composed by `EditorExportOptions.tsx`.
  - `ZipNameRow.tsx`, `FilenamePatternRow.tsx`, `FiltersSection.tsx`, `ResetOptionsDialog.tsx`.

## Conventions and patterns

- Percent coordinates: store split positions/sizes as 0–100 floats. Clamp on dispatch if needed. Convert to pixels only when rendering/exporting.
- Reducer contract: add pure cases in `reducerHelper`. The outer `reducer` enforces limits and manages history (trim redo on new change). Only add your type to `HISTORY_AGNOSTIC_ACTIONS` if it must not create history.
- Dragging history: call `dispatch({ type: 'PUSH_HISTORY' })` on drag start (see `EditorLine.tsx`).
- Disable rules: buttons generally disable when `!state.active` or `state.exporting`; follow this for new controls.
- Styling: Tailwind + `clsxm` (`src/lib/clsxm.ts`) for class merging. Colors in `src/styles/globals.css` and `tailwind.config.ts`.
- Imports: use `@/` for `src/` and `~/` for `public/`.
- File size limit: keep each source file under 200 lines.
  - If a file approaches 200 lines, split into smaller modules/components and compose from the parent.
  - Prefer extracting: UI rows/sections into components; reducer cases into helpers; utility functions into separate files.
  - Keep public APIs stable; re-export from an `index.ts` when helpful.

## Key flows

- Load image: `EditorImageInput.tsx` sets `activeSrc` from URL or file (data URL). `EditorImage.tsx` toggles `active` on load/error and computes `imageFill` for canvas.
- Drag guides: `EditorGuidelines.tsx` converts mouse delta to percent of container and calls `SET_LINE_POSITION` via `EditorLine.tsx`.
- Presets/grid: `EditorPresets.tsx` dispatches `GENERATE_GRID` using `generateEvenSplits` (`src/store/editor/state.ts`).
- Export single: dispatch `EXPORT` to schedule `exportImages(state, [state.activeSrc])` and download a zip.
- Batch export: `EditorBatchApplyButton.tsx` collects multiple file data URLs, toggles `SET_EXPORTING_FLAG`, calls `exportImages(state, srcs)`, then downloads.
- Export Preview: open via toolbar; supports matching filters/naming from Export Options, applying filters to options, selecting all/none, regenerating preview, and exporting all/selected.

## Build, test, and dev

- Package manager: Yarn v1 (lockfile present). Avoid mixing with npm/pnpm — delete other lockfiles if switching tools.
  - Dev: `yarn dev` • Build: `yarn build` • Start: `yarn start`
  - Lint: `yarn lint` or strict `yarn lint:strict` • Auto-fix: `yarn lint:fix`
  - Typecheck: `yarn typecheck`
  - Tests: `yarn test` or `yarn test:watch`
- Next config may ignore TS/ESLint errors during build (`next.config.js`). Always run lint/type locally.
- Jest + Testing Library (`jest.config.js`, `jest.setup.js`): router mocked via `next-router-mock`; aliases `@/` and `~/`; examples in `src/lib/__tests__/helper.test.ts` and `src/__tests__/pages/404.test.tsx`.

## Extension points (examples)

- New reducer action: add case in `reducerHelper` (pure), decide if it belongs in `HISTORY_AGNOSTIC_ACTIONS`, dispatch from a UI control.
- New control: add to `EditorTools`/`EditorPresets` following disable rules and call `PUSH_HISTORY` for drag/continuous changes.
- Export tweaks: modify `src/lib/export.ts` keeping percent→pixel conversion and async file/zip readiness checks intact.
- Export Preview: extend UI under `src/components/editor/export-preview/`, wiring through `useExportPreviewState.ts` without growing any single file beyond 200 lines.
- Export Options: add small controls under `src/components/editor/export-options/` and compose in `EditorExportOptions.tsx`.

## External notes

- External images: `images.domains = ['i.ibb.co']` in `next.config.js`.
- Misc: Open Graph helpers in `src/lib/helper.ts`; logging toggled by `src/constant/env.ts` for `src/lib/logger.ts`.

If anything here is unclear (e.g., action semantics, grid rules, export format), say what you’re adding and I’ll refine this guide.
