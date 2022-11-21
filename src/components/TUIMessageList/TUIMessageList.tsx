import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Message } from 'tim-js-sdk';
import {
  useTUIChatStateContext,
  useTUIChatActionContext,
  useComponentContext,
} from '../../context';
import useEnrichedMessageList from './hooks/useEnrichedMessageList';
import useMessageListElement from './hooks/useMessageListElement';

import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScrollPaginator';

import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';

import './styles/index.scss';

interface MessageListProps extends InfiniteScrollProps {
  messageList?: Array<Message>,
  highlightedMessageId?: string,
}
function TUIMessageListWithContext <T extends MessageListProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    messageList: propsMessageList,
    highlightedMessageId: propsHighlightedMessageId,
    loadMore: propsLoadMore,
  } = props;

  const [ulElement, setUlElement] = useState<HTMLUListElement | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const {
    messageList: contextMessageList,
    highlightedMessageId: contextHighlightedMessageId,
    isCompleted,
    isSameLastMessageID,
    messageListRef,
    noMore,
  } = useTUIChatStateContext('TUIMessageList');
  const { loadMore: contextLoadMore } = useTUIChatActionContext('TUIMessageList');
  const { TUIMessage, EmptyStateIndicator = DefaultEmptyStateIndicator } = useComponentContext('TUIMessageList');
  const highlightedMessageId = propsHighlightedMessageId || contextHighlightedMessageId;

  const { messageList: enrichedMessageList } = useEnrichedMessageList({
    messageList: propsMessageList || contextMessageList,
  });

  const loadMore = propsLoadMore || contextLoadMore;

  const elements = useMessageListElement({
    enrichedMessageList,
    TUIMessage,
  });

  useEffect(() => {
    (async () => {
      const parentElement = ulElement?.parentElement?.parentElement;
      if (!isCompleted && parentElement?.clientHeight >= ulElement?.clientHeight) {
        await loadMore();
      }
      if (highlightedMessageId) {
        const element = ulElement?.querySelector(`[data-message-id='${highlightedMessageId}']`);
        element?.scrollIntoView({ block: 'center' });
      }

      if (ulElement?.children && (!firstRender || !isSameLastMessageID)) {
        const HTMLCollection = ulElement?.children || [];
        const element = HTMLCollection[HTMLCollection.length - 1];
        const timer = setTimeout(() => {
          element?.scrollIntoView({ block: 'end' });
          setFirstRender(true);
          clearTimeout(timer);
        }, 100);
      }
    })();
  }, [elements, firstRender]);

  return (
    <div className="message-list" ref={messageListRef}>
      {noMore}
      {noMore && <p className="no-more">no More</p>}
      <InfiniteScroll
        className="message-list-infinite-scroll"
        hasMore
        loadMore={loadMore}
        threshold={1}
      >
        <ul ref={setUlElement}>
          {
              elements?.length > 0 ? elements : <EmptyStateIndicator listType="message" />
            }
        </ul>
      </InfiniteScroll>
    </div>
  );
}

const MemoizedTUIMessageListContext = React.memo(TUIMessageListWithContext) as
typeof TUIMessageListWithContext;

export function TUIMessageList(props:MessageListProps):React.ReactElement {
  return (
    <MemoizedTUIMessageListContext {...props} />
  );
}
