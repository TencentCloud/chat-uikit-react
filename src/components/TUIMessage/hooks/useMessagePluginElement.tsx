import React, { PropsWithChildren } from 'react';

interface MessagePluginElementProps {
  handle?: (event?:React.SyntheticEvent<Element, Event>) => void,
  children: React.ReactNode
}
export const useMessagePluginElement = <
T extends MessagePluginElementProps>(props:PropsWithChildren<T>) => {
  const {
    children,
    handle,
  } = props;

  return (
    <div className="message-plugin-box" role="button" tabIndex={0} onClick={handle}>{children}</div>
  );
};
