import React from 'react';
import { Profile } from '@tencentcloud/chat';
import { Avatar, defaultUserAvatar } from '../Avatar';
import './styles/conversationCreateSelectView.scss';
import { Icon, IconTypes } from '../Icon';

interface ValueProps {
  profile: Profile;
  domList: HTMLInputElement[];
}
export interface ConversationCreateSelectViewProps {
  selectList: ValueProps[];
  setSelectList: React.Dispatch<React.SetStateAction<ValueProps[]>>;
}
export function ConversationCreateSelectView(props: ConversationCreateSelectViewProps) {
  const { selectList, setSelectList } = props;
  const close = (domList: HTMLInputElement[], index: number) => {
    // eslint-disable-next-line no-param-reassign
    domList.forEach((dom: HTMLInputElement) => { dom.checked = false; });
    selectList.splice(index, 1);
    setSelectList([...selectList]);
  };
  return (
    <div className="conversation-create-select-view">
      {
        selectList.map((item, index) => {
          const { profile, domList } = item;
          const { nick, userID, avatar } = profile;
          return (
            <div className="select-view-info" key={userID}>
              <Icon
                height={12}
                width={12}
                type={IconTypes.CLOSE}
                className="select-view-info-close"
                onClick={() => { close(domList, index); }}
              />
              <Avatar image={avatar || defaultUserAvatar} size={40} />
              <div className="select-view-info-nick">{nick || userID}</div>
            </div>
          );
        })
      }
    </div>
  );
}
