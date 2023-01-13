import React, { PropsWithChildren, useRef, useState } from 'react';
import TIM from 'tim-js-sdk';
import './styles/index.scss';

import { Plugins, PluginsProps } from '../Plugins';
import { Icon, IconTypes } from '../Icon';
import { useTUIChatStateContext, useTUIMessageContext } from '../../context';
import { useMessagePluginElement, useMessageHandler } from './hooks';
import { MESSAGE_FLOW, MESSAGE_STATUS } from '../../constants';

enum PluginsNameEnum {
  quote = 'quote',
  forward = 'forward',
  copy = 'copy',
  delete = 'delete',
  resend = 'resend',
  revoke = 'revoke',
}
export type MessagePluginConfigProps = {
  [propsName in PluginsNameEnum]?: {
    isShow?: boolean;
    relateMessageType?: TIM.TYPES[],
  };
};

export interface MessagePluginsProps extends PluginsProps {
  config?: MessagePluginConfigProps
}

export function MessagePlugins <T extends MessagePluginsProps>(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    plugins: propsPlugins,
    showNumber: propsShowNumber,
    MoreIcon: propsMoreIcon,
    config: propsPluginConfig,
  } = props;

  const [className, setClassName] = useState('');
  const pluginsRef = useRef(null);

  const { message, plugin: contextPlugin } = useTUIMessageContext('MessagePlugins');
  const { messageListRef } = useTUIChatStateContext('MessageBubbleWithContext');
  const {
    handleDelMessage,
    handleRevokeMessage,
    handleReplyMessage,
    handleCopyMessage,
    handleResendMessage,
    handleForWardMessage,
  } = useMessageHandler({ message });

  const pluginConfig = {
    quote: {
      isShow: true,
      ...propsPluginConfig?.quote,
      ...contextPlugin?.config?.quote,
    },
    forward: {
      isShow: true,
      ...propsPluginConfig?.forward,
      ...contextPlugin?.config?.forward,
    },
    copy: {
      isShow: true,
      relateMessageType: [TIM.TYPES.MSG_TEXT],
      ...propsPluginConfig?.copy,
      ...contextPlugin?.config?.copy,
    },
    delete: {
      isShow: true,
      ...propsPluginConfig?.delete,
      ...contextPlugin?.config?.delete,
    },
    revoke: {
      isShow: true,
      ...propsPluginConfig?.revoke,
      ...contextPlugin?.config?.revoke,
    },
    resend: {
      isShow: true,
      ...propsPluginConfig?.resend,
      ...contextPlugin?.config?.resend,
    },
  };

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
    isShow: pluginConfig.revoke.isShow
    && (message?.status === MESSAGE_STATUS.SUCCESS && message.flow === MESSAGE_FLOW.OUT),
    relateMessageType: pluginConfig.revoke.relateMessageType,
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
    isShow: pluginConfig.delete.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.delete.relateMessageType,
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
    isShow: pluginConfig.quote.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.quote.relateMessageType,
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
    isShow: pluginConfig.copy.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.copy.relateMessageType,
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
    isShow: pluginConfig.resend.isShow && message?.status !== MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.resend.relateMessageType,
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
    isShow: pluginConfig.forward.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.forward.relateMessageType,
  });

  const defaultPlugins = [
    RevokeElement,
    ReplyElement,
    ForWardElement,
    DeleteElement,
    ResendElement,
    CopyElement,
  ];

  const plugins = (propsPlugins || contextPlugin?.plugins || defaultPlugins).filter((item) => item);

  const MoreIcon = propsMoreIcon || contextPlugin?.MoreIcon || <Icon className="icon-more" width={16} height={16} type={IconTypes.MORE} />;

  const showNumber = propsShowNumber || contextPlugin?.showNumber || 0;

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
