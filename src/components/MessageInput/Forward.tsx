import React, {
  PropsWithChildren, useCallback, useEffect, useState,
} from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Conversation, Message } from '@tencentcloud/chat';
import { useTUIChatActionContext } from '../../context';
import './styles/index.scss';
import { Model } from '../Model';
import { Icon, IconTypes } from '../Icon';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Avatar } from '../Avatar';
import { getDisplayImage, getDisplayTitle } from '../ConversationPreview/utils';
import { MESSAGE_OPERATE } from '../../constants';
import { useHandleForwardMessage } from './hooks';

interface HandleForwardParams {
  list?: Conversation[];
  message?: Message;
}

interface TUIForwardToProps {
  handleForward?: (data: HandleForwardParams) => void;
}

export function Forward<T extends TUIForwardToProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    handleForward: propsHandleForward,
  } = props;
  const { t } = useUIKit();
  const [selectList, setSelectList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const { operateMessage } = useTUIChatActionContext('TUIForward');

  const { message, sendForwardMessage, conversationList = [] } = useHandleForwardMessage();

  const handleClose = useCallback(() => {
    operateMessage && operateMessage({
      // eslint-disable-next-line
      // @ts-ignore
      [MESSAGE_OPERATE.FORWARD]: null,
    });
  }, [operateMessage]);

  // const FrequentlyList = conversationList.slice(0, 2);
  const RecentList = conversationList;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target?.value);
    if (e.target?.value) {
      const result = conversationList.filter((item) => {
        const name = (getDisplayTitle(item) as string).toLocaleLowerCase();
        const value = e.target?.value.toLocaleLowerCase();
        return name.includes(value);
      });
      setSearchResult(result);
    } else {
      setSearchResult([]);
    }
  };

  const handleCheckboxChange = (e: any) => {
    if (e.checked) {
      // eslint-disable-next-line
      // @ts-ignore
      setSelectList([...selectList, e.value]);
    } else {
      setSelectList(selectList.filter(item => item !== e.value));
    }
  };

  const handleDisplayForwardName = (value: any) => {
    const listName = value?.map((item: any) => getDisplayTitle(item));
    return listName.toString();
  };

  const handleForward = () => {
    if (propsHandleForward) {
      propsHandleForward({
        list: selectList,
        message,
      });
    } else {
      sendForwardMessage(selectList);
    }
    handleClose();
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setSelectList([]);
    setSearchResult([]);
    setSearchValue('');
  }, [message]);
  // eslint-disable-next-line
  // @ts-ignore
  return message && conversationList.length > 0 && (
    <Model onClick={handleClose}>
      <div role="button" tabIndex={0} className="tui-forward" onClick={(e) => { stopPropagation(e); }}>
        <header className="tui-forward-header">
          <Icon
            type={IconTypes.CANCEL}
            width={16}
            height={16}
            onClick={handleClose}
          />
          <h2 className="tui-forward-title">{t('TUIChat.Forward to')}</h2>
        </header>
        <div className="tui-forward-search">
          <Input
            className="tui-forward-search-input"
            placeholder="Search"
            clearable
            value={searchValue}
            onChange={handleInputChange}
            prefix={<Icon type={IconTypes.SEARCH} height={16} width={16} />}
          />
        </div>
        <main className="tui-forward-main">
          {
            searchValue && (
              <ul className="tui-forward-list">
                <h3 className="tui-forward-list-title">{t('TUIChat.Search Result')}</h3>
                {
                  searchResult.length > 0 && searchResult.map((item: any) => (
                    <li key={item.conversationID} className="tui-forward-list-item">
                      <label htmlFor={`${item.conversationID}`} className="info">
                        <Avatar image={getDisplayImage(item)} size={40} />
                        <div className="info-nick">{getDisplayTitle(item)}</div>
                      </label>
                      <Checkbox
                        onChange={(e) => { handleCheckboxChange(e); }}
                        id={`${item.conversationID}`}
                        value={item}
                      />
                    </li>
                  ))
                }
                {
                  searchResult.length === 0
                  && <p className="no-result">{t('TUIChat.No Result')}</p>
                }
              </ul>
            )
          }
          { !searchValue && RecentList.length > 0 && (
            <ul className="tui-forward-list">
              {
                RecentList.map((item: any) => (
                  <li key={item.conversationID} className="tui-forward-list-item">
                    <label htmlFor={`${item.conversationID}`} className="info">
                      <Avatar image={getDisplayImage(item)} size={40} />
                      <div className="info-nick">{getDisplayTitle(item)}</div>
                    </label>
                    <Checkbox
                      onChange={handleCheckboxChange}
                      id={`${item.conversationID}`}
                      value={item}
                    />
                  </li>
                ))
              }
            </ul>
          )}
        </main>
        <footer className="tui-forward-footer">
          <div className="tui-forward-footer-name">{selectList.length > 0 && handleDisplayForwardName(selectList)}</div>
          <button
            type="button"
            className="button"
            onClick={handleForward}
            disabled={selectList.length === 0}
          >
            {t('TUIChat.Forward')}
          </button>
        </footer>
      </div>
    </Model>
  );
}
