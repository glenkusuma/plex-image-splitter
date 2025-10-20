import React, { useState } from 'react';

import { useKeybind } from '@/lib/useKeybind';

import EditorGuidelines from '@/components/editor/EditorGuidelines';
import EditorImage from '@/components/editor/EditorImage';

import { useEditor } from '@/store/editor';

const EditorCanvas = () => {
  const [imageFill, setImageFill] = useState<[number, number]>([1, 1]); // h, w
  const { state, dispatch } = useEditor();

  // Undo / Redo keybindings on the main canvas
  useKeybind(
    [
      // Ctrl+Z / Cmd+Z -> Undo
      {
        key: 'z',
        ctrl: true,
        handler: () => dispatch({ type: 'UNDO' }),
      },
      {
        key: 'z',
        meta: true,
        handler: () => dispatch({ type: 'UNDO' }),
      },
      // Ctrl+Y -> Redo
      {
        key: 'y',
        ctrl: true,
        handler: () => dispatch({ type: 'REDO' }),
      },
      // Cmd+Shift+Z -> Redo on mac
      {
        key: 'z',
        meta: true,
        shift: true,
        handler: () => dispatch({ type: 'REDO' }),
      },
      // Some users use Cmd+Y for redo as well
      {
        key: 'y',
        meta: true,
        handler: () => dispatch({ type: 'REDO' }),
      },
    ],
    // Only active when editor is active and not exporting
    [state.active, state.exporting, dispatch]
  );
  return (
    <div
      className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-200'
      style={{
        background: '#111',
        backgroundImage:
          'linear-gradient(rgba(100, 100, 100, .7) .05em, transparent .05em), linear-gradient(90deg, rgba(100,100,100, .7) .05em, transparent .05em)',
        backgroundSize: '1.5em 1.5em',
        backgroundPosition: 'center',
      }}
    >
      <EditorGuidelines imageFill={imageFill} />
      <EditorImage setFill={setImageFill} />
    </div>
  );
};

export default EditorCanvas;
