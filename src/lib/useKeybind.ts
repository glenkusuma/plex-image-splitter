import { useEffect } from 'react';

export type KeyBinding = {
  key: string; // case-insensitive, e.g. 'a', 'Escape'
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
  when?: () => boolean; // optional guard
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean; // default true
};

const isTextInput = (el: Element | null) => {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  const editable = (el as HTMLElement).isContentEditable;
  return (
    editable ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    (el as HTMLElement).getAttribute('role') === 'textbox'
  );
};

export function useKeybind(bindings: KeyBinding[], deps: unknown[] = []) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      // Ignore when typing in inputs/contenteditable except Escape
      if (e.key !== 'Escape' && isTextInput(target)) return;

      const key = String(e.key || '').toLowerCase();
      for (const b of bindings) {
        if (b.when && !b.when()) continue;
        const matchKey = String(b.key).toLowerCase();
        if (
          key === matchKey &&
          !!b.ctrl === (e.ctrlKey || false) &&
          !!b.meta === (e.metaKey || false) &&
          !!b.alt === (e.altKey || false) &&
          !!b.shift === (e.shiftKey || false)
        ) {
          if (b.preventDefault !== false) e.preventDefault();
          b.handler(e);
          break;
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
