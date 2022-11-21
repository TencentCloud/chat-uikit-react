import React, {
  PropsWithChildren, useLayoutEffect, useRef, useState,
} from 'react';
import { Icon, IconTypes } from '../Icon';
import { Popup } from '../Popup';

import './styles/index.scss';
import { WithSelect } from './WithSelect';
import { WithText } from './WithText';

const elements = {
  text: WithText,
  select: WithSelect,
};

interface DivWithEditProps {
  name?: string,
  value?: string,
  confirm?: (data?:any) => void,
  className?: string,
  classEditName?: string,
  type?: string,
  isEdit?: boolean,
  toggle?: (name:string) => void,
  close?: () => void,
}

export function DivWithEdit<T extends DivWithEditProps>(props:PropsWithChildren<T>) {
  const {
    value: propsValue,
    className,
    classEditName,
    confirm,
    type,
    isEdit,
    toggle,
    children,
    name,
    close,
  } = props;

  const [value, setValue] = useState(propsValue);

  const WithEditElements = elements[type] || WithText;

  useLayoutEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const handleConfirm = (data) => {
    confirm({
      name,
      value: data,
    });
  };

  return (
    <div className={`div-with-edit ${className}`}>
      <Popup
        className="div-with-edit-popup"
        show
        close={close}
      >
        {
        !isEdit && (
        <div className="show">
          <p>{value || '-'}</p>
          <div className="icon">
            <Icon className="icon-edit" width={12} height={12} type={IconTypes.EDIT} onClick={() => { toggle(name); }} />
          </div>
        </div>
        )
      }
        {
        isEdit
        && (
        <WithEditElements
          value={value}
          confirm={handleConfirm}
          className={classEditName}
          close={close}
        >
          {children}
        </WithEditElements>
        )
      }
      </Popup>
    </div>
  );
}
