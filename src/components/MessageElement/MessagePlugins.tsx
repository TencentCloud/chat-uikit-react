import React, { PropsWithChildren, useRef, useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import TencentCloudChat from '@tencentcloud/chat';
import './styles/index.scss';

import { Plugins, PluginsProps } from '../Plugins';
import { IPluginsRef } from '../Plugins';
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
    relateMessageType?: TencentCloudChat.TYPES[];
  };
};

export interface MessagePluginsProps extends PluginsProps {
  config?: MessagePluginConfigProps;
}

export function MessagePlugins<T extends MessagePluginsProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    plugins: propsPlugins,
    showNumber: propsShowNumber,
    MoreIcon: propsMoreIcon,
    config: propsPluginConfig,
  } = props;

  const { t } = useUIKit();
  const [className, setClassName] = useState('');
  const [popStyle, setPopStyle] = useState({});
  const pluginsRef = useRef<IPluginsRef>();

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
      relateMessageType: [TencentCloudChat.TYPES.MSG_TEXT],
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

  const handleVisible = (data: any) => {
    if (data.x && data.y) {
      const isTop = data.y < data.height ? true : data.top;
      const isLeft = data.x < data.width ? true : data.left;
      setPopStyle({
        position: 'fixed',
        left: `${isLeft ? data.x : (data.x - data.width)}px`,
        top: `${isTop ? data.y : (data.y - data.height)}px`,
      });
    }
  };

  const RevokeElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>{t('TUIChat.Recall')}</span>
        <Icon width={20} height={20} type={IconTypes.REVOCATION} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
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
        <span className="del">{t('TUIChat.Delete')}</span>
        <Icon width={20} height={20} type={IconTypes.DEL} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      handleDelMessage(e);
    },
    message,
    isShow: pluginConfig.delete.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.delete.relateMessageType,
  });

  const ReplyElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>{t('TUIChat.Reference')}</span>
        <Icon width={20} height={20} type={IconTypes.QUOTE} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      handleReplyMessage(e);
    },
    message,
    isShow: pluginConfig.quote.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.quote.relateMessageType,
  });

  const CopyElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>{t('TUIChat.Copy')}</span>
        <Icon width={20} height={20} type={IconTypes.COPY} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      handleCopyMessage(e);
    },
    message,
    isShow: pluginConfig.copy.isShow && message?.status === MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.copy.relateMessageType,
  });

  const ResendElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>{t('TUIChat.Resend')}</span>
        <Icon width={20} height={20} type={IconTypes.REPLY} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
      handleResendMessage();
    },
    message,
    isShow: pluginConfig.resend.isShow && message?.status !== MESSAGE_STATUS.SUCCESS,
    relateMessageType: pluginConfig.resend.relateMessageType,
  });

  const ForWardElement = useMessagePluginElement({
    children: (
      <div className="message-plugin-item">
        <span>{t('TUIChat.Forward')}</span>
        <Icon width={20} height={20} type={IconTypes.FORWARD} />
      </div>
    ),
    handle: (e) => {
      pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
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

  const plugins = (propsPlugins || contextPlugin?.plugins || defaultPlugins).filter(item => item);

  const MoreIcon = propsMoreIcon || contextPlugin?.MoreIcon || <Icon className="icon-more" width={16} height={16} type={IconTypes.MORE} />;

  const showNumber = propsShowNumber || contextPlugin?.showNumber || 0;
  // eslint-disable-next-line
  // @ts-ignore
  return message?.status !== MESSAGE_STATUS.UNSEND && (
    <Plugins
      className="message-plugin"
      customClass={className}
      style={popStyle}
      ref={pluginsRef}
      plugins={plugins}
      showNumber={showNumber}
      MoreIcon={MoreIcon}
      root={messageListRef?.current}
      handleVisible={handleVisible}
    />
  );
}
