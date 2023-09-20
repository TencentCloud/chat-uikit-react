import { useMemo } from 'react';
import { ChatSDK } from '@tencentcloud/chat';
import { TUIChatStateContextValue } from '../../../context';

interface CreateTUIChatStateContextProp extends TUIChatStateContextValue {
  chat?: ChatSDK,
}

function useCreateTUIChatStateContext(props:CreateTUIChatStateContextProp) {
  const {
    chat,
    conversation,
    messageList,
    messageListRef,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    ...state
  } = props;
  const TUIChatStateContext = useMemo(() => ({
    chat,
    conversation,
    messageList,
    messageListRef,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    ...state,
  }), [
    chat,
    conversation,
    messageList,
    messageListRef,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    state,
  ]);

  return TUIChatStateContext;
}

export default useCreateTUIChatStateContext;
