import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import ConfirmModal from '@/components/ui/ConfirmModal';

import { reducer } from './reducer';
import { initialState } from './state';
import { EditorContextType, SessionData } from './types';

export const EditorContext = createContext({} as EditorContextType);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Session persistence (per-tab)
  const SESSION_KEY_PREFIX = 'pis.session.v1';
  const SESSION_ID_KEY = 'pis.sessionId.v1';

  // Per-tab session id, persisted in sessionStorage so multiple tabs don't clash.
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Establish per-tab session id on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Resolve or create a per-tab session id
      let id = window.sessionStorage.getItem(SESSION_ID_KEY);
      if (!id) {
        id = `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;
        window.sessionStorage.setItem(SESSION_ID_KEY, id);
      }
      setSessionId(id);

      // Attempt to load a saved session for this tab id
      const raw = window.localStorage.getItem(`${SESSION_KEY_PREFIX}:${id}`);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionData;
        if (parsed && typeof parsed.version === 'number') {
          // defer actual hydration until the user confirms they want to restore
          setPendingSession(parsed);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Editor] Failed to hydrate session', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pendingSession, setPendingSession] = useState<SessionData | null>(
    null
  );

  // Persist when guideline/export options state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionId) return;
    const data: SessionData = {
      version: 2,
      horizontalSplit: state.horizontalSplit,
      verticalSplit: state.verticalSplit,
      guidesVisible: state.guidesVisible,
      guideColor: state.guideColor,
      guideColorH: state.guideColorH,
      guideColorV: state.guideColorV,
      selectedGuideColor: state.selectedGuideColor,
      selectedGuideAlpha: state.selectedGuideAlpha,
      guideAlphaH: state.guideAlphaH,
      guideAlphaV: state.guideAlphaV,
      guideThicknessH: state.guideThicknessH,
      guideThicknessV: state.guideThicknessV,
      snapEnabled: state.snapEnabled,
      snapPx: state.snapPx,
      // export options
      exportZipName: state.exportZipName,
      exportFilenamePattern: state.exportFilenamePattern,
      exportMinWidthPx: state.exportMinWidthPx,
      exportMinHeightPx: state.exportMinHeightPx,
      exportDryRun: state.exportDryRun,
      exportMaxWidthPx: state.exportMaxWidthPx,
      exportMaxHeightPx: state.exportMaxHeightPx,
      exportUseZipName: state.exportUseZipName,
      exportUseFilenamePattern: state.exportUseFilenamePattern,
      exportUseFilters: state.exportUseFilters,
      exportUseMinWidth: state.exportUseMinWidth,
      exportUseMinHeight: state.exportUseMinHeight,
      exportUseMaxWidth: state.exportUseMaxWidth,
      exportUseMaxHeight: state.exportUseMaxHeight,
    };
    try {
      window.localStorage.setItem(
        `${SESSION_KEY_PREFIX}:${sessionId}`,
        JSON.stringify(data)
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Editor] Failed to persist session', e);
    }
  }, [
    state.horizontalSplit,
    state.verticalSplit,
    state.guidesVisible,
    state.guideColor,
    state.guideColorH,
    state.guideColorV,
    state.selectedGuideColor,
    state.selectedGuideAlpha,
    state.guideAlphaH,
    state.guideAlphaV,
    state.guideThicknessH,
    state.guideThicknessV,
    state.snapEnabled,
    state.snapPx,
    // export options
    state.exportZipName,
    state.exportFilenamePattern,
    state.exportMinWidthPx,
    state.exportMinHeightPx,
    state.exportDryRun,
    state.exportMaxWidthPx,
    state.exportMaxHeightPx,
    state.exportUseZipName,
    state.exportUseFilenamePattern,
    state.exportUseFilters,
    state.exportUseMinWidth,
    state.exportUseMinHeight,
    state.exportUseMaxWidth,
    state.exportUseMaxHeight,
    sessionId,
  ]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}

      <ConfirmModal
        open={Boolean(pendingSession)}
        title='Welcome back — continue where you left off?'
        message={
          <div className='space-y-2'>
            <p>
              We found a saved session for this tab. You can continue with your
              previously saved guidelines and export options (image source is
              not restored), or start fresh.
            </p>
            <p className='text-xs text-gray-400'>
              Tip: Each browser tab keeps its own session, so your changes here
              won&apos;t overwrite other open tabs.
            </p>
          </div>
        }
        onCancel={() => {
          // Start new: delete this tab's saved session and continue
          try {
            if (typeof window !== 'undefined' && sessionId) {
              window.localStorage.removeItem(
                `${SESSION_KEY_PREFIX}:${sessionId}`
              );
            }
          } catch (e) {
            // noop
          }
          setPendingSession(null);
        }}
        onConfirm={() => {
          if (pendingSession) {
            dispatch({
              type: 'HYDRATE_SESSION',
              payload: { data: pendingSession },
            });
          }
          setPendingSession(null);
        }}
        intent='normal'
        confirmText='Continue session'
        cancelText='New blank session (delete)'
      />
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
