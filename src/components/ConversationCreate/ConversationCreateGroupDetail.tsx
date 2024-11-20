import React, { useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Profile } from '@tencentcloud/chat';
import { CreateGroupParams, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { Input } from '../Input';
import './styles/ConversationCreateGroupDetail.scss';
import { Icon, IconTypes } from '../Icon';
import { Toast } from '../Toast';
import {
  Avatar,
  defaultGroupAvatarWork,
  defaultGroupAvatarAVChatRoom,
  defaultGroupAvatarMeeting,
  defaultGroupAvatarPublic,
  defaultUserAvatar,
} from '../Avatar';
import { PageStateTypes } from './ConversationCreate';
import { ConversationGroupTypeInfo, GroupType, typeInfoList } from './ConversationGroupTypeInfo';
import { useUIManagerStore } from '../../store';
import { createGroupConversation } from '../../hooks/useConversation';

export interface ConversationCreateGroupDetailProps {
  profileList: Profile[];
  pageState: PageStateTypes;
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>;
  onBeforeCreateConversation?: (params: CreateGroupParams) => void;
  onConversationCreated?: (conversation: IConversationModel) => void;
}
export function ConversationCreateGroupDetail(props: ConversationCreateGroupDetailProps) {
  const {
    profileList,
    pageState,
    setPageState,
    onBeforeCreateConversation,
    onConversationCreated,
  } = props;
  const { t } = useUIKit();
  const { setActiveConversation, myProfile } = useUIManagerStore();
  const temp = [...profileList];
  myProfile && temp.unshift(myProfile);
  const name = temp.map(item => item.nick || item.userID).toString();
  const [groupName, setGroupName] = useState(
    name.length >= 15 ? `${name.slice(0, 12)}...` : name,
  );
  const [groupID, setGroupID] = useState('');
  const [groupType, setGroupType] = useState<GroupType>(GroupType.Work);
  const groupInfoChange = (e: any, type: string) => {
    const { value } = e.target;
    switch (type) {
      case 'name':
        setGroupName(value);
        break;
      case 'id':
        setGroupID(value);
        break;
      case 'type':
        setGroupType(value);
        break;
      default:
    }
  };
  const showGroupTypeInfo = () => {
    setPageState(PageStateTypes.GROUP_TYPE);
  };
  const getDefaultAvatar = (type: GroupType) => {
    switch (type) {
      case GroupType.Work:
        return defaultGroupAvatarWork;
      case GroupType.Public:
        return defaultGroupAvatarPublic;
      case GroupType.Meeting:
        return defaultGroupAvatarMeeting;
      case GroupType.AVChatRoom:
        return defaultGroupAvatarAVChatRoom;
      default:
        return '';
    }
  };
  // eslint-disable-next-line
  // @ts-ignore
  const getDes = () => typeInfoList?.find((item: any) => item.type === groupType).des;
  const next = async () => {
    const memberList = profileList.map(item => ({
      userID: item.userID,
    }));
    const avatar = getDefaultAvatar(groupType);
    const options: CreateGroupParams = {
      name: groupName,
      type: groupType,
      groupID,
      avatar,
      memberList,
    } as any;
    const _options = onBeforeCreateConversation?.(options) || options;
    createGroupConversation(_options)
      .then((conversation: IConversationModel) => {
        onConversationCreated?.(conversation);
      })
      .catch((error) => {
        Toast({ text: error.message, type: 'error' });
      });
  };
  return pageState !== PageStateTypes.GROUP_TYPE
    ? (
        <>
          <div className="tui-conversation-create-group-detail">
            <div className="create-group-box create-group-name">
              <Input
                maxLength={15}
                value={groupName}
                onChange={(e) => {
                  groupInfoChange(e, 'name');
                }}
                border="bottom"
                inputClassName="input-group-name"
                clearable
                prefix={<div className="input-group-title">{t('TUIConversation.Group Name')}</div>}
              />
            </div>
            <div className="create-group-box create-group-id">
              <Input
                border="bottom"
                inputClassName="input-group-text"
                clearable
                value={groupID}
                onChange={(e) => {
                  groupInfoChange(e, 'id');
                }}
                prefix={<div className="input-group-title">{t('TUIConversation.Group ID')}</div>}
              />
            </div>
            <div className="create-group-box create-group-type" onClick={showGroupTypeInfo}>
              <Input
                readOnly
                border="bottom"
                inputClassName="input-group-text"
                prefix={<div className="input-group-title">{t('TUIConversation.Group Type')}</div>}
                suffix={(
                  <Icon
                    onClick={showGroupTypeInfo}
                    type={IconTypes.ARROW_RIGHT}
                    width={7}
                    height={12}
                  />
                )}
                value={t(`TUIConversation.${groupType}`)}
                onChange={(e) => {
                  groupInfoChange(e, 'type');
                }}
              />
            </div>
            <div className="create-group-illustrate">
              {t(`TUIConversation.${getDes()}`)}
            </div>
            <div className="create-group-portrait">
              <div className="create-group-portrait-title">{t('TUIConversation.Participants')}</div>
              <div className="create-group-portrait-info-container">
                {profileList.map(({ avatar, userID, nick }) => (
                  <div className="create-group-portrait-info" key={userID}>
                    <Avatar shape="square" size={50} image={avatar || defaultUserAvatar} />
                    <div className="create-group-portrait-info-nick">{nick}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="tui-conversation-create-next-container">
            <div role="presentation" className="tui-conversation-create-next" onClick={next}>{t('TUIConversation.Create')}</div>
          </div>
        </>
      )
    : (
        <ConversationGroupTypeInfo
          groupType={groupType}
          setGroupType={setGroupType}
          setPageState={setPageState}
        />
      );
}
