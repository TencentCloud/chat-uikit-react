import React, {
  PropsWithChildren,
} from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { MESSAGE_FLOW } from '../../constants';
import { messageShowType } from '../../context';

export interface MessageNameProps {
  CustomName?: React.ReactElement,
  className?: string,
  message?: Message,
  showType?: messageShowType,
}

export function MessageName <T extends MessageNameProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    CustomName,
    message,
    showType,
  } = props;

  const show = (showType === messageShowType.ALL || message?.flow === showType)
  && message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP;

  if (!show || showType === messageShowType.NONE) {
    return <></>;
  }

  if (CustomName) {
    return CustomName;
  }

  return (
    <label htmlFor="content" className="text-ellipsis name">
      {message?.nick || message?.from}
    </label>
  );
}
