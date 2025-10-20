import React, { useCallback, useEffect, useRef, useState } from 'react';

import EditorLine from '@/components/editor/EditorLine';

import { SplitLine, useEditor } from '@/store/editor';

interface PropogateClickArgs {
  element: HTMLSpanElement | null;
  align: 'horizontal' | 'vertical';
  linePositionSetter: CallableFunction;
  linePosition: number;
}

const EditorGuidelines = ({ imageFill }: { imageFill: [number, number] }) => {
  const { state, dispatch } = useEditor();
  const viewRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState<boolean>(false);
  const [startDistance, setStartDistance] = useState<number>(0);

  const [dragProps, setDragProps] = useState<PropogateClickArgs>({
    element: null,
    align: 'horizontal',
    linePositionSetter: () => {
      return null;
    },
    linePosition: 0,
  });

  const snapPct = useCallback(
    (align: 'horizontal' | 'vertical', nextPct: number) => {
      if (!state.snapEnabled) return nextPct;
      const total =
        align === 'horizontal'
          ? state.canvasSize.height || 1
          : state.canvasSize.width || 1;
      const px = (nextPct / 100) * total;
      const snappedPx = Math.round(px / state.snapPx) * state.snapPx;
      return (snappedPx / total) * 100;
    },
    [
      state.snapEnabled,
      state.canvasSize.height,
      state.canvasSize.width,
      state.snapPx,
    ]
  );

  const propogateClickFromChild = (
    e: MouseEvent,
    { element, align, linePositionSetter, linePosition }: PropogateClickArgs
  ) => {
    setDragProps({ element, align, linePositionSetter, linePosition });
    setDragging(true);
    setStartDistance(align === 'horizontal' ? e.clientY : e.clientX);
  };

  const dragBinders = {
    onMouseUp: () => {
      setDragging(false);
      setStartDistance(0);
    },
    onMouseLeave: () => {
      setDragging(false);
      setStartDistance(0);
    },
    onMouseMove: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (dragging) {
        if (dragProps.align === 'horizontal') {
          const delta = e.clientY - startDistance;
          const { height } =
            viewRef.current?.getBoundingClientRect() ||
            ({ left: 0, top: 0, width: 0, height: 0 } as DOMRect);
          const deltaPercentage = (delta / height) * 100;
          const next = dragProps.linePosition + deltaPercentage;
          dragProps.linePositionSetter(snapPct('horizontal', next));
        } else if (dragProps.align === 'vertical') {
          const delta = e.clientX - startDistance;
          const { width } =
            viewRef.current?.getBoundingClientRect() ||
            ({ left: 0, top: 0, width: 0, height: 0 } as DOMRect);
          const deltaPercentage = (delta / width) * 100;
          const next = dragProps.linePosition + deltaPercentage;
          dragProps.linePositionSetter(snapPct('vertical', next));
        }
      }
    },
  };

  // Track size of the guidelines viewport for pixel <-> percent conversions
  useEffect(() => {
    const updateSize = () => {
      const rect = viewRef.current?.getBoundingClientRect();
      if (!rect) return;
      dispatch({
        type: 'SET_CANVAS_SIZE',
        payload: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [dispatch]);

  // Keyboard control for selected lines: pixel nudges and delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const hasSelection =
        state.selected.horizontal.length > 0 ||
        state.selected.vertical.length > 0;
      if (!hasSelection) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        // Use snap step when snap is enabled so each nudge lands on the grid.
        const baseStep = state.snapEnabled ? state.snapPx : 1;
        const pxStep = e.shiftKey ? baseStep * 4 : baseStep;
        const dir = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
        // Move all selected horizontals with Up/Down
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          const total = state.canvasSize.height || 1;
          state.selected.horizontal.forEach((index) => {
            const currentPct = state.horizontalSplit[index]?.position ?? 0;
            const newPct = snapPct(
              'horizontal',
              currentPct + (dir * pxStep * 100) / total
            );
            dispatch({
              type: 'SET_LINE_POSITION',
              payload: { align: 'horizontal', index, position: newPct },
            });
          });
        }
        // Move all selected verticals with Left/Right
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const total = state.canvasSize.width || 1;
          state.selected.vertical.forEach((index) => {
            const currentPct = state.verticalSplit[index]?.position ?? 0;
            const newPct = snapPct(
              'vertical',
              currentPct + (dir * pxStep * 100) / total
            );
            dispatch({
              type: 'SET_LINE_POSITION',
              payload: { align: 'vertical', index, position: newPct },
            });
          });
        }
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'CLEAR_SELECTED_LINES' });
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'REMOVE_SELECTED_LINES' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    dispatch,
    state.selected,
    state.horizontalSplit,
    state.verticalSplit,
    state.canvasSize.height,
    state.canvasSize.width,
    state.snapEnabled,
    state.snapPx,
    snapPct,
  ]);

  return (
    <div
      id='guidelines'
      className='relative h-full w-full'
      ref={viewRef}
      style={{
        width: `${imageFill[0] * 100}%`,
        height: `${imageFill[1] * 100}%`,
      }}
      {...dragBinders}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget)
          dispatch({ type: 'CLEAR_SELECTED_LINES' });
      }}
    >
      {state.guidesVisible &&
        state.horizontalSplit.map((line: SplitLine, i: number) => (
          <EditorLine
            line={line}
            key={`hline-${i}`}
            index={i}
            clickHandler={propogateClickFromChild}
            horizontal
            selected={state.selected.horizontal.includes(i)}
            color={state.guideColorH}
          />
        ))}
      {state.guidesVisible &&
        state.verticalSplit.map((line: SplitLine, i: number) => (
          <EditorLine
            line={line}
            key={`vline-${i}`}
            index={i}
            clickHandler={propogateClickFromChild}
            vertical
            selected={state.selected.vertical.includes(i)}
            color={state.guideColorV}
          />
        ))}
    </div>
  );
};

export default EditorGuidelines;
