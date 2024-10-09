import React, {
  forwardRef,
  PropsWithChildren, useImperativeHandle, useLayoutEffect, useRef, useState,
} from 'react';
import { Icon, IconTypes } from '../Icon';
import { Popup } from '../Popup';
import { usePluginsElement } from './hooks';

import './styles/index.scss';

export interface PluginsProps {
  plugins?: any[];
  showNumber?: number;
  MoreIcon?: any;
  className?: string;
  customClass?: string;
  style?: any;
  root?: any;
  handleVisible?: (isVisible: any) => void;
  showMore?: boolean;
}

export interface IPluginsRef {
  closeMore?: () => void;
}

function PluginsWithContext<T extends PluginsProps>(
  props: PropsWithChildren<T>,
  // eslint-disable-next-line
 // @ts-ignore
  ref,
): React.ReactElement {
  const {
    plugins = [],
    showNumber,
    MoreIcon,
    className = '',
    style,
    customClass = '',
    root,
    handleVisible,
  } = props;

  useImperativeHandle(ref, () => ({
    closeMore: (newVal: boolean) => {
      setShow(false);
    },
  }));

  const { showPicker, elements } = usePluginsElement({ plugins, showNumber });
  const pluginRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(false);

  const handleShow = (e: any) => {
    e.stopPropagation();
    setShow(!show);
    if (!show) {
      pluginRef?.current?.offsetParent?.removeEventListener('scroll', handleShow);
    }
  };

  const pluginHandleVisible = (data: any) => {
    if (handleVisible) {
      const {
        width, height,
      } = pluginRef?.current?.children[1].getBoundingClientRect() || {};
      const { x = 0, y = 0 } = pluginRef?.current?.getBoundingClientRect() || {};
      pluginRef.current?.offsetParent?.addEventListener('scroll', handleShow);
      handleVisible({
        ...data,
        width,
        height,
        x,
        y,
      });
    }
  };
  // eslint-disable-next-line
// @ts-ignore
  return (
    ((showPicker && showPicker.length > 0) || (elements && elements?.length > 0)) && (
      <ul className={`plugin ${className}`}>
        {showPicker && showPicker?.length > 0 && showPicker.map((Item, index: number) => {
          const key = `${Item}${index}`;
          return (
            <li className="plugin-item" key={key}>
              {Item}
            </li>
          );
        })}
        {
          elements && elements?.length > 0 && (
            <div className="plugin-popup" ref={pluginRef}>
              <div role="menuitem" tabIndex={0} className="more" onClick={handleShow}>
                {
                  !MoreIcon && <Icon width={20} height={20} type={IconTypes.ADD} />
                }
                {
                  MoreIcon && MoreIcon
                }
              </div>
              <Popup
                className={`plugin-popup-box ${customClass}`}
                style={style}
                show={show}
                close={handleShow}
                root={root}
                handleVisible={pluginHandleVisible}
              >
                <ul>
                  {elements.map((Item, index: number) => {
                    const key = `${Item}${index}`;
                    return (
                      <li className="plugin-item" key={key}>
                        {Item}
                      </li>
                    );
                  })}
                </ul>
              </Popup>
            </div>
          )
        }
      </ul>
    )
  );
}
const Plugins = forwardRef(PluginsWithContext);
export {
  Plugins,
};
