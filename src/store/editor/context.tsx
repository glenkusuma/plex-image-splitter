import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { reducer } from './reducer';
import { initialState } from './state';
import { EditorContextType, PresetData } from './types';

export const EditorContext = createContext({} as EditorContextType);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Session persistence
  const SESSION_KEY = 'pis.session.v1';

  // Hydrate on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PresetData;
        if (parsed && typeof parsed.version === 'number') {
          dispatch({ type: 'HYDRATE_SESSION', payload: { data: parsed } });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Editor] Failed to hydrate session', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist when guideline state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const data: PresetData = {
      version: 1,
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
    };
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
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
  ]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
