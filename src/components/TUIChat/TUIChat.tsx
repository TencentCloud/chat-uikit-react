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
import { JSONStringToParse } from '../untils';
import { useTUIKitContext } from '../../context/TUIKitContext';
import { TUIChatStateContextProvider } from '../../context/TUIChatStateContext';
import { TUIChatActionProvider } from '../../context/TUIChatActionContext';
import { ComponentProvider, UnknowPorps } from '../../context/ComponentContext';
import type { TUIChatActionContextValue } from '../../context/TUIChatActionContext';
import type { ComponentContextValue } from '../../context/ComponentContext';
import useCreateTUIChatStateContext from './hooks/useCreateTUIChatStateContext';

import type { TUIChatHeaderDefaultProps } from '../TUIChatHeader/TUIChatHeaderDefault';

import {
  TUIMessageProps,
  TUIMessage as TUIMessageDefault,
} from '../TUIMessage';
import type { MessageContextProps } from '../TUIMessage/MessageContext';

import './styles/index.scss';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import { chatReducer, ChatStateReducer, initialState } from './TUIChatState';

import { useHandleMessageList } from './hooks/useHandleMessageList';
import { useHandleMessage } from './hooks/useHandleMessage';

import { TUIChatHeader as TUIChatHeaderElement } from '../TUIChatHeader';
import { MessageListProps, TUIMessageList } from '../TUIMessageList';
import { TUIMessageInput as TUIMessageInputElement, TUIMessageInputBasicProps } from '../TUIMessageInput';
import { EmptyStateIndicator } from '../EmptyStateIndicator';

interface TUIChatProps {
  className?: string,
  conversation?: Conversation,
  EmptyPlaceholder?: React.ReactElement,
  TUIMessage?: React.ComponentType<TUIMessageProps | UnknowPorps>,
  TUIChatHeader?: React.ComponentType<TUIChatHeaderDefaultProps>,
  MessageContext?: React.ComponentType<MessageContextProps>,
  TUIMessageInput?: React.ComponentType<UnknowPorps>,
  InputPlugins?: React.ComponentType<UnknowPorps>,
  InputQuote?: React.ComponentType<UnknowPorps>,
  MessagePlugins?: React.ComponentType<UnknowPorps>,
  MessageCustomPlugins?: React.ComponentType<UnknowPorps>,
  MessageTextPlugins?: React.ComponentType<UnknowPorps>,
  onMessageRecevied?: (
    updateMessage: (event?: Array<Message>) => void,
    event: any,
  ) => void,
  sendMessage?: (message:Message, options?:any) => Promise<Message>,
  revokeMessage?: (message:Message) => Promise<Message>,
  selectedConversation?: (conversation:Conversation) => Promise<Conversation>,
  filterMessage?: (messageList: Array<IMessageModel>) => Array<IMessageModel>,
  messageConfig?: TUIMessageProps,
  cloudCustomData?: string,
  TUIMessageInputConfig?: TUIMessageInputBasicProps,
  TUIMessageListConfig?: MessageListProps,
  [propName: string]: any,
}

interface TUIChatInnerProps extends TUIChatProps {
  chat?: ChatSDK,
  key?: string;
}

function UnMemoizedTUIChat <T extends TUIChatProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    conversation: propsConversation,
    EmptyPlaceholder = <EmptyStateIndicator listType="chat" />,
  } = props;

  const { conversation: contextConversation, chat } = useTUIKitContext('TUIChat');

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

function TUIChatInner <T extends TUIChatInnerProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
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
    const messageList = list.filter((message) => !message.isDeleted);
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
                <TUIChatHeaderElement />
                <TUIMessageList />
                <TUIMessageInputElement />
              </>
            )}
          </ComponentProvider>
        </TUIChatActionProvider>
      </TUIChatStateContextProvider>
    </div>
  );
}

export const TUIChat = React.memo(UnMemoizedTUIChat) as typeof UnMemoizedTUIChat;
