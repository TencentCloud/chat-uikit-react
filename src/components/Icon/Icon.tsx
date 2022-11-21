import React from 'react';
import './styles/index.scss';
import { IconTypes } from './type';
import { ICON_CONFIG } from './config';

const changeTypeToIconComponent = (type:IconTypes) => {
  const src = ICON_CONFIG[type].url || '';
  return <img className={`icon-image icon-image-${type}`} src={src} alt={type} />;
};
export const changeTypeToIconClassName = (type:IconTypes) => ICON_CONFIG[type]?.className || '';

export interface IconProps {
  type?: IconTypes,
  height?: number,
  width?: number,
  onClick?: (event: React.BaseSyntheticEvent) => void,
  className?: string
}
export function Icon(props: React.PropsWithChildren<IconProps>) {
  const {
    children, type, height = 24, width = 24, onClick, className = '',
  } = props;
  const iconStyle = {
    width: typeof width === 'string' ? width : `${width}px`,
    minWidth: typeof width === 'string' ? width : `${width}px`,
    height: typeof height === 'string' ? height : `${height}px`,
    minHeight: typeof height === 'string' ? height : `${height}px`,
  };
  return (
    <div
      className={`tui-kit-icon ${changeTypeToIconClassName(type)} ${className}`}
      role="button"
      tabIndex={0}
      style={iconStyle}
      onClick={onClick}
    >
      {children || changeTypeToIconComponent(type)}
    </div>
  );
}
