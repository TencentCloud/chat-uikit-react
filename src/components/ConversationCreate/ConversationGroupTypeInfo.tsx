import React from 'react';
import './styles/conversationGroupTypeInfo.scss';
import TIM from 'tim-js-sdk';
import { PageStateTypes } from './ConversationCreate';
import { Icon, IconTypes } from '../Icon';

export enum GroupType {
  Work= TIM.TYPES.GRP_WORK,
  Public= TIM.TYPES.GRP_PUBLIC,
  Meeting= TIM.TYPES.GRP_MEETING,
  AVChatRoom= TIM.TYPES.GRP_AVCHATROOM,
}
export interface ConversationGroupTypeInfoProps {
  groupType: string,
  setGroupType: React.Dispatch<React.SetStateAction<string>>,
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>,
}
export const typeInfoList = [
  { type: 'Work', des: 'Users can join the group only via invitation by existing members. The invitation does not need to be agreed by the invitee or approved by the group owner. See the documentation for details.' },
  { type: 'Public', des: 'After a public group is created, the group owner can designate group admins. To join the group, a user needs to search the group ID and send a request, which needs to be approved by the group owner or an admin before the user can join the group. See the documentation for details.' },
  { type: 'Meeting', des: 'After the group is created, a user can join and quit the group freely and can view the messages sent before joining the group. It is suitable for scenarios that integrate Tencent Real-Time Communication (TRTC), such as audio and video conferences and online education. See the documentation for details.' },
  { type: 'AVChatRoom', des: 'After a group is created, a user can join and quit the group freely. The group can have an unlimited number of members, but it does not store message history. It can be combined with Live Video Broadcasting (LVB) to support on-screen comment scenarios. See the documentation for details.' },
];
export function ConversationGroupTypeInfo(props: ConversationGroupTypeInfoProps) {
  const { groupType, setGroupType, setPageState } = props;

  const selectGroupType = (type: string) => {
    setGroupType(type);
    setPageState(PageStateTypes.CREATE_DETAIL);
  };
  return (
    <div className="tui-conversation-group-type-info">
      {typeInfoList.map(({ type, des }) => (
        <div
          key={type}
          role="presentation"
          className={`group-type-info-box ${type === groupType ? 'group-type-info-box--active' : ''} `}
          onClick={() => { selectGroupType(type); }}
        >
          <div className="group-type-info-title">
            {type === groupType && <Icon className="box-active-icon" type={IconTypes.RIGHT} width={16} height={16} />}
            {type}
          </div>
          <div className="group-type-info-description">{des}</div>
        </div>
      ))}
      <a className="group-type-info-document" target="_blank" href="https://www.tencentcloud.com/document/product/1047/33515?lang=en&pg=#group-features" rel="bookmark noreferrer">Details</a>
    </div>
  );
}
