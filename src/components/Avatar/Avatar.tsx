import React, { useState, useEffect, useRef } from 'react';
import { Icon, IconTypes } from '../Icon';
import './styles/index.scss';

export interface AvatarProps {
  image?: string | null,
  /** click event handler */
  onClick?: (event: React.BaseSyntheticEvent) => void,
  /** mouseOver event handler */
  onMouseOver?: (event: React.BaseSyntheticEvent) => void,
  /** Size in pixels
   * @default 32px
   */
  size?: number,
  /** Shape of the avatar - circle, rounded or square
   * @default circle
   */
  shape?: 'circle' | 'rounded' | 'square';
  update?: (url:string) => void,
  list?: Array<string>,
}
export function Avatar<T extends AvatarProps>(props:T):React.ReactElement {
  const {
    image,
    size = 32,
    shape = 'circle',
    update,
    onClick,
    list = [],
  } = props;

  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [avatarListWidth, setAvatarListWidth] = useState(200);

  const avatarRef = useRef<HTMLDivElement>();
  const avatarListRef = useRef<HTMLUListElement>();

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [image]);

  useEffect(() => {
    if (isEdit && update) {
      window.addEventListener('mouseup', toggle, false);
      avatarRef?.current?.addEventListener('mouseup', stopImmediatePropagation);
      setAvatarListWidth(avatarListRef?.current?.clientWidth);
    } else {
      window.removeEventListener('mouseup', toggle, false);
      avatarRef?.current?.removeEventListener('mouseup', stopImmediatePropagation);
    }
    return () => {
      window.removeEventListener('mouseup', toggle, false);
      avatarRef?.current?.removeEventListener('mouseup', stopImmediatePropagation);
    };
  }, [isEdit]);

  const stopImmediatePropagation = (e) => {
    e.stopPropagation();
  };

  const toggle = () => {
    setIsEdit(!isEdit);
  };

  const handleUpdate = (value:string) => {
    toggle();
    update(value);
  };

  return (
    <div
      className={`tui-kit-avatar ${shape}`}
      style={{
        flexBasis: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        width: `${size}px`,
      }}
      ref={avatarRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      {image && !error ? (
        <img
          className={`avatar-image ${loaded ? 'avatar-image-loaded' : ''}`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          alt={image}
          src={image}
        />
      ) : (
        <div
          className={`tui-kit-avatar ${shape}`}
          style={{
            flexBasis: `${size}px`,
            height: `${size}px`,
            objectFit: 'cover',
            width: `${size}px`,
            backgroundColor: 'black',
            borderRadius: `${shape === 'circle' ? '50%' : '4px'}`,
          }}
        />
      )}
      {
        update && (
          <div className={`tui-kit-avatar-edit ${isEdit ? 'displayFlex' : ''}`} role="button" tabIndex={0} onClick={toggle}>
            <Icon className="icon-camera" width={33} height={30} type={IconTypes.CAMERA} />
          </div>
        )
      }
      {
        update && isEdit && (
          <ul
            className="tui-kit-avatar-list"
            ref={avatarListRef}
            style={{
              left: `-${(avatarListWidth - size) / 2}px`,
            }}
          >
            {
              list.map((item:string, index:number) => {
                const key = `${item}${index}`;
                return (
                  <li
                    className="tui-kit-avatar-list-item"
                    role="menuitem"
                    key={key}
                    tabIndex={index}
                    onClick={() => { handleUpdate(item); }}
                  >
                    <img
                      className="avatar-image"
                      alt={item}
                      src={item}
                    />
                  </li>
                );
              })
            }

          </ul>
        )
      }

    </div>
  );
}
