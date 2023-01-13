import { useMemo } from 'react';
import { ChatSDK } from 'tim-js-sdk';
import { TUIChatStateContextValue } from '../../../context';

interface CreateTUIChatStateContextProp extends TUIChatStateContextValue {
  tim?: ChatSDK,
}

function useCreateTUIChatStateContext(props:CreateTUIChatStateContextProp) {
  const {
    tim,
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
    tim,
    conversation,
    messageList,
    messageListRef,
    messageConfig,
    cloudCustomData,
    TUIMessageInputConfig,
    TUIMessageListConfig,
    ...state,
  }), [
    tim,
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
