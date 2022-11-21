import React, { PropsWithChildren } from 'react';
import TIM, { Message } from 'tim-js-sdk';

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

const components = {
  [TIM.TYPES.MSG_TEXT]: MessageText,
  [TIM.TYPES.MSG_FACE]: MessageFace,
  [TIM.TYPES.MSG_IMAGE]: MessageImage,
  [TIM.TYPES.MSG_AUDIO]: MessageAudio,
  [TIM.TYPES.MSG_VIDEO]: MessageVideo,
  [TIM.TYPES.MSG_FILE]: MessageFile,
  [TIM.TYPES.MSG_CUSTOM]: MessageCustom,
  [TIM.TYPES.MSG_MERGER]: MessageMerger,
  [TIM.TYPES.MSG_LOCATION]: MessageLocation,
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

  const CustemComponents = {
    [TIM.TYPES.MSG_TEXT]: TextElement,
    [TIM.TYPES.MSG_FACE]: FaceElement,
    [TIM.TYPES.MSG_IMAGE]: ImageElement,
    [TIM.TYPES.MSG_AUDIO]: AudioElement,
    [TIM.TYPES.MSG_VIDEO]: VideoElement,
    [TIM.TYPES.MSG_FILE]: FileElement,
    [TIM.TYPES.MSG_CUSTOM]: CustemElement,
    [TIM.TYPES.MSG_MERGER]: MergerElement,
    [TIM.TYPES.MSG_LOCATION]: LocationElement,
  };

  const Elements = CustemComponents[message?.type] || components[message?.type];

  return Elements
  && <Elements context={context} message={message}><MessageStatus message={message} /></Elements>;
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
