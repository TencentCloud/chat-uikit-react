import React, { useState } from 'react';
import { Conversation, Profile } from 'tim-js-sdk';
import { Input } from '../Input';
import './styles/ConversationCreatGroupDetail.scss';
import { Icon, IconTypes } from '../Icon';
import {
  Avatar,
  defaultGroupAvatarWork,
  defaultGroupAvatarAVChatRoom,
  defaultGroupAvatarMeeting,
  defaultGroupAvatarPublic, defaultUserAvatar,
} from '../Avatar';
import { PageStateTypes } from './ConversationCreate';
import { ConversationGroupTypeInfo, GroupType, typeInfoList } from './ConversationGroupTypeInfo';
import { useTUIKitContext } from '../../context';
import { CreateGroupConversationParams } from '../../hooks';

export interface ConversationCreatGroupDetailProps {
  profileList: Array<Profile>,
  pageState: PageStateTypes,
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>,
  createConversation: (params: string | CreateGroupConversationParams) => Promise<Conversation>,
  setConversationCreated: React.Dispatch<React.SetStateAction<boolean>>,
}

export function ConversationCreatGroupDetail(props: ConversationCreatGroupDetailProps) {
  const {
    profileList, pageState, setPageState, createConversation, setConversationCreated,
  } = props;
  const { setActiveConversation, myProfile } = useTUIKitContext();
  const temp = [...profileList];
  temp.unshift(myProfile);
  const name = temp.map((item) => item.nick || item.userID).toString();
  const [groupName, setGroupName] = useState(
    name.length >= 15 ? `${name.slice(0, 12)}...` : name,
  );
  const [groupID, setGroupID] = useState('');
  const [groupType, setGroupType] = useState('Work');
  const groupInfoChange = (e, type) => {
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
  const getDefaultAvatar = (type) => {
    switch (type) {
      case 'Work':
        return defaultGroupAvatarWork;
      case 'Public':
        return defaultGroupAvatarPublic;
      case 'Meeting':
        return defaultGroupAvatarMeeting;
      case 'AVChatRoom':
        return defaultGroupAvatarAVChatRoom;
      default:
        return '';
    }
  };
  const getDes = () => typeInfoList.find((item) => item.type === groupType).des;

  const next = async () => {
    const avatar = getDefaultAvatar(groupType);
    const conversation = await createConversation({
      name: groupName, type: GroupType[groupType], groupID, avatar,
    });
    setActiveConversation(conversation);
    setConversationCreated(false);
  };
  return pageState !== PageStateTypes.GROUP_TYPE ? (
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
            customClassName="input-group-name"
            clearable
            prefix={<div className="input-group-title">Group Name</div>}
          />
        </div>
        <div className="create-group-box create-group-id">
          <Input
            border="bottom"
            customClassName="input-group-text"
            clearable
            value={groupID}
            onChange={(e) => {
              groupInfoChange(e, 'id');
            }}
            prefix={<div className="input-group-title">Group ID</div>}
          />
        </div>
        <div className="create-group-box create-group-type">
          <Input
            disabled
            border="bottom"
            customClassName="input-group-text"
            prefix={<div className="input-group-title">Group of type</div>}
            suffix={(
              <Icon
                onClick={showGroupTypeInfo}
                type={IconTypes.ARROW_RIGHT}
                width={7}
                height={12}
              />
            )}
            value={groupType}
            onChange={(e) => {
              groupInfoChange(e, 'type');
            }}
          />
        </div>
        <div className="create-group-illustrate">
          {getDes()}
        </div>
        <div className="create-group-portrait">
          <div className="create-group-portrait-title">Participants</div>
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
        <div role="presentation" className="tui-conversation-create-next" onClick={next}>Create</div>
      </div>
    </>
  ) : (
    <ConversationGroupTypeInfo
      groupType={groupType}
      setGroupType={setGroupType}
      setPageState={setPageState}
    />
  );
}
