import React, {
  useState,
  useRef,
  useCallback,
} from 'react';
import { isH5 } from '../utils/env';

const DEFAULT_DURATION = 300;

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) {
    return;
  }

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onLongPress?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  delay?: number;
  shouldPreventDefault?: boolean;
  shouldStopPropagation?: boolean;
}

interface UseLongPressType<T> {
  isLongPressing: boolean;
  onTouchMove: (e: React.TouchEvent<T>) => void;
  onMouseDown: (e: React.MouseEvent<T>) => void;
  onTouchStart: (e: React.TouchEvent<T>) => void;
  onMouseUp: (e: React.MouseEvent<T>) => void;
  onMouseLeave: (e: React.MouseEvent<T>) => void;
  onTouchEnd: (e: React.TouchEvent<T>) => void;
}

export default function useLongPress<T>({
  onLongPress,
  onClick,
}: PressHandlers<T>, {
  delay = DEFAULT_DURATION,
  shouldPreventDefault = true,
  shouldStopPropagation = false,
}: Options = {}): UseLongPressType<T> {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [dragTriggered, setDragTriggered] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();

  const start = useCallback((e: React.MouseEvent<T> | React.TouchEvent<T>) => {
    e.persist();
    const clonedEvent = {
      ...e,
    };
    setDragTriggered(false);
    if (shouldStopPropagation) {
      e.stopPropagation();
    }
    if (shouldPreventDefault && e.target) {
      e.target.addEventListener(
        'touchend',
        preventDefault,
        {
          passive: false,
        },
      );
      target.current = e.target;
    }

    timeout.current = setTimeout(() => {
      onLongPress?.(clonedEvent);
      setLongPressTriggered(true);
    }, delay);
  }, [onLongPress, delay, shouldPreventDefault, shouldStopPropagation, isH5]);

  const clear = useCallback((
    e: React.MouseEvent<T> | React.TouchEvent<T>,
    shouldTriggerClick = true,
    onDrag = false,
  ) => {
    if (onDrag) {
      setDragTriggered(true);
    } else {
      setDragTriggered(false);
    }
    if (timeout?.current) {
      clearTimeout(timeout.current);
    }
    if (shouldTriggerClick && !longPressTriggered && !dragTriggered) {
      onClick?.(e);
    }
    setLongPressTriggered(false);
    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault);
    }
  }, [shouldPreventDefault, onClick, longPressTriggered, dragTriggered]);

  return {
    isLongPressing: longPressTriggered,
    onMouseDown: (e: React.MouseEvent<T>) => start(e),
    onMouseUp: (e: React.MouseEvent<T>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<T>) => clear(e, false),
    onTouchStart: (e: React.TouchEvent<T>) => start(e),
    // setDragTriggered as true on touchmove, so that next onTouchEnd is ignored
    // if we dont do it, onClick?.(e) will be triggred, see inside clear()
    onTouchMove: (e: React.TouchEvent<T>) => clear(e, false, true),
    onTouchEnd: (e: React.TouchEvent<T>) => clear(e),
  };
}
