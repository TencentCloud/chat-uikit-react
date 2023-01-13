import React, {
  PropsWithChildren,
} from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { MESSAGE_FLOW } from '../../constants';
import { messageShowType } from '../../context';
import { Avatar } from '../Avatar';
import { handleDisplayAvatar } from '../untils';

export interface MessageAvatarProps {
  CustomAvatar?: React.ReactElement,
  className?: string,
  message?: Message,
  showType?: messageShowType,
}

export function MessageAvatar <T extends MessageAvatarProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    CustomAvatar,
    message,
    showType,
  } = props;

  const show = showType === messageShowType.ALL || message?.flow === showType;

  if (!show || showType === messageShowType.NONE) {
    return null;
  }

  if (CustomAvatar) {
    return CustomAvatar;
  }

  return (<Avatar size={32} image={handleDisplayAvatar(message?.avatar)} />);
}
