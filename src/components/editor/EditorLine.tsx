import { forwardRef } from 'react';

import { SplitLine, useEditor } from '@/store/editor';

interface EditorLineProps {
  line: SplitLine;
  horizontal?: boolean;
  vertical?: boolean;
  clickHandler: CallableFunction;
  index: number;
  selected?: boolean;
  color?: string;
}

const EditorLine = forwardRef<HTMLSpanElement, EditorLineProps>(
  ({ line, horizontal, vertical, clickHandler, index, selected, color }, ref) => {
    const { dispatch, state } = useEditor();

    const setLinePosition = (position: number) => {
      dispatch({
        type: 'SET_LINE_POSITION',
        payload: {
          index,
          align: horizontal ? 'horizontal' : 'vertical',
          position,
        },
      });
    };

    const dragBinders = {
      onMouseDown: (e: React.MouseEvent) => {
        clickHandler(e, {
          element: e.currentTarget,
          align: horizontal ? 'horizontal' : 'vertical',
          linePositionSetter: setLinePosition,
          linePosition: line.position,
        });
        const multi = e.shiftKey;
        if (multi) {
          dispatch({
            type: 'TOGGLE_SELECTED_LINE',
            payload: { align: horizontal ? 'horizontal' : 'vertical', index, multi },
          });
        } else {
          dispatch({
            type: 'SET_SELECTED_LINE',
            payload: { align: horizontal ? 'horizontal' : 'vertical', index },
          });
        }
        dispatch({ type: 'PUSH_HISTORY' });
      },
    };

    const zIndex = 10;
    const isSelected = !!selected;
    const baseHex = (horizontal ? state.guideColorH : state.guideColorV) || color || state.guideColor;
    const alpha = horizontal ? state.guideAlphaH : state.guideAlphaV;
    const thickness = horizontal ? state.guideThicknessH : state.guideThicknessV;
    const toRgba = (hex: string, a: number) => {
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
    };
    const guideColor = isSelected ? toRgba(state.selectedGuideColor, state.selectedGuideAlpha) : toRgba(baseHex, alpha);
    const lineClassBase =
      'absolute rounded border transition-shadow';
    const lineClassHover = 'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.6)]';
    const selectedRing = isSelected
      ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.9)]'
      : '';
    const dotStyle = 'absolute w-2 h-2 rounded-full hidden';

    if (horizontal) {
      return (
        <div className='line-collection horizontal-collection'>
          <span
            className={dotStyle}
            style={{
              top: `${line.position}%`,
              left: '1px',
              zIndex: zIndex,
              backgroundColor: guideColor,
              borderColor: guideColor,
            }}
          ></span>
          <span
            className={dotStyle}
            style={{
              top: `${line.position}%`,
              left: `calc(${line.size}% - 7px)`,
              zIndex: zIndex,
              backgroundColor: guideColor,
              borderColor: guideColor,
            }}
          ></span>
          <span
            className={`cursor-ns-resize ${lineClassBase} ${lineClassHover} ${selectedRing}`}
            style={{
              top: `calc(${line.position}% + 0px)`,
              width: `${line.size}%`,
              zIndex: zIndex - 1,
              backgroundColor: guideColor,
              borderColor: guideColor,
              height: `${thickness}px`,
            }}
            ref={ref}
            {...dragBinders}
          ></span>
        </div>
      );
    } else if (vertical) {
      return (
        <div className='line-collection vertical-collection'>
          <span
            className={dotStyle}
            style={{
              left: `${line.position}%`,
              top: '1px',
              zIndex: zIndex,
              backgroundColor: guideColor,
              borderColor: guideColor,
            }}
          ></span>
          <span
            className={dotStyle}
            style={{
              left: `${line.position}%`,
              top: `calc(${line.size}% - 7px)`,
              zIndex: zIndex,
              backgroundColor: guideColor,
              borderColor: guideColor,
            }}
          ></span>
          <span
            className={`cursor-ew-resize ${lineClassBase} ${lineClassHover} ${selectedRing}`}
            style={{
              left: `calc(${line.position}% + 0px)`,
              height: `${line.size}%`,
              zIndex: zIndex - 1,
              backgroundColor: guideColor,
              borderColor: guideColor,
              width: `${thickness}px`,
            }}
            ref={ref}
            {...dragBinders}
          ></span>
        </div>
      );
    }
    return <></>;
  }
);

export default EditorLine;
