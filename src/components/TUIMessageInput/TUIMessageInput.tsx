import React, { MutableRefObject, PropsWithChildren } from 'react';
import TIM from 'tim-js-sdk';
import { TUIMessageInputContextProvider } from '../../context/TUIMessageInputContext';
import { useMessageInputState, useCreateMessageInputContext } from './hooks';
import './styles/index.scss';
import {
  UnknowPorps,
  useComponentContext,
  useTUIChatStateContext,
  useTUIKitContext,
} from '../../context';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { InputQuoteDefalut } from './InputQuoteDefalut';
import { TUIMessageInputDefault } from './TUIMessageInputDefault';
import { InputPluginsDefalut } from './InputPluginsDefalut';
import { TUIForward } from './TUIForward';

export interface TUIMessageInputProps {
  disabled?: boolean,
  TUIMessageInput?: React.ComponentType,
  InputPlugins?: React.ComponentType<UnknowPorps>,
  InputQuote?: React.ComponentType<UnknowPorps>,
  focus?: boolean,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  plugins?: Array<React.ReactElement>,
  showNumber?: number,
  MoreIcon?: React.ReactElement,
}
function TUIMessageInputProvider<T extends TUIMessageInputProps>(props: PropsWithChildren<T>)
:React.ReactElement {
  const {
    children,
    disabled: propsDisabled,
    focus = true,
    plugins,
    showNumber = 1,
    MoreIcon,
  } = props;
  const messageInputState = useMessageInputState(props);
  const { conversation } = useTUIKitContext('TUIMessageInput');
  const { textareaRef } = useTUIChatStateContext('TUIMessageInput');

  const contextDisabled = conversation.type === TIM.TYPES.CONV_SYSTEM;

  const messageInputContextValue = useCreateMessageInputContext({
    ...messageInputState,
    ...props,
    textareaRef,
    disabled: propsDisabled || contextDisabled,
    focus,
    plugins,
    showNumber,
    MoreIcon,
  });

  return (
    <TUIMessageInputContextProvider value={messageInputContextValue}>
      { children }
    </TUIMessageInputContextProvider>
  );
}

function UnMemoizedTUIMessageInput<T extends TUIMessageInputProps>(props: PropsWithChildren<T>)
:React.ReactElement {
  const {
    TUIMessageInput: PropTUIMessageInput,
    InputPlugins: PropInputPlugins,
    InputQuote: PropInputQuote,
  } = props;

  const {
    TUIMessageInput: ContextInput,
    InputPlugins: ContextInputPlugins,
    InputQuote: ContextInputQuote,
  } = useComponentContext('TUIMessageInput');
  const Input = PropTUIMessageInput || ContextInput || TUIMessageInputDefault;
  const InputPlugins = PropInputPlugins
  || ContextInputPlugins || InputPluginsDefalut || EmptyStateIndicator;
  const InputQuote = PropInputQuote || ContextInputQuote || InputQuoteDefalut;
  return (
    <div className="tui-message-input">
      <TUIMessageInputProvider {...props}>
        <TUIForward />
        <InputQuote />
        <div className="tui-message-input-main">
          <InputPlugins />
          <Input />
        </div>
      </TUIMessageInputProvider>
    </div>
  );
}
export const TUIMessageInput = React.memo(UnMemoizedTUIMessageInput) as
typeof UnMemoizedTUIMessageInput;
