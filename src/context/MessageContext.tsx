import React, { PropsWithChildren, ReactEventHandler, useContext } from 'react';
import { Message } from '@tencentcloud/chat';
import { MessagePluginsProps } from '../components';

export enum messageShowType {
  IN = 'in',
  OUT = 'out',
  ALL = 'all',
  NONE = 'none',
}

export interface TUIMessageContextValue {
  message?: Message;
  handleDelete?: ReactEventHandler;
  CustemElement?: React.ComponentType<{ message: Message }>;
  TextElement?: React.ComponentType<{ message: Message }>;
  ImageElement?: React.ComponentType<{ message: Message }>;
  VideoElement?: React.ComponentType<{ message: Message }>;
  AudioElement?: React.ComponentType<{ message: Message }>;
  FileElement?: React.ComponentType<{ message: Message }>;
  MergerElement?: React.ComponentType<{ message: Message }>;
  LocationElement?: React.ComponentType<{ message: Message }>;
  FaceElement?: React.ComponentType<{ message: Message }>;
  filter?: (data: Message) => void;
  isShowTime?: boolean;
  isShowRead?: boolean;
  plugin?: MessagePluginsProps;
  prefix?: React.ReactElement | string;
  suffix?: React.ReactElement | string;
  customName?: React.ReactElement;
  showAvatar?: messageShowType;
  showName?: messageShowType;
  customAvatar?: React.ReactElement;
  isShowProgress?: boolean;
  Progress?: React.ComponentType<{ message: Message }>;
}

export const TUIMessageContext = React.createContext<TUIMessageContextValue>({});
export function TUIMessageContextProvider({ children, value }: PropsWithChildren<{
  value: TUIMessageContextValue;
}>): React.ReactElement {
  return (
    <TUIMessageContext.Provider value={value}>
      {children}
    </TUIMessageContext.Provider>
  );
}

export function useTUIMessageContext(componentName?: string): TUIMessageContextValue {
  const contextValue = useContext(TUIMessageContext);
  if (!contextValue && componentName) {
    return {} as TUIMessageContextValue;
  }
  return (contextValue as unknown) as TUIMessageContextValue;
}
