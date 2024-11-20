import React, { PropsWithChildren, useEffect, useState } from 'react';
import TUICore, { TUIConstants } from '@tencentcloud/tui-core';
import TencentCloudChat, { Conversation, Group, Profile } from '@tencentcloud/chat';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import { Avatar } from '../Avatar';
import { handleDisplayAvatar } from '../utils';
import { isH5 } from '../../utils/env';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { useTUIChatActionContext } from '../../context';
import { useUIManagerStore } from '../../store';
import { startCall } from '../Chat/utils';

export interface TUIChatHeaderDefaultProps {
  title?: string;
  avatar?: React.ReactElement | string;
  isOnline?: boolean;
  conversation?: Conversation;
  pluginComponentList?: React.ComponentType[];
  enableCall?: boolean;
}

export interface TUIChatHeaderBasicProps extends TUIChatHeaderDefaultProps {
  isLive?: boolean;
  opateIcon?: React.ReactElement | string;
}

function TUIChatHeaderDefaultWithContext<T extends TUIChatHeaderBasicProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    title: propTitle = '',
    avatar: propAvatar,
    isOnline,
    conversation,
    isLive,
    opateIcon,
    enableCall: propCallEnabled = false,
  } = props;
  const { callButtonClicked } = useTUIChatActionContext('TUIChat');
  const { setActiveContact } = useUIManagerStore('TUIContact');
  const [title, setTitle] = useState(propTitle);
  const [avatar, setAvatar] = useState<React.ReactElement | string>('');
  const [isShowCallIcon, setIsShowCallIcon] = useState<boolean>(false);
  useEffect(() => {
    setTitle(propTitle);
    if (propAvatar) {
      setAvatar(propAvatar);
    }
    switch (conversation?.type) {
      case TencentCloudChat.TYPES.CONV_C2C:
        handleC2C(conversation.userProfile, conversation?.remark);
        const isCalling = TUICore.getService(TUIConstants.TUICalling.SERVICE.NAME) ? true : false;
        setIsShowCallIcon(isCalling && propCallEnabled);
        break;
      case TencentCloudChat.TYPES.CONV_GROUP:
        handleGroup(conversation.groupProfile);
        break;
      case TencentCloudChat.TYPES.CONV_SYSTEM:
        setTitle('System Notice');
        break;
      default:
        setTitle('');
        break;
    }
  }, [conversation]);

  function handleC2C(userProfile: Profile, remark?: string) {
    if (!title) {
      setTitle(remark || userProfile?.nick || userProfile?.userID);
    }
    if (!propAvatar) {
      setAvatar(<Avatar size={32} image={handleDisplayAvatar(userProfile.avatar)} />);
    }
  }

  function handleGroup(groupProfile: Group) {
    if (!title) {
      setTitle(groupProfile?.name || groupProfile?.groupID);
    }
    if (!propAvatar) {
      setAvatar(
        <Avatar
          size={32}
          image={handleDisplayAvatar(groupProfile.avatar, TencentCloudChat.TYPES.CONV_GROUP)}
        />,
      );
    }
  }

  const back = () => {
    TUIConversationService.switchConversation('');
    setActiveContact();
  };
  const { setTUIManageShow } = useUIManagerStore();
  const openTUIManage = () => {
    setTUIManageShow && setTUIManageShow(true);
  };
  const handleCall = (callMediaType: number) => {
    const userID = conversation?.userProfile?.userID || '';
    const callType = conversation?.type || TencentCloudChat.TYPES.CONV_C2C;
    startCall({ callType, callMediaType, userIDList: [userID], callButtonClicked });
  };
  return (
    <header
      className={`tui-chat-header ${isLive ? 'tui-chat-live-header' : ''}`}
      key={conversation?.conversationID}
    >
      {isH5 && (
        <div style={{ paddingRight: '10px' }}>
          <Icon onClick={back} type={IconTypes.BACK} width={9} height={16} />
        </div>
      )}
      <div
        className={`tui-chat-header-left ${
          conversation?.type === TencentCloudChat.TYPES.CONV_SYSTEM
            ? 'system'
            : ''
        }`}
      >
        {conversation?.type !== TencentCloudChat.TYPES.CONV_SYSTEM && avatar}
      </div>
      <div className="header-content">
        <h3 className="title">{title}</h3>
      </div>
      {isShowCallIcon && (
        <div className="call-btn-container">
          <Icon
            className="call-btn"
            onClick={() =>
              handleCall(2)}
            type={IconTypes.VIDEOCALL}
            width={24}
          />
          <Icon
            className="call-btn"
            onClick={() =>
              handleCall(1)}
            type={IconTypes.VOICECALL}
            width={20}
          />
        </div>
      )}
      <div className="tui-chat-header-right">
        <div className="header-handle">
          {opateIcon || (
            <Icon
              className="header-handle-more"
              onClick={openTUIManage}
              type={IconTypes.ELLIPSE}
              width={18}
              height={5}
            />
          )}
        </div>
      </div>
    </header>
  );
}

const MemoizedTUIChatHeaderDefault = React.memo(TUIChatHeaderDefaultWithContext) as
typeof TUIChatHeaderDefaultWithContext;

export function ChatHeaderDefault(props: TUIChatHeaderBasicProps): React.ReactElement {
  const options = { ...props };
  return <MemoizedTUIChatHeaderDefault {...options} />;
}
