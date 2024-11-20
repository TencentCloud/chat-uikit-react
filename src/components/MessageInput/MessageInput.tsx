import React, { MutableRefObject, PropsWithChildren } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { TUIMessageInputContextProvider } from '../../context/MessageInputContext';
import { useMessageInputState, useCreateMessageInputContext } from './hooks';
import './styles/index.scss';
import {
  UnknowPorps,
  useComponentContext,
  useTUIChatStateContext,
} from '../../context';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { InputQuoteDefalut } from './InputQuoteDefalut';
import { TUIMessageInputDefault } from './MessageInputDefault';
import { InputPluginsDefalut } from './InputPluginsDefalut';
import { Forward } from './Forward';
import { Transmitter } from './Transmitter';

export interface PluginConfigProps {
  plugins?: React.ReactElement[];
  showNumber?: number;
  MoreIcon?: React.ReactElement;
  isEmojiPicker?: boolean;
  isImagePicker?: boolean;
  isVideoPicker?: boolean;
  isFilePicker?: boolean;
}

export interface TUIMessageInputBasicProps {
  disabled?: boolean;
  focus?: boolean;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  isTransmitter?: boolean;
  className?: string;
  pluginConfig?: PluginConfigProps;
}

export interface TUIMessageInputProps extends TUIMessageInputBasicProps {
  TUIMessageInput?: React.ComponentType;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
}

function TUIMessageInputProvider<T extends TUIMessageInputProps>(props: PropsWithChildren<T>): React.ReactElement {
  const {
    children,
    disabled: propsDisabled,
    focus: propsFoces,
    pluginConfig,
    textareaRef: propsTextareaRef,
  } = props;
  const messageInputState = useMessageInputState(props);
  const { textareaRef, conversation } = useTUIChatStateContext('TUIMessageInput');

  const contextDisabled = conversation?.type === TencentCloudChat.TYPES.CONV_SYSTEM;

  const { TUIMessageInputConfig } = useTUIChatStateContext('TUIMessageInput');

  const focus = propsFoces || TUIMessageInputConfig?.focus;

  const messageInputContextValue = useCreateMessageInputContext({
    ...messageInputState,
    ...props,
    textareaRef: propsTextareaRef || TUIMessageInputConfig?.textareaRef || textareaRef,
    disabled: propsDisabled || TUIMessageInputConfig?.disabled || contextDisabled,
    focus: typeof (focus) === 'boolean' ? focus : true,
    pluginConfig,
  });

  return (
    <TUIMessageInputContextProvider value={messageInputContextValue}>
      { children }
    </TUIMessageInputContextProvider>
  );
}

function UnMemoizedMessageInput<T extends TUIMessageInputProps>(props: PropsWithChildren<T>): React.ReactElement {
  const {
    TUIMessageInput: PropTUIMessageInput,
    InputPlugins: PropInputPlugins,
    InputQuote: PropInputQuote,
    isTransmitter: propsIsTransmitter,
    className: propsClassName,
  } = props;

  const { TUIMessageInputConfig } = useTUIChatStateContext('TUIMessageInput');

  const className = propsClassName || TUIMessageInputConfig?.className;
  const isTransmitter = propsIsTransmitter || TUIMessageInputConfig?.isTransmitter || false;

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
    <div className={`tui-message-input ${className}`}>
      <TUIMessageInputProvider {...props}>
        <Forward />
        <InputQuote />
        <div className="tui-message-input-main">
          <div className="tui-message-input-box">
            <InputPlugins />
            <Input />
          </div>
          {isTransmitter && <Transmitter />}
        </div>
      </TUIMessageInputProvider>
    </div>
  );
}
export const MessageInput = React.memo(UnMemoizedMessageInput) as
typeof UnMemoizedMessageInput;
