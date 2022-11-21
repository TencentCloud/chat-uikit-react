import React from 'react';

import './styles/index.scss';

interface PopupProps {
  className?: string,
  onClick?: (e?) => void,
}

export function Model<
T extends PopupProps
>(props:React.PropsWithChildren<T>):React.ReactElement {
  const {
    className,
    onClick,
    children,
  } = props;

  return (
    <div role="button" tabIndex={0} className={`model ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
