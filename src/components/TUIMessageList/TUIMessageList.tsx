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

export interface MessageListProps extends InfiniteScrollProps {
  className?: string,
  messageList?: Array<Message>,
  highlightedMessageId?: string,
  intervalsTimer?: number,
}
function TUIMessageListWithContext <T extends MessageListProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    messageList: propsMessageList,
    highlightedMessageId: propsHighlightedMessageId,
    loadMore: propsLoadMore,
    intervalsTimer: propsIntervalsTimer,
    className: propsClassName,
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
    TUIMessageListConfig,
  } = useTUIChatStateContext('TUIMessageList');
  const { loadMore: contextLoadMore, setHighlightedMessageId } = useTUIChatActionContext('TUIMessageList');
  const { TUIMessage, EmptyStateIndicator = DefaultEmptyStateIndicator } = useComponentContext('TUIMessageList');

  const highlightedMessageId = propsHighlightedMessageId
  || TUIMessageListConfig?.highlightedMessageId
  || contextHighlightedMessageId;
  const intervalsTimer = (propsIntervalsTimer || TUIMessageListConfig?.intervalsTimer || 30) * 60;

  const { messageList: enrichedMessageList } = useEnrichedMessageList({
    messageList: propsMessageList || TUIMessageListConfig?.messageList || contextMessageList,
  });

  const loadMore = propsLoadMore || TUIMessageListConfig?.loadMore || contextLoadMore;

  const elements = useMessageListElement({
    enrichedMessageList,
    TUIMessage,
    intervalsTimer,
  });

  useEffect(() => {
    (async () => {
      const parentElement = ulElement?.parentElement?.parentElement;
      if (!isCompleted && parentElement?.clientHeight >= ulElement?.clientHeight) {
        await loadMore();
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

  useEffect(() => {
    if (highlightedMessageId) {
      const element = ulElement?.querySelector(`[data-message-id='${highlightedMessageId}']`);
      if (!element) {
        return;
      }
      const { children } = element.children[1];
      children[children.length - 1].classList.add('high-lighted');
      element?.scrollIntoView({ block: 'center' });
      const timer = setTimeout(() => {
        children[children.length - 1].classList.remove('high-lighted');
        clearTimeout(timer);
        setHighlightedMessageId('');
      }, 1000);
    }
  }, [highlightedMessageId]);

  return (
    <div className={`message-list ${propsClassName} ${!firstRender ? 'hide' : ''}`} ref={messageListRef}>
      {noMore}
      {noMore && <p className="no-more">No More</p>}
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
