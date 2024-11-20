import React from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { TUIConversationService, IGroupModel, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { useUIManagerStore } from '../../../store';
import { Icon, IconTypes } from '../../Icon';
import { isH5 } from '../../../utils/env';
import '../index.scss';
import { Avatar, defaultUserAvatar } from '../../Avatar';

interface Props {
  group: IGroupModel;
  showChats?: () => void;
}

export function UnMemoizedGroupInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const { group, showChats } = props;

  const { setActiveContact, setActiveConversation } = useUIManagerStore('TUIContact');
  const { t } = useUIKit();
  const { groupID, name, avatar } = group;

  const back = () => {
    TUIConversationService.switchConversation('');
    setActiveContact();
  };
  const openGroupConversation = () => {
    const conversationID = `GROUP${groupID}`;
    showChats && showChats();
    TUIConversationService.switchConversation(conversationID).then(
      (conversationModel: IConversationModel) => {
        setActiveConversation(conversationModel.getConversation());
      },
    );
  };

  return (
    <>
      <div className="tui-contact-info-header">
        {isH5 && (
          <Icon
            width={9}
            height={16}
            type={IconTypes.BACK}
            onClick={back}
          />
        )}
        <div className="header-container">
          <div className="header-container-avatar">
            <Avatar size={60} image={avatar || defaultUserAvatar} />
            <div className="header-container-name">{name || groupID}</div>
          </div>
          <div className="header-container-text">{`groupID:${groupID}`}</div>
        </div>
      </div>
      <div className="tui-contact-info-content">
        <div className="content-btn-container">
          <div className="content-item-btn confirm-btn" role="button" tabIndex={0} onClick={openGroupConversation}>{t('TUIContact.Send Message')}</div>
        </div>
      </div>
    </>
  );
}
export const GroupInfo = React.memo(UnMemoizedGroupInfo);
