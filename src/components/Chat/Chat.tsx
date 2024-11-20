/* eslint-disable react/display-name */
import React, {
  PropsWithChildren, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import { ChatSDK, Conversation, Message } from '@tencentcloud/chat';
import TUIChatEngine, {
  TUIChatService,
  IMessageModel,
  TUIStore,
  StoreName,
} from '@tencentcloud/chat-uikit-engine';
import { JSONStringToParse } from '../utils';
import { useUIManagerStore } from '../../store';
import { TUIChatStateContextProvider } from '../../context/ChatStateContext';
import { TUIChatActionProvider } from '../../context/ChatActionContext';
import { ComponentProvider, UnknowPorps } from '../../context/ComponentContext';
import type { TUIChatActionContextValue } from '../../context/ChatActionContext';
import type { ComponentContextValue } from '../../context/ComponentContext';
import useCreateTUIChatStateContext from './hooks/useCreateTUIChatStateContext';

import type { TUIChatHeaderDefaultProps } from '../ChatHeader/ChatHeaderDefault';

import {
  TUIMessageProps,
  TUIMessage as TUIMessageDefault,
} from '../MessageElement';
import type { MessageContextProps } from '../MessageElement/MessageContext';

import './styles/index.scss';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import { chatReducer, ChatStateReducer, initialState } from './ChatState';

import { useHandleMessageList } from './hooks/useHandleMessageList';
import { useHandleMessage } from './hooks/useHandleMessage';

import { ChatHeader as ChatHeaderElement } from '../ChatHeader';
import { MessageListProps, MessageList } from '../MessageList';
import { MessageInput as MessageInputElement, TUIMessageInputBasicProps } from '../MessageInput';
import { EmptyStateIndicator } from '../EmptyStateIndicator';

interface TUIChatProps {
  className?: string;
  conversation?: Conversation;
  EmptyPlaceholder?: React.ReactElement;
  TUIMessage?: React.ComponentType<TUIMessageProps | UnknowPorps>;
  TUIChatHeader?: React.ComponentType<TUIChatHeaderDefaultProps>;
  MessageContext?: React.ComponentType<MessageContextProps>;
  TUIMessageInput?: React.ComponentType<UnknowPorps>;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
  MessageCustomPlugins?: React.ComponentType<UnknowPorps>;
  MessageTextPlugins?: React.ComponentType<UnknowPorps>;
  onMessageRecevied?: (
    updateMessage: (event?: Message[]) => void,
    event: any,
  ) => void;
  sendMessage?: (message: Message, options?: any) => Promise<Message>;
  revokeMessage?: (message: Message) => Promise<Message>;
  selectedConversation?: (conversation: Conversation) => Promise<Conversation>;
  filterMessage?: (messageList: IMessageModel[]) => IMessageModel[];
  callButtonClicked?: (callMediaType?: number, callType?: any) => void;
  messageConfig?: TUIMessageProps;
  cloudCustomData?: string;
  TUIMessageInputConfig?: TUIMessageInputBasicProps;
  TUIMessageListConfig?: MessageListProps;
  [propName: string]: any;
}

interface TUIChatInnerProps extends TUIChatProps {
  chat?: ChatSDK;
  key?: string;
}

function UnMemoizedChat<T extends TUIChatProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    conversation: propsConversation,
    EmptyPlaceholder = <EmptyStateIndicator listType="chat" />,
  } = props;

  const { chat } = useUIManagerStore();
  const { conversation: contextConversation } = useUIManagerStore('TUIChat');

  const conversation = propsConversation || contextConversation;

  if (!conversation?.conversationID) return EmptyPlaceholder;

  return (
    <TUIChatInner
      chat={chat}
      {...props}
      conversation={conversation}
      key={conversation.conversationID}
    />
  );
}

function TUIChatInner<T extends TUIChatInnerProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    chat,
    conversation,
    className,
    children,
    TUIMessage,
    TUIChatHeader,
    TUIMessageInput,
    InputPlugins,
    MessagePlugins,
    MessageContext,
    MessageCustomPlugins,
    MessageTextPlugins,
    InputQuote,
    onMessageRecevied,
    sendMessage: propsSendMessage,
    revokeMessage,
    selectedConversation,
    filterMessage,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    callButtonClicked,
  } = props;

  const [state, dispatch] = useReducer<any>(chatReducer, {
    ...initialState,
    conversation,
  });

  const messageListRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>();
  const chatStateContextValue = state && useCreateTUIChatStateContext({
    chat,
    conversation,
    messageListRef,
    textareaRef,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    ...state,
  });

  const {
    editLocalMessage,
    updateUploadPendingMessageList,
  } = useHandleMessageList({
    chat,
    conversation,
    // eslint-disable-next-line
    // @ts-ignore
    state,
    dispatch,
    filterMessage,
  });

  const {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
    setActiveMessageID,
  } = useHandleMessage({
    // eslint-disable-next-line
    // @ts-ignore
    state,
    dispatch,
  });

  useEffect(() => {
    TUIStore.watch(StoreName.CHAT, {
      messageList: onMessageListUpdated,
      isCompleted: isCompletedUpdated,
    });
    return () => {
      TUIStore.unwatch(StoreName.CHAT, {
        messageList: onMessageListUpdated,
        isCompleted: isCompletedUpdated,
      });
    };
  }, []);

  const onMessageListUpdated = (list: IMessageModel[]) => {
    const messageList = list.filter(message => !message.isDeleted);
    // eslint-disable-next-line
      // @ts-ignore
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST,
      value: filterMessage ? filterMessage(messageList) : messageList,
    });
  };

  const isCompletedUpdated = (flag: boolean) => {
    if (flag) {
      // eslint-disable-next-line
      // @ts-ignore
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_NO_MORE,
        value: flag,
      });
    }
  };

  // Load historical messages
  const loadMore = async () => {
    TUIChatService.getMessageList();
  };

  const setFirstSendMessage = async (message: any) => {
    if (
      !(message.type === 'TIMCustomElem' && JSONStringToParse(message.payload.data)?.src === 7)
      // eslint-disable-next-line
      // @ts-ignore
      && !state.firstSendMessage
    ) {
      // eslint-disable-next-line
      // @ts-ignore
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_FIRST_SEND_MESSAGE,
        value: message,
      });
    }
  };
  // eslint-disable-next-line
      // @ts-ignore
  const chatActionContextValue: TUIChatActionContextValue = useMemo(
    () => ({
      editLocalMessage,
      operateMessage,
      loadMore,
      revokeMessage,
      setAudioSource,
      setVideoSource,
      setHighlightedMessageId,
      setActiveMessageID,
      updateUploadPendingMessageList,
      setFirstSendMessage,
      callButtonClicked,
    }),
    [
      editLocalMessage,
      operateMessage,
      loadMore,
      revokeMessage,
      setAudioSource,
      setVideoSource,
      setHighlightedMessageId,
      setActiveMessageID,
      updateUploadPendingMessageList,
      setFirstSendMessage,
      callButtonClicked,
    ],
  );

  const componentContextValue: ComponentContextValue = useMemo(
    () => ({
      TUIMessage: TUIMessage || TUIMessageDefault,
      MessageContext,
      InputPlugins,
      MessagePlugins,
      MessageCustomPlugins,
      MessageTextPlugins,
      TUIChatHeader,
      TUIMessageInput,
      InputQuote,
    }),
    [],
  );

  return (
    <div className={`chat ${className}`}>
      {/* // eslint-disable-next-line
      // @ts-ignore */}
      <TUIChatStateContextProvider value={chatStateContextValue}>
        <TUIChatActionProvider value={chatActionContextValue}>
          <ComponentProvider value={componentContextValue}>
            {children || (
              <>
                <ChatHeaderElement />
                <MessageList />
                <MessageInputElement />
              </>
            )}
          </ComponentProvider>
        </TUIChatActionProvider>
      </TUIChatStateContextProvider>
    </div>
  );
}

export const Chat = React.memo(UnMemoizedChat) as typeof UnMemoizedChat;
