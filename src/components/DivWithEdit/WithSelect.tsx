import React, { PropsWithChildren } from 'react';
import { Icon, IconTypes } from '../Icon';

import './styles/index.scss';
import { WithEditProps } from './WithText';

interface WithSelectProps extends WithEditProps {
  list?: Array<any>,
}

export function WithSelect<T extends WithSelectProps>(props:PropsWithChildren<T>) {
  const {
    value,
    confirm,
    children,
    className,
    close,
  } = props;

  return (
    <div className={`edit ${className}`}>
      <span>{value}</span>
      <Icon className="icon" width={12} height={7} type={IconTypes.ARROW_DOWN} onClick={confirm} />
      <div className="select">
        {children}
      </div>
    </div>
  );
}
