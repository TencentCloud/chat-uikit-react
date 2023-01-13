import React, {
  PropsWithChildren,
} from 'react';
import TIM, { Message } from 'tim-js-sdk';
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
  && message?.conversationType === TIM.TYPES.CONV_GROUP;

  if (!show || showType === messageShowType.NONE) {
    return null;
  }

  if (CustomName) {
    return CustomName;
  }

  return (
    <label htmlFor="content" className="name">
      {message?.nick || message?.from}
    </label>
  );
}
