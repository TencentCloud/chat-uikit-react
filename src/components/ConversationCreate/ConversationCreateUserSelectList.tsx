import React, { useRef, useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Profile } from '@tencentcloud/chat';
import { Input } from '../Input';
import { Icon, IconTypes } from '../Icon';
import { ConversationCreateSelectView, ConversationCreateSelectViewProps } from './ConversationCreateSelectView';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { useConversationCreate } from './hooks/useConversationCreate';
import { createC2CConversation } from '../../hooks/useConversation';
import { useUIManagerStore } from '../../store';
import { PageStateTypes } from './ConversationCreate';
import { Toast } from '../Toast';
import { IConversationModel } from '@tencentcloud/chat-uikit-engine';

export interface ConversationCreateUserSelectListProps extends ConversationCreateSelectViewProps {
  isCreateGroup: boolean;
  setIsCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  conversationList: IConversationModel[];
  setPageState: React.Dispatch<React.SetStateAction<PageStateTypes>>;
  onBeforeCreateConversation?: (userID: string) => void;
  onConversationCreated?: (conversation: IConversationModel) => void;
}
export function ConversationCreateUserSelectList(props: ConversationCreateUserSelectListProps) {
  const {
    isCreateGroup,
    selectList,
    setSelectList,
    className,
    conversationList,
    setIsCreateGroup,
    setPageState,
    onBeforeCreateConversation,
    onConversationCreated,
  } = props;
  const { t } = useUIKit();
  const [searchValue, setSearchValue] = useState('');
  const { chat } = useUIManagerStore();
  const [friendList, setFriendList] = useState<any>({});
  const {
    getFriendListSortSearchResult,
  } = useConversationCreate(conversationList, (newFriendListResult) => {
    setFriendList(newFriendListResult);
  });
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
  const getUserChecked = (userID: string, dom: HTMLElement) => {
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
      selectList.splice(selectList.findIndex(item => item.profile.userID === userID), 1);
    }
    setSelectList([...selectList]);
  };

  const _createConversation = async (profile: Profile) => {
    if (isCreateGroup) return;
    const { userID } = profile;
    const params = onBeforeCreateConversation?.(userID);
    createC2CConversation(userID)
      .then((conversation: IConversationModel) => {
        onConversationCreated?.(conversation);
      }).catch((error) => {
        Toast({ text: error.message, type: 'error' });
      });
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
      <div className={`tui-conversation-create-select-list-container ${className}`}>
        <div className="tui-conversation-create-select-list">
          <div className="tui-group-container">
            {Object.keys(friendList).map(
              key => friendList[key].length !== 0 && (
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
                        onClick={() => {
                          _createConversation(profile);
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
