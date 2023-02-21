import React, { PropsWithChildren, useEffect, useState } from 'react';
import TIM, { Conversation, Group, Profile } from 'tim-js-sdk';
import { Avatar } from '../Avatar';
import { handleDisplayAvatar } from '../untils';

import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { useTUIKitContext } from '../../context';

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

  const [title, setTitle] = useState(propTitle);
  const [avatar, setAvatar] = useState<React.ReactElement | string>('');

  useEffect(() => {
    setTitle(propTitle);
    if (propAvatar) {
      setAvatar(propAvatar);
    }
    switch (conversation?.type) {
      case TIM.TYPES.CONV_C2C:
        handleC2C(conversation.userProfile);
        break;
      case TIM.TYPES.CONV_GROUP:
        handleGroup(conversation.groupProfile);
        break;
      case TIM.TYPES.CONV_SYSTEM:
        setTitle('System Notice');
        break;
      default:
        setTitle('');
        break;
    }
  }, [conversation]);

  const handleC2C = (userProfile: Profile) => {
    if (!title) {
      setTitle(userProfile?.nick || userProfile?.userID);
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
        image={handleDisplayAvatar(groupProfile.avatar, TIM.TYPES.CONV_GROUP)}
      />);
    }
  };
  const { setTUIManageShow } = useTUIKitContext();
  const openTUIManage = () => {
    setTUIManageShow(true);
  };

  return (
    <header
      className={`tui-chat-header ${isLive ? 'tui-chat-live-header' : ''}`}
      key={conversation?.conversationID}
    >
      <div
        className={`tui-chat-header-left ${conversation?.type === TIM.TYPES.CONV_SYSTEM ? 'system' : ''}`}
      >
        {conversation?.type !== TIM.TYPES.CONV_SYSTEM && avatar}
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
