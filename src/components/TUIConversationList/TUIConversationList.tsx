import React, { useRef, useState } from 'react';
import { Conversation } from 'tim-js-sdk';
import { useTUIKitContext } from '../../context';
import useConversationList from './hooks/useConversationList';
import './index.scss';
import { ConversationPreview, ConversationPreviewUIComponentProps } from '../ConversationPreview';
import {
  ConversationListContainer,
  ConversationListContainerProps,
} from '../ConversationPreview/ConversationListContainer';
import { Profile } from '../Profile';
import { ConversationSearchInput, ConversationSearchResult } from '../ConversationSearch';
import { ConversationCreate } from '../ConversationCreate';
import { Icon, IconTypes } from '../Icon';
import { getDisplayTitle } from '../ConversationPreview/utils';
import { useConversationUpdate } from './hooks/useConversationUpdate';
import { useTUIConversationContext } from '../../context/TUIConversationContext';

interface Props {
  filters?: object,
  sort?: object,
  options?: object,
  Preview?: React.ComponentType<ConversationPreviewUIComponentProps>,
  Container?: React.ComponentType<ConversationListContainerProps>,
  onConversationListUpdated?: (
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
    event: () => void
  ) => void,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
}
export function UnMemoTUIConversationList<T extends Props>(props: T):React.ReactElement {
  const {
    Preview,
    Container = ConversationListContainer,
    onConversationListUpdated,
    filterConversation: propsFilterConversation,
  } = props;
  const {
    tim, customClasses, conversation, setActiveConversation, setTUIProfileShow,
  } = useTUIKitContext('TUIConversationList');
  const {
    filterConversation: contextFilterConversation,
  } = useTUIConversationContext('TUIConversationList');
  const filterConversation = propsFilterConversation || contextFilterConversation;
  const [conversationUpdateCount, setConversationUpdateCount] = useState(0);
  const forceUpdate = () => setConversationUpdateCount((count) => count + 1);

  const activeConversationHandler = (
    conversationList: Array<Conversation>,
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  ) => {
    if (!conversationList.length) {
      return;
    }
    setActiveConversation(conversation);
  };
  const {
    conversationList,
    setConversationList,
  } = useConversationList(tim, activeConversationHandler, filterConversation);
  useConversationUpdate(
    setConversationList,
    onConversationListUpdated,
    forceUpdate,
    filterConversation,
  );
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(conversationList);
  const [conversationCreated, setConversationCreated] = useState(false);

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target?.value);
    if (e.target?.value) {
      const result = conversationList.filter(
        // eslint-disable-next-line max-len
        (item) => (getDisplayTitle(item) as string).toLocaleLowerCase().includes(e.target?.value.toLocaleLowerCase()),
      );
      setSearchResult(result);
    } else {
      setSearchResult([]);
    }
  };

  const handleConversationCreate = () => {
    setSearchValue('');
    setConversationCreated(true);
  };
  const { myProfile } = useTUIKitContext();
  const conversationListRef = useRef(null);
  return (
    <div className={`tui-conversation ${customClasses || ''}`} ref={conversationListRef}>
      {
        conversationCreated
          ? (
            <ConversationCreate
              conversationList={conversationList}
              setConversationCreated={setConversationCreated}
            />
          )
          : (
            <>
              <Profile profile={myProfile} handleAvatar={() => { setTUIProfileShow(true); }} />
              <div className="tui-conversation-header">
                <ConversationSearchInput
                  value={searchValue}
                  clearable
                  onChange={handleSearchValueChange}
                />
                <div className="tui-conversation-create-icon">
                  <Icon
                    onClick={handleConversationCreate}
                    type={IconTypes.CREATE}
                    height={24}
                    width={24}
                  />
                </div>
              </div>
              <Container setConversationList={setConversationList}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {conversationList.length === 0
                  ? (
                    <div className="no-result">
                      <Icon className="no-result-icon" type={IconTypes.EFFORT} width={42} height={42} />
                      <div className="no-result-message">No conversation</div>
                    </div>
                  )
                  : searchValue
                    ? (
                      <ConversationSearchResult
                        Preview={Preview}
                        searchValue={searchValue}
                        result={searchResult}
                      />
                    )
                    : conversationList.map((item) => {
                      const previewProps = {
                        activeConversation: conversation,
                        conversation: item,
                        setActiveConversation,
                        Preview,
                        conversationUpdateCount,
                      };
                      return (
                        <ConversationPreview key={item.conversationID} {...previewProps} />
                      );
                    })}
              </Container>
            </>
          )
      }
    </div>
  );
}
export const TUIConversationList = React.memo(UnMemoTUIConversationList);
