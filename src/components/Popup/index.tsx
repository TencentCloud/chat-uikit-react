import React, { useLayoutEffect, useRef, useState } from 'react';

import './styles/index.scss';

interface PopupProps {
  className?: string,
  style?: any,
  show?: boolean,
  close: (e: any) => void,
  root?: any,
  handleVisible?: (isVisible:any) => void,
}

export function Popup<
T extends PopupProps
>(props:React.PropsWithChildren<T>):React.ReactElement {
  const {
    show,
    close,
    children,
    className,
    style,
    root,
    handleVisible,
  } = props;

  const popup = useRef<HTMLInputElement>();

  const [isSetPos, setIsSetPos] = useState(false);

  useLayoutEffect(() => {
    if (show) {
      window.addEventListener('mouseup', close, false);
      popup?.current?.addEventListener('mouseup', stopImmediatePropagation);
    } else {
      window.removeEventListener('mouseup', close, false);
      popup?.current?.removeEventListener('mouseup', stopImmediatePropagation);
    }
    return () => {
      window.removeEventListener('mouseup', close, false);
      popup?.current?.removeEventListener('mouseup', stopImmediatePropagation);
    };
  }, [show]);

  useLayoutEffect(() => {
    const io = new IntersectionObserver(([change]) => {
      const {
        boundingClientRect: changeBoundingClientRec,
        rootBounds: changeRootBounds,
        intersectionRatio,
      } = change;
      const popupBoundingClientRect = popup.current?.getBoundingClientRect() || {};
      const rootRootBounds = root?.getBoundingClientRect() || {};
      const boundingClientRect = {
        ...changeBoundingClientRec,
        ...popupBoundingClientRect,
      };
      const rootBounds = {
        ...changeRootBounds,
        ...rootRootBounds,
      };
      if (handleVisible && intersectionRatio < 1) {
        handleVisible({
          left: (boundingClientRect.left - boundingClientRect.width) < rootBounds.left,
          top: (boundingClientRect.bottom + boundingClientRect.height) < rootBounds.bottom,
          width: boundingClientRect.width,
          height: boundingClientRect.height,
        });
      }
      setIsSetPos(true);
    }, {
      root,
      threshold: [1],
    });

    if (popup?.current && show) {
      io.observe(popup?.current);
    }
    return () => {
      io.disconnect();
      setIsSetPos(false);
    };
  }, [popup, show]);

  const stopImmediatePropagation = (e: Event) => {
    e.stopPropagation();
  };

  return (
    <>{show && (
      // eslint-disable-next-line 
      // @ts-ignore
      <div role="button" tabIndex={0} style={style} className={`popup ${className} ${isSetPos && 'popup-show'}`} ref={popup}>
        {children}
      </div>)}
    </>
  )
}
