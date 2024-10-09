import React, { PropsWithChildren, useContext } from 'react';
import { TUIChatHeaderDefaultProps } from '../components';
import type { EmptyStateIndicatorProps } from '../components/EmptyStateIndicator';
import { MessageContextProps, TUIMessageProps } from '../components/MessageElement';

export interface UnknowPorps {
  [propsName: string]: any;
}

export interface ComponentContextValue {
  TUIMessage?: React.ComponentType<TUIMessageProps | UnknowPorps>;
  TUIChatHeader?: React.ComponentType<TUIChatHeaderDefaultProps>;
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  TUIMessageInput?: React.ComponentType<UnknowPorps>;
  MessageContext?: React.ComponentType<MessageContextProps>;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
  MessageCustomPlugins?: React.ComponentType<UnknowPorps>;
  MessageTextPlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
}

export const ComponentContext = React.createContext<ComponentContextValue | undefined>(undefined);

export function ComponentProvider({
  children,
  value,
}: PropsWithChildren<{
  value: ComponentContextValue;
}>) {
  return (
    <ComponentContext.Provider value={(value as unknown) as ComponentContextValue}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext(
  componentName?: string,
) {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    return {} as ComponentContextValue;
  }

  return contextValue as ComponentContextValue;
}
