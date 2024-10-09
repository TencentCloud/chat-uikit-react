import React, { PropsWithChildren } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';

import { MessageAudio } from './MessageAudio';
import { MessageCustom } from './MessageCustom';
import { MessageFace } from './MessageFace';
import { MessageFile } from './MessageFile';
import { MessageImage } from './MessageImage';
import { MessageLocation } from './MessageLocation';
import { MessageMerger } from './MessageMerger';
import { MessageText } from './MessageText';
import { MessageVideo } from './MessageVideo';

import { useMessageContextHandler } from './hooks';
import { MessageStatus } from './MessageStatus';
import { useTUIMessageContext } from '../../context';

const components: any = {
  [TencentCloudChat.TYPES.MSG_TEXT]: MessageText,
  [TencentCloudChat.TYPES.MSG_FACE]: MessageFace,
  [TencentCloudChat.TYPES.MSG_IMAGE]: MessageImage,
  [TencentCloudChat.TYPES.MSG_AUDIO]: MessageAudio,
  [TencentCloudChat.TYPES.MSG_VIDEO]: MessageVideo,
  [TencentCloudChat.TYPES.MSG_FILE]: MessageFile,
  [TencentCloudChat.TYPES.MSG_CUSTOM]: MessageCustom,
  [TencentCloudChat.TYPES.MSG_MERGER]: MessageMerger,
  [TencentCloudChat.TYPES.MSG_LOCATION]: MessageLocation,
};

export interface MessageContextProps {
  message?: Message,
}

function MessageContextWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { context } = useMessageContextHandler({ message });
  const {
    CustemElement,
    TextElement,
    FaceElement,
    ImageElement,
    AudioElement,
    VideoElement,
    FileElement,
    MergerElement,
    LocationElement,
  } = useTUIMessageContext('MessageCustom');

  const CustemComponents: any = {
    [TencentCloudChat.TYPES.MSG_TEXT]: TextElement,
    [TencentCloudChat.TYPES.MSG_FACE]: FaceElement,
    [TencentCloudChat.TYPES.MSG_IMAGE]: ImageElement,
    [TencentCloudChat.TYPES.MSG_AUDIO]: AudioElement,
    [TencentCloudChat.TYPES.MSG_VIDEO]: VideoElement,
    [TencentCloudChat.TYPES.MSG_FILE]: FileElement,
    [TencentCloudChat.TYPES.MSG_CUSTOM]: CustemElement,
    [TencentCloudChat.TYPES.MSG_MERGER]: MergerElement,
    [TencentCloudChat.TYPES.MSG_LOCATION]: LocationElement,
  };

  const Elements = message?.type && (CustemComponents[message.type] || components[message.type]);
  return Elements
  && (
  <Elements context={context} message={message}>
    <MessageStatus message={message} />
  </Elements>
  );
}

const MemoizedMessageContext = React.memo(MessageContextWithContext) as
typeof MessageContextWithContext;

export function MessageContext(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageContext
      {...props}
    />
  );
}
