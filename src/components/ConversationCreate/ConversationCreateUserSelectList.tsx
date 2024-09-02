import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Conversation, Profile } from '@tencentcloud/chat';
import {
  TUIConversationService,
} from '@tencentcloud/chat-uikit-engine';
import { Input } from '../Input';
import { Icon, IconTypes } from '../Icon';
import { ConversationCreateSelectView, ConversationCreateSelectViewProps } from './ConversationCreateSelectView';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { useConversationCreate } from './hooks/useConversationCreate';
import { useUIKit, useUIManager } from '../../context';
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
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { chat } = useUIKit();
  const { setActiveConversation } = useUIManager();
  const [friendList, setFriendList] = useState<any>({});
  const {
    getFriendListSortSearchResult,
  } = useConversationCreate(chat, conversationList, (newFriendListResult) => {
    setFriendList(newFriendListResult);
  });
  const { createConversation } = useConversation(chat);
  const userCheckedList = useRef(new Map());
  const searchValueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    setFriendList(await getFriendListSortSearchResult(value));
  };
  const createGroup = () => {
    setIsCreateGroup(true);
    userCheckedList.current.clear();
    setSelectList([]);
  };
  const getUserChecked = (userID:string, dom: HTMLElement) => {
    if (!dom) return;
    if (!userCheckedList.current.has(userID)) {
      userCheckedList.current.set(userID, []);
    }
    const list = userCheckedList.current.get(userID);
    if (list.length !== 0 && list.some((item: any) => item.id === dom.id)) {
      return;
    }
    list.push(dom);
  };
  const userSelectListChange = (e: any, profile: Profile, domList = []) => {
    const { userID } = profile;
    const { checked } = e.target;
    // eslint-disable-next-line
    // @ts-ignore
    domList.forEach((dom) => { dom.checked = checked; });
    if (checked) {
      selectList.push({ profile, domList });
    } else {
      selectList.splice(selectList.findIndex((item) => item.profile.userID === userID), 1);
    }
    setSelectList([...selectList]);
  };
  const createC2CConversation = async (profile: Profile) => {
    if (isCreateGroup) return;
    const { userID } = profile;
    const conversation = await createConversation(`C2C${userID}`);
    setConversationCreated(false);
    setActiveConversation(conversation);
    TUIConversationService.switchConversation(conversation?.conversationID);
  };
  const next = () => {
    if (selectList && selectList.length === 0) {
      Toast({ text: t('TUIConversation.Participant cannot be empty'), type: 'error' });
      return;
    }
    setPageState(PageStateTypes.CREATE_DETAIL);
  };
  return (
    <>
      <Input
        className="tui-conversation-create-search-input"
        placeholder={t('TUIConversation.Search')}
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
          <div className="tui-user-name active">{t('TUIConversation.New group chat')}</div>
        </div>
      )}
      <div className={`tui-conversation-create ${className}`}>
        <div className="tui-conversation-create-container">
          <div className="tui-group-container">
            {Object.keys(friendList).map(
              (key) => friendList[key].length !== 0 && (
                <div className="tui-group-box" key={key}>
                  <div className="title">{key}</div>
                  {friendList[key].map((profile: Profile, index: number) => {
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
                        <div className="tui-user-name text-ellipsis">{nick || `${userID}` }</div>
                        {isCreateGroup && (
                          <input
                            onChange={(e) => {
                              userSelectListChange(e, profile, userCheckedList.current.get(userID));
                            }}
                            type="checkbox"
                            ref={(dom: any) => {
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
          <div role="presentation" className="tui-conversation-create-next" onClick={next}>{t('TUIConversation.Next')}</div>
        </div>
      )}
    </>
  );
}
