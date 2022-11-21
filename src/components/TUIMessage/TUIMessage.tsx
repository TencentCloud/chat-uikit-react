import React, { PropsWithChildren, ReactEventHandler } from 'react';
import { Message } from 'tim-js-sdk';

import { UnknowPorps, useComponentContext } from '../../context';

import { TUIMessageContextProvider } from '../../context/TUIMessageContext';
import { useMessageHandler } from './hooks';

import './styles/index.scss';
import { TUIMessageDefault } from './TUIMessageDefault';
import { MessagePlugins as MessagePluginsDefault } from './MessagePlugins';
import { MessageContext as MessageContextDefault } from './MessageContext';

export interface TUIMessageProps {
  message: Message,
  className?: string,
  TUIMessage?: React.ComponentType,
  MessageContext?: React.ComponentType<UnknowPorps>,
  MessagePlugins?: React.ComponentType<UnknowPorps>,
  handleDelete?: ReactEventHandler,
  CustemElement?: React.ComponentType<{message: Message}>,
  TextElement?: React.ComponentType<{message: Message}>,
  ImageElement?: React.ComponentType<{message: Message}>,
  VideoElement?: React.ComponentType<{message: Message}>,
  AudioElement?: React.ComponentType<{message: Message}>,
  FileElement?: React.ComponentType<{message: Message}>,
  MergerElement?: React.ComponentType<{message: Message}>,
  LocationElement?: React.ComponentType<{message: Message}>,
  FaceElement?: React.ComponentType<{message: Message}>,
}
function TUIMessageWithContext <T extends TUIMessageProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    TUIMessage: propTUIMessage,
    MessagePlugins: propMessagePlugins,
    MessageContext: propMessageContext,
    handleDelete,
    CustemElement,
    TextElement,
    ImageElement,
    VideoElement,
    AudioElement,
    FileElement,
    MergerElement,
    LocationElement,
    FaceElement,
  } = props;

  const {
    MessagePlugins: ContextMessagePlugins,
    MessageContext: ContextMessageContext,
  } = useComponentContext('TUIMessage');

  const TUIMessageUIComponent = propTUIMessage || TUIMessageDefault;
  const MessagePlugins = propMessagePlugins || ContextMessagePlugins || MessagePluginsDefault;
  const MessageContext = propMessageContext || ContextMessageContext || MessageContextDefault;

  const messageContextValue = {
    message,
    handleDelete,
    CustemElement,
    TextElement,
    ImageElement,
    VideoElement,
    AudioElement,
    FileElement,
    MergerElement,
    LocationElement,
    FaceElement,
  };
  return (
    <TUIMessageContextProvider value={messageContextValue}>
      <TUIMessageUIComponent
        message={message}
        MessageContext={MessageContext}
        MessagePlugins={MessagePlugins}
      />
    </TUIMessageContextProvider>
  );
}

const MemoizedTUIMessage = React.memo(TUIMessageWithContext) as
typeof TUIMessageWithContext;

export function TUIMessage(props:TUIMessageProps):React.ReactElement {
  const {
    message,
  } = props;
  const { handleDelMessage } = useMessageHandler({ message });
  return (
    <MemoizedTUIMessage
      handleDelete={handleDelMessage}
      {...props}
    />
  );
}
