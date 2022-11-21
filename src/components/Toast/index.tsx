import React from 'react';

import './styles/index.scss';

interface ToastProps {
  type?: 'info' | 'warn' | 'error',
  text?: string,
  time?: number,
  className?: string,
}

export function Toast<
T extends ToastProps
>(props:React.PropsWithChildren<T>) {
  const {
    type = 'info',
    text,
    time: propsTime,
    className,
  } = props;

  const time = propsTime || 3;

  const root = document.body;

  const elements = document.createElement('div');

  elements.innerText = text;

  elements.className = `toast ${className} ${type}`;

  root.appendChild(elements);

  const toastList = document.getElementsByClassName('toast');

  elements.style.left = `calc(50% - ${elements.clientWidth / 2}px)`;
  elements.style.zIndex = `${10 + toastList.length - 1}`;
  elements.style.top = `${elements.clientHeight * (toastList.length - 1)}px`;

  const Timer = setTimeout(() => {
    root.removeChild(elements);
    clearTimeout(Timer);
  }, time * 1000);
}
