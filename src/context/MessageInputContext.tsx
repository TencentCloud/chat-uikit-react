import React, {
  PropsWithChildren,
  ChangeEventHandler,
  useContext,
  KeyboardEventHandler,
  MutableRefObject,
} from 'react';
import { PluginConfigProps } from '../components';
import type { ICursorPos } from '../components/MessageInput/hooks';
import type { EmojiData } from '../components/MessageInput/hooks/useEmojiPicker';
import type { filesData } from '../components/MessageInput/hooks/useUploadPicker';
import type { MESSAGE_TYPE_NAME } from '../constants';

interface dispatchParams {
  type: string;
  value?: string;
}
export interface TUIMessageInputContextValue {
  text?: string;
  disabled?: boolean;
  dispatch?: (params: dispatchParams) => void;
  handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit?: (event: React.BaseSyntheticEvent) => void;
  handleKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  onSelectEmoji?: (emoji: EmojiData) => void;
  sendFaceMessage?: (emoji: EmojiData) => void;
  sendUploadMessage?: (file: filesData, type: MESSAGE_TYPE_NAME) => void;
  insertText?: (textToInsert: string) => void;
  setText?: (textToInsert: string) => void;
  focus?: boolean;
  handlePasete?: (e: ClipboardEvent) => void;
  setCursorPos?: (e: ICursorPos) => void;
  pluginConfig?: PluginConfigProps;
}

export const TUIMessageInputContext = React.createContext<TUIMessageInputContextValue>({});
export function TUIMessageInputContextProvider({ children, value }: PropsWithChildren<{
  value: TUIMessageInputContextValue;
}>): React.ReactElement {
  return (
    <TUIMessageInputContext.Provider value={value}>
      {children}
    </TUIMessageInputContext.Provider>
  );
}

export function useTUIMessageInputContext(componentName?: string): TUIMessageInputContextValue {
  const contextValue = useContext(TUIMessageInputContext);
  if (!contextValue && componentName) {
    return {} as TUIMessageInputContextValue;
  }
  return (contextValue as unknown) as TUIMessageInputContextValue;
}
