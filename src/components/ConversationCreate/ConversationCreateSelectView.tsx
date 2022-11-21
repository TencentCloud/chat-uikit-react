import React from 'react';
import { Profile } from 'tim-js-sdk';
import { Avatar, defaultUserAvatar } from '../Avatar';
import './styles/conversationCreateSelectView.scss';
import { Icon, IconTypes } from '../Icon';

interface ValueProps {
  profile: Profile,
  domList: Array<HTMLInputElement>,
}
export interface ConversationCreateSelectViewProps{
  selectList: Array<ValueProps>,
  setSelectList: React.Dispatch<React.SetStateAction<Array<ValueProps>>>,
}
export function ConversationCreateSelectView(props:ConversationCreateSelectViewProps) {
  const { selectList, setSelectList } = props;
  const close = (domList, index) => {
    // eslint-disable-next-line no-param-reassign
    domList.forEach((dom) => { dom.checked = false; });
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
