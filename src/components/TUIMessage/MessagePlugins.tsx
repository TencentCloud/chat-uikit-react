import React, { PropsWithChildren, useRef, useState } from 'react';
import TIM from 'tim-js-sdk';
import './styles/index.scss';

import { Plugins, PluginsProps } from '../Plugins';
import { Icon, IconTypes } from '../Icon';
import { useTUIChatStateContext, useTUIMessageContext } from '../../context';
import { useMessagePluginElement, useMessageHandler } from './hooks';
import { MESSAGE_FLOW, MESSAGE_STATUS } from '../../constants';

export function MessagePlugins <T extends PluginsProps>(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    plugins: propsPlugins,
    showNumber = 0,
    MoreIcon: propsMoreIcon,
  } = props;

  const [className, setClassName] = useState('');
  const pluginsRef = useRef(null);

  const { message } = useTUIMessageContext('MessagePlugins');
  const { messageListRef } = useTUIChatStateContext('MessageBubbleWithContext');
  const {
    handleDelMessage,
    handleRevokeMessage,
    handleReplyMessage,
    handleCopyMessage,
    handleResendMessage,
    handleForWardMessage,
  } = useMessageHandler({ message });

  const handleVisible = (data) => {
    setClassName(`${!data.top && 'message-plugin-top'} ${!data.left && 'message-plugin-left'}`);
  };

  const RevokeElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>Recall</span>
        <Icon width={20} height={20} type={IconTypes.REVOCATION} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleRevokeMessage(e);
    },
    message,
  });

  const DeleteElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span className="del">Delete</span>
        <Icon width={20} height={20} type={IconTypes.DEL} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleDelMessage(e);
    },
    message,
  });

  const ReplyElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>Quote</span>
        <Icon width={20} height={20} type={IconTypes.QUOTE} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleReplyMessage(e);
    },
    message,
  });

  const CopyElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>Copy</span>
        <Icon width={20} height={20} type={IconTypes.COPY} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleCopyMessage(e);
    },
    message,
  });

  const ResendElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>Resend</span>
        <Icon width={20} height={20} type={IconTypes.REPLY} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleResendMessage(e);
    },
    message,
  });

  const ForWardElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>Forward</span>
        <Icon width={20} height={20} type={IconTypes.FORWARD} />
      </div>
    ),
    handle: (e) => {
      pluginsRef.current.closeMore();
      handleForWardMessage(e);
    },
    message,
  });

  let defaultPlugins = message?.status === MESSAGE_STATUS.SUCCESS
    ? [ReplyElement, ForWardElement, DeleteElement] : [ResendElement];

  if (message?.status === MESSAGE_STATUS.SUCCESS && message.flow === MESSAGE_FLOW.OUT) {
    defaultPlugins = [RevokeElement, ...defaultPlugins];
  }

  if (message.type === TIM.TYPES.MSG_TEXT) {
    defaultPlugins.splice(-1, 0, CopyElement);
  }

  const plugins = propsPlugins || defaultPlugins;

  const MoreIcon = propsMoreIcon || <Icon className="icon-more" width={16} height={16} type={IconTypes.MORE} />;

  return message?.status !== MESSAGE_STATUS.UNSEND && (
  <Plugins
    className="message-plugin"
    customClass={className}
    ref={pluginsRef}
    plugins={plugins}
    showNumber={showNumber}
    MoreIcon={MoreIcon}
    root={messageListRef?.current}
    handleVisible={handleVisible}
  />
  );
}
