import React from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { TUIChatEngine } from '@tencentcloud/chat-uikit-engine';
import './styles/conversationGroupTypeInfo.scss';
import { PageStateTypes } from './ConversationCreate';
import { Icon, IconTypes } from '../Icon';

export enum GroupType {
  Work = TUIChatEngine.TYPES.GRP_WORK,
  Public = TUIChatEngine.TYPES.GRP_PUBLIC,
  Meeting = TUIChatEngine.TYPES.GRP_MEETING,
  AVChatRoom = TUIChatEngine.TYPES.GRP_AVCHATROOM,
  Community = TUIChatEngine.TYPES.GRP_COMMUNITY,
}
export interface ConversationGroupTypeInfoProps {
  groupType: GroupType;
  setGroupType: React.Dispatch<React.SetStateAction<GroupType>>;
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>;
}
export const typeInfoList: Array<{ type: GroupType; name: string; des: string }> = [
  { type: GroupType.Work, name: 'Work', des: 'Users can join the group only via invitation by existing members. The invitation does not need to be agreed by the invitee or approved by the group owner. See the documentation for details.' },
  { type: GroupType.Public, name: 'Public', des: 'After a public group is created, the group owner can designate group admins. To join the group, a user needs to search the group ID and send a request, which needs to be approved by the group owner or an admin before the user can join the group. See the documentation for details.' },
  { type: GroupType.Meeting, name: 'Meeting', des: 'After the group is created, a user can join and quit the group freely and can view the messages sent before joining the group. It is suitable for scenarios that integrate Tencent Real-Time Communication (TRTC), such as audio and video conferences and online education. See the documentation for details.' },
  { type: GroupType.AVChatRoom, name: 'AVChatRoom', des: 'After a group is created, a user can join and quit the group freely. The group can have an unlimited number of members, but it does not store message history. It can be combined with Live Video Broadcasting (LVB) to support on-screen comment scenarios. See the documentation for details.' },
  { type: GroupType.Community, name: 'Community', des: 'After creation, you can enter and leave at will, support up to 100,000 people, support historical message storage, and after users search for group ID and initiate a group application, they can join the group without administrator approval. See product documentation for details.' },
];
export function ConversationGroupTypeInfo(props: ConversationGroupTypeInfoProps) {
  const { groupType, setGroupType, setPageState } = props;

  const { t } = useUIKit();
  const selectGroupType = (type: GroupType) => {
    setGroupType(type);
    setPageState(PageStateTypes.CREATE_DETAIL);
  };
  return (
    <div className="tui-conversation-group-type-info">
      {typeInfoList.map(({ type, name, des }) => (
        <div
          key={type}
          role="presentation"
          className={`group-type-info-box ${type === groupType ? 'group-type-info-box--active' : ''} `}
          onClick={() => { selectGroupType(type); }}
        >
          <div className="group-type-info-title">
            {type === groupType && <Icon className="box-active-icon" type={IconTypes.RIGHT} width={16} height={16} />}
            {t(`TUIConversation.${name}`)}
          </div>
          <div className="group-type-info-description">{t(`TUIConversation.${des}`)}</div>
        </div>
      ))}
      <a className="group-type-info-document" target="_blank" href="https://trtc.io/document/33529?platform=web&product=chat&menulabel=uikit#group-types" rel="bookmark noreferrer">{t('TUIConversation.Details')}</a>
    </div>
  );
}
