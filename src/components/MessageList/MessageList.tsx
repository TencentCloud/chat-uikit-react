import React, { PropsWithChildren, useState, useEffect } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Message } from '@tencentcloud/chat';
import {
  useTUIChatStateContext,
  useTUIChatActionContext,
  useComponentContext,
} from '../../context';
import useMessageListElement from './hooks/useMessageListElement';

import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScrollPaginator';

import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';

import './styles/index.scss';

export interface MessageListProps extends InfiniteScrollProps {
  className?: string;
  messageList?: Message[];
  highlightedMessageId?: string;
  intervalsTimer?: number;
}
function TUIMessageListWithContext<T extends MessageListProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    highlightedMessageId: propsHighlightedMessageId,
    loadMore: propsLoadMore,
    intervalsTimer: propsIntervalsTimer,
    className: propsClassName,
  } = props;

  const { t } = useUIKit();
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

  const loadMore = propsLoadMore || TUIMessageListConfig?.loadMore || contextLoadMore;

  const elements = contextMessageList && useMessageListElement({
    enrichedMessageList: contextMessageList,
    TUIMessage,
    intervalsTimer,
  });
  useEffect(() => {
    (async () => {
      const parentElement = ulElement?.parentElement?.parentElement;
      if (
        !isCompleted
        && parentElement && parentElement?.clientHeight >= ulElement?.clientHeight
      ) {
        loadMore && await loadMore();
      }
      if (ulElement?.children) {
        const HTMLCollection = ulElement?.children || [];
        const element = HTMLCollection[HTMLCollection.length - 1];
        const timer = setTimeout(() => {
          if (messageListRef?.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
          }
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
      const { children } = element;
      children[children.length - 1].classList.add('high-lighted');
      if (messageListRef?.current) {
        const highlightedMessageRect = element.getBoundingClientRect();
        const messageListRect = messageListRef.current.getBoundingClientRect();
        const finalScrollTop = highlightedMessageRect.top - messageListRect.top + messageListRef.current.scrollTop;
        messageListRef.current.scrollTop = finalScrollTop;
      }
      const timer = setTimeout(() => {
        children[children.length - 1].classList.remove('high-lighted');
        clearTimeout(timer);
        setHighlightedMessageId && setHighlightedMessageId('');
      }, 1000);
    }
  }, [highlightedMessageId]);

  return (
    <div className={`message-list ${propsClassName} ${!firstRender ? 'hide' : ''}`} ref={messageListRef}>
      {noMore}
      {noMore && <p className="no-more">{t('TUIChat.No More')}</p>}
      <InfiniteScroll
        className="message-list-infinite-scroll"
        hasMore
        loadMore={loadMore}
        threshold={1}
      >
        <ul ref={setUlElement}>
          {
            elements?.length && elements.length > 0 ? elements : <EmptyStateIndicator listType="message" />
          }
        </ul>
      </InfiniteScroll>
    </div>
  );
}

const MemoizedTUIMessageListContext = React.memo(TUIMessageListWithContext) as
  typeof TUIMessageListWithContext;

export function MessageList(props: MessageListProps): React.ReactElement {
  return (
    <MemoizedTUIMessageListContext {...props} />
  );
}
