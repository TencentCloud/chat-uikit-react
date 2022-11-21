import React, { useRef, useState } from 'react';
import { Conversation } from 'tim-js-sdk';
import { Input } from '../Input';
import { Icon, IconTypes } from '../Icon';
import { ConversationCreateSelectView, ConversationCreateSelectViewProps } from './ConversationCreateSelectView';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { useConversationCreate } from './hooks/useConversationCreate';
import { useTUIKitContext } from '../../context';
import { PageStateTypes } from './ConversationCreate';
import { useConversation } from '../../hooks';
import { Toast } from '../Toast';

export interface ConversationCreateUserSelectListProps extends ConversationCreateSelectViewProps{
  isCreateGroup: boolean,
  setIsCreateGroup: React.Dispatch<React.SetStateAction<boolean>>,
  setConversationCreated: React.Dispatch<React.SetStateAction<boolean>>,
  className: string,
  conversationList: Array<Conversation>,
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>,
}
export function ConversationCreateUserSelectList(props: ConversationCreateUserSelectListProps) {
  const {
    isCreateGroup,
    selectList,
    setSelectList,
    className,
    conversationList,
    setIsCreateGroup,
    setConversationCreated,
    setPageState,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const { tim, setActiveConversation } = useTUIKitContext();
  const [friendList, setFriendList] = useState({});
  const {
    getFriendListSortSearchResult,
  } = useConversationCreate(tim, conversationList, (newFriendListResult) => {
    setFriendList(newFriendListResult);
  });
  const { createConversation } = useConversation(tim);
  const userCheckedList = useRef(new Map());
  const searchValueChange = async (e) => {
    const { value } = e.target;
    setSearchValue(value);
    setFriendList(await getFriendListSortSearchResult(value));
  };
  const createGroup = () => {
    setIsCreateGroup(true);
    userCheckedList.current.clear();
    setSelectList([]);
  };
  const getUserChecked = (userID, dom) => {
    if (!dom) return;
    if (!userCheckedList.current.has(userID)) {
      userCheckedList.current.set(userID, []);
    }
    const list = userCheckedList.current.get(userID);
    if (list.length !== 0 && list.some((item) => item.id === dom.id)) {
      return;
    }
    list.push(dom);
  };
  const userSelectListChange = (e, profile, domList = []) => {
    const { userID } = profile;
    const { checked } = e.target;
    // eslint-disable-next-line no-param-reassign
    domList.forEach((dom) => { dom.checked = checked; });
    if (checked) {
      selectList.push({ profile, domList });
    } else {
      selectList.splice(selectList.findIndex((item) => item.profile.userID === userID), 1);
    }
    setSelectList([...selectList]);
  };
  const createC2CConversation = async (profile) => {
    if (isCreateGroup) return;
    const { userID } = profile;
    const conversation = await createConversation(`C2C${userID}`);
    setConversationCreated(false);
    setActiveConversation(conversation);
  };
  const next = () => {
    if (selectList && selectList.length === 0) {
      Toast({ text: 'Participant cannot be empty.', type: 'error' });
      return;
    }
    setPageState(PageStateTypes.CREATE_DETAIL);
  };
  return (
    <>
      <Input
        className="tui-conversation-create-search-input"
        placeholder="Search"
        clearable
        value={searchValue}
        onChange={searchValueChange}
        prefix={<Icon type={IconTypes.SEARCH} height={16} width={16} />}
      />
      {(isCreateGroup) && (
        <ConversationCreateSelectView selectList={selectList} setSelectList={setSelectList} />
      )}
      {!isCreateGroup && (
        <div role="presentation" className="tui-user" onClick={createGroup}>
          <Icon type={IconTypes.ADD} />
          <div className="tui-user-name active">New Group</div>
        </div>
      )}
      <div className={`tui-conversation-create ${className}`}>
        <div className="tui-conversation-create-container">
          <div className="tui-group-container">
            {Object.keys(friendList).map(
              (key) => friendList[key].length !== 0 && (
                <div className="tui-group-box" key={key}>
                  <div className="title">{key}</div>
                  {friendList[key].map((profile, index) => {
                    const { userID, nick, avatar } = profile;
                    return (
                      <label
                        role="presentation"
                        className="tui-user tui-user-checkbox-label"
                        htmlFor={`userChecked-${key}-${userID}`}
                        key={userID}
                        onClick={(e) => {
                          createC2CConversation(profile);
                        }}
                      >
                        <Avatar size={30} image={avatar || defaultUserAvatar} />
                        <div className="tui-user-name">{nick || `${userID}` }</div>
                        {isCreateGroup && (
                          <input
                            onChange={(e) => {
                              userSelectListChange(e, profile, userCheckedList.current.get(userID));
                            }}
                            type="checkbox"
                            ref={(dom) => {
                              getUserChecked(userID, dom);
                            }}
                            id={`userChecked-${key}-${userID}`}
                            className="tui-user-checkbox"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      {isCreateGroup && (
        <div className="tui-conversation-create-next-container">
          <div role="presentation" className="tui-conversation-create-next" onClick={next}>Next</div>
        </div>
      )}
    </>
  );
}
