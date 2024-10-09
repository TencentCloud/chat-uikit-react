import React, { PropsWithChildren, ReactEventHandler } from 'react';
import { Message } from '@tencentcloud/chat';

import { UnknowPorps, useComponentContext, useTUIChatStateContext } from '../../context';

import { messageShowType, TUIMessageContextProvider } from '../../context/MessageContext';
import { useMessageHandler } from './hooks';

import './styles/index.scss';
import { TUIMessageDefault } from './MessageDefault';
import { MessagePlugins as MessagePluginsDefault, MessagePluginsProps } from './MessagePlugins';
import { MessageContext as MessageContextDefault } from './MessageContext';

interface TUIMessageBasicProps {
  className?: string;
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

export interface TUIMessageProps extends TUIMessageBasicProps {
  message?: Message;
  className?: string;
  TUIMessage?: React.ComponentType;
  MessageContext?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
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
}
function TUIMessageWithContext<T extends TUIMessageProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    message: propsMessage,
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
    className,
    filter: propsFilter,
    isShowTime,
    isShowRead,
    plugin,
    prefix,
    suffix,
    customName,
    showAvatar,
    showName,
    customAvatar,
    isShowProgress,
    Progress,
  } = props;

  const {
    MessagePlugins: ContextMessagePlugins,
    MessageContext: ContextMessageContext,
  } = useComponentContext('TUIMessage');

  const {
    messageConfig,
  } = useTUIChatStateContext('TUIMessage');

  const TUIMessageUIComponent = propTUIMessage || TUIMessageDefault;
  const MessagePlugins = propMessagePlugins || ContextMessagePlugins || MessagePluginsDefault;
  const MessageContext = propMessageContext || ContextMessageContext || MessageContextDefault;

  const filter = propsFilter || messageConfig?.filter;
  const message = propsMessage || messageConfig?.message;
  if (filter && message) {
    filter(message);
  }

  const messageContextValue = {
    message,
    handleDelete: handleDelete || messageConfig?.handleDelete,
    CustemElement: CustemElement || messageConfig?.CustemElement,
    TextElement: TextElement || messageConfig?.TextElement,
    ImageElement: ImageElement || messageConfig?.ImageElement,
    VideoElement: VideoElement || messageConfig?.VideoElement,
    AudioElement: AudioElement || messageConfig?.AudioElement,
    FileElement: FileElement || messageConfig?.FileElement,
    MergerElement: MergerElement || messageConfig?.MergerElement,
    LocationElement: LocationElement || messageConfig?.LocationElement,
    FaceElement: FaceElement || messageConfig?.FaceElement,
    isShowTime: isShowTime || messageConfig?.isShowTime,
    isShowRead: isShowRead || messageConfig?.isShowRead,
    plugin: plugin || messageConfig?.plugin,
    prefix: prefix || messageConfig?.prefix,
    suffix: suffix || messageConfig?.suffix,
    customName: customName || messageConfig?.customName,
    showAvatar: showAvatar || messageConfig?.showAvatar,
    showName: showName || messageConfig?.showName,
    customAvatar: customAvatar || messageConfig?.customAvatar,
    isShowProgress: isShowProgress || messageConfig?.isShowProgress,
    Progress: Progress || messageConfig?.Progress,
  };

  return (
    <TUIMessageContextProvider value={messageContextValue}>
      <TUIMessageUIComponent
        message={message}
        MessageContext={MessageContext}
        MessagePlugins={MessagePlugins}
        className={className || messageConfig?.className}
      />
    </TUIMessageContextProvider>
  );
}

const MemoizedTUIMessage = React.memo(TUIMessageWithContext) as
typeof TUIMessageWithContext;

export function TUIMessage(props: TUIMessageProps): React.ReactElement {
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
