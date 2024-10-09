import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { ConversationSearchInput as DefaultConversationSearchInput, type IConversationSearchInputProps } from './ConversationSearchInput/ConversationSearchInput';
import { ConversationSearchResult as DefaultConversationSearchResult, type IConversationSearchResultProps } from './ConversationSearchResult/ConversationSearchResult';
import { ConversationPreview as DefaultResultPreview, type IConversationPreviewProps } from '../ConversationPreview';
import { Avatar as DefaultAvatar, type AvatarProps } from '../Avatar';

import './ConversationSearch.scss';

export interface IConversationSearchProps {
  /** The list of conversations to be searched. */
  conversationList: IConversationModel[];
  /** Specifies a react component to customize the avatar in the search results. */
  Avatar?: React.ComponentType<AvatarProps>;
  /** Specifies a react component to customize the preview of search results. */
  ResultPreview?: React.ComponentType<IConversationPreviewProps>;
  /** Specifies a react component to customize the search input. */
  ConversationSearchInput?: React.ComponentType<IConversationSearchInputProps>;
  /** Specifies a react component to customize the search result. */
  ConversationSearchResult?: React.ComponentType<IConversationSearchResultProps>;
  /** Specifies a function to customize the search algorithm. This function takes the search value and the conversation list as parameters and returns the search results. */
  searchFn?: (searchValue: string, conversationList: IConversationModel[]) => IConversationModel[];
  /** Specifies a function to be called when the search input changes. This function takes the current search value as a parameter. */
  onSearchChange?: (searchValue: string) => void;
  /** Specifies a function to be called when the search input is focused. */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Specifies a function to be called when the search input is blurred. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Specifies a function to be called when a search result is selected. This function takes the selected conversation as a parameter. */
  onSelectResult?: (conversation: IConversationModel) => void;
  /** Specifies whether the search component is visible. */
  visible?: boolean;
  /** Specifies a custom class name for the search component. */
  className?: string;
  /** The custom css style */
  style?: React.CSSProperties;
}

export function defaultSearchFn(searchValue: string, conversationList: IConversationModel[]) {
  if (!searchValue || conversationList?.length === 0) return [];
  return conversationList.filter(item => item.getShowName().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
}

export function ConversationSearch(props: IConversationSearchProps) {
  const {
    visible = true,
    conversationList,
    Avatar = DefaultAvatar,
    searchFn = defaultSearchFn,
    ResultPreview = DefaultResultPreview,
    ConversationSearchInput = DefaultConversationSearchInput,
    ConversationSearchResult = DefaultConversationSearchResult,
    onSearchChange,
    onFocus,
    onBlur,
    onSelectResult,
    className,
    style,
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<IConversationModel[]>(conversationList);

  const [isActive, setIsActive] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const onFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
    onFocus?.(event);
  };

  const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(false);
    onBlur?.(event);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target?.value);
    setIsInputEmpty(e.target?.value.length === 0);
    onSearchChange?.(e.target?.value);
  };

  useEffect(() => {
    onSearchChange?.(searchValue);
  }, [searchValue, onSearchChange]);

  useEffect(() => {
    setSearchResult(searchFn(searchValue, conversationList));
  }, [conversationList, searchFn, searchValue]);

  useEffect(() => {
    setIsActive(!isInputEmpty);
  }, [isFocus, isInputEmpty]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={classNames('uikit-conversation-search', className, {
        'uikit-conversation-search--active': isActive,
      })}
      style={style}
    >
      <ConversationSearchInput
        value={searchValue}
        clearable={true}
        onChange={onChangeHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
      <ConversationSearchResult
        visible={isActive}
        Avatar={Avatar}
        searchResult={searchResult}
        searchValue={searchValue}
        ResultPreview={ResultPreview}
        onSelectResult={onSelectResult}
      />
    </div>
  );
}
