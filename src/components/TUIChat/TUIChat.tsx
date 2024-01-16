import React, {
  PropsWithChildren, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import { ChatSDK, Conversation, Message } from '@tencentcloud/chat';
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
import { useMessageReceviedListener } from './hooks/useMessageReceviedListener';
import { chatReducer, ChatStateReducer, initialState } from './TUIChatState';

import { useCreateMessage } from './hooks/useCreateMessage';
import { useHandleMessageList } from './hooks/useHandleMessageList';
import { useHandleMessage } from './hooks/useHandleMessage';

import { TUIChatHeader as TUIChatHeaderElement } from '../TUIChatHeader';
import { MessageListProps, TUIMessageList } from '../TUIMessageList';
import { TUIMessageInput as TUIMessageInputElement, TUIMessageInputBasicProps } from '../TUIMessageInput';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { Toast } from '../Toast';
import { JSONStringToParse } from '../untils';

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
  filterMessage?: (messageList: Array<Message>) => void,
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

  const [state, dispatch] = useReducer<ChatStateReducer>(
    chatReducer,
    { ...initialState, conversation },
  );

  const messageListRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>();
  const chatStateContextValue = useCreateTUIChatStateContext({
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
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
  } = useCreateMessage({ chat, conversation, cloudCustomData });

  const {
    getMessageList,
    updateMessage,
    editLocalMessage,
    removeMessage,
    updateUploadPendingMessageList,
  } = useHandleMessageList({
    chat, conversation, state, dispatch, filterMessage,
  });

  const {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
  } = useHandleMessage({
    state, dispatch,
  });

  const sendMessage = async (message: Message, options?:any) => {
    if (
      !(message.type === 'TIMCustomElem' && JSONStringToParse(message.payload.data)?.src === 7)
      && !state.firstSendMessage
    ) {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_FIRST_SEND_MESSAGE,
        value: message,
      });
    }
    updateMessage([message]);
    try {
      if (propsSendMessage) {
        await propsSendMessage(message, options);
      } else {
        await chat.sendMessage(message, options);
      }
      editLocalMessage(message);
    } catch (error) {
      Toast({ text: error, type: 'error' });
      editLocalMessage(message);
    }
  };

  const loadMore = async () => {
    if (state.isCompleted) {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_NO_MORE,
        value: true,
      });
      return;
    }
    const historyMessageData = await getMessageList({
      nextReqMessageID: state.nextReqMessageID,
    });
    if (!historyMessageData) {
      return;
    }
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_HISTORY_MESSAGELIST,
      value: historyMessageData.data.messageList,
    });
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_IS_COMPLETE,
      value: historyMessageData.data.isCompleted,
    });
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_NEXT_REQ_MESSAGE_ID,
      value: historyMessageData.data.nextReqMessageID,
    });
  };

  useMessageReceviedListener(updateMessage, onMessageRecevied);

  useEffect(() => {
    (async () => {
      const res = await getMessageList();
      if (!res) {
        return;
      }
      if (res.data.messageList.length > 0) {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST,
          value: res.data.messageList,
        });
      }
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST,
        value: res.data.messageList,
      });
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_IS_COMPLETE,
        value: res.data.isCompleted,
      });
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_NEXT_REQ_MESSAGE_ID,
        value: res.data.nextReqMessageID,
      });
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_FIRST_SEND_MESSAGE,
        value: null,
      });
      selectedConversation && selectedConversation(conversation);
    })();
  }, [conversation]);

  const chatActionContextValue: TUIChatActionContextValue = useMemo(
    () => ({
      sendMessage,
      removeMessage,
      updateMessage,
      createTextMessage,
      createFaceMessage,
      createImageMessage,
      createVideoMessage,
      createFileMessage,
      createForwardMessage,
      createCustomMessage,
      createAudioMessage,
      createTextAtMessage,
      createLocationMessage,
      createMergerMessage,
      editLocalMessage,
      operateMessage,
      loadMore,
      revokeMessage,
      setAudioSource,
      setVideoSource,
      setHighlightedMessageId,
      updateUploadPendingMessageList,
    }),
    [
      sendMessage,
      removeMessage,
      updateMessage,
      createTextMessage,
      createFaceMessage,
      createImageMessage,
      createVideoMessage,
      createFileMessage,
      createForwardMessage,
      createCustomMessage,
      createAudioMessage,
      createTextAtMessage,
      createLocationMessage,
      createMergerMessage,
      editLocalMessage,
      operateMessage,
      loadMore,
      revokeMessage,
      setAudioSource,
      setVideoSource,
      setHighlightedMessageId,
      updateUploadPendingMessageList,
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
