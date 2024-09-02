import React, { PropsWithChildren, useEffect, useState } from 'react';
import TencentCloudChat, { Conversation, Group, Profile } from '@tencentcloud/chat';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import { Avatar } from '../Avatar';
import { handleDisplayAvatar } from '../untils';
import { isH5 } from '../../utils/env';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { useUIManager } from '../../context';

export interface TUIChatHeaderDefaultProps {
  title?: string,
  avatar?: React.ReactElement | string,
  isOnline?: boolean,
  conversation?: Conversation,
  pluginComponentList?: Array<React.ComponentType>,
}

export interface TUIChatHeaderBasicProps extends TUIChatHeaderDefaultProps {
  isLive?: boolean,
  opateIcon?: React.ReactElement | string,
}

function TUIChatHeaderDefaultWithContext <T extends TUIChatHeaderBasicProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    title: propTitle = '',
    avatar: propAvatar,
    isOnline,
    conversation,
    isLive,
    opateIcon,
  } = props;
  const { setActiveContact } = useUIManager('TUIContact');
  const [title, setTitle] = useState(propTitle);
  const [avatar, setAvatar] = useState<React.ReactElement | string>('');

  useEffect(() => {
    setTitle(propTitle);
    if (propAvatar) {
      setAvatar(propAvatar);
    }
    switch (conversation?.type) {
      case TencentCloudChat.TYPES.CONV_C2C:
        handleC2C(conversation.userProfile, conversation?.remark);
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

  const handleC2C = (userProfile: Profile, remark?: string) => {
    if (!title) {
      setTitle(remark || userProfile?.nick || userProfile?.userID);
    }
    if (!propAvatar) {
      setAvatar(<Avatar size={32} image={handleDisplayAvatar(userProfile.avatar)} />);
    }
  };

  const handleGroup = (groupProfile: Group) => {
    if (!title) {
      setTitle(groupProfile?.name || groupProfile?.groupID);
    }
    if (!propAvatar) {
      setAvatar(<Avatar
        size={32}
        image={handleDisplayAvatar(groupProfile.avatar, TencentCloudChat.TYPES.CONV_GROUP)}
      />);
    }
  };

  const back = () => {
    TUIConversationService.switchConversation('');
    setActiveContact();
  };
  const { setTUIManageShow } = useUIManager();
  const openTUIManage = () => {
    setTUIManageShow && setTUIManageShow(true);
  };

  return (
    <header
      className={`tui-chat-header ${isLive ? 'tui-chat-live-header' : ''}`}
      key={conversation?.conversationID}
    >
      {isH5 && (<div style={{ paddingRight: '10px' }}><Icon onClick={back} type={IconTypes.BACK} width={9} height={16} /></div>)}
      <div
        className={`tui-chat-header-left ${conversation?.type === TencentCloudChat.TYPES.CONV_SYSTEM ? 'system' : ''}`}
      >
        {conversation?.type !== TencentCloudChat.TYPES.CONV_SYSTEM && avatar}
      </div>
      <div className="header-content">
        <h3 className="title">{title}</h3>
      </div>
      <div className="tui-chat-header-right">
        <div className="header-handle">
          {
            opateIcon || <Icon className="header-handle-more" onClick={openTUIManage} type={IconTypes.ELLIPSE} width={18} height={5} />
          }
        </div>
      </div>

    </header>
  );
}

const MemoizedTUIChatHeaderDefault = React.memo(TUIChatHeaderDefaultWithContext) as
typeof TUIChatHeaderDefaultWithContext;

export function TUIChatHeaderDefault(props: TUIChatHeaderBasicProps)
:React.ReactElement {
  const options = { ...props };
  return <MemoizedTUIChatHeaderDefault {...options} />;
}
