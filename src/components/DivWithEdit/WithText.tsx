import React, {
  PropsWithChildren, useLayoutEffect, useRef, useState,
} from 'react';
import { Icon, IconTypes } from '../Icon';

export interface WithEditProps {
  value?: string,
  onChange?: (value:string) => void,
  confirm?: (data?:any) => void,
  className?: string,
  close?: () => void,
}

export function WithText<T extends WithEditProps>(props:PropsWithChildren<T>) {
  const {
    value: propsVal,
    confirm,
    className,
  } = props;
  const inputRef = useRef<HTMLInputElement>();

  const [value, setValue] = useState(propsVal);

  useLayoutEffect(() => {
    inputRef?.current?.focus();
    setValue(value);
  }, [inputRef, propsVal]);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleConfirm = () => {
    confirm(value);
  };
  return (
    <div className={`edit ${className}`}>
      <input ref={inputRef} type="text" value={value} onChange={handleChange} />
      <Icon className="icon" width={15} height={10.5} type={IconTypes.CONFIRM} onClick={handleConfirm} />
    </div>
  );
}
