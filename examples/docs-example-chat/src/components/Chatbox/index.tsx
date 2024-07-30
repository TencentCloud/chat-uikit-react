import { ChatSDK } from '@tencentcloud/chat';
import {
  TUIKit,
  TUIChat,
  TUIChatHeader,
  TUIMessageList,
  TUIMessageInput,
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

export interface IChatboxProps {
  chat?: ChatSDK;
  language?: string;
  customClasses?: string;
  currentConversationID?: string;
  currentEnv?: 'web' | 'mobile';
}

export function Chatbox({ chat, language, customClasses }: IChatboxProps) {
  return (
    <TUIKit chat={chat} language={language} customClasses={customClasses}>
      <TUIChat>
        <TUIChatHeader />
        <TUIMessageList />
        <TUIMessageInput />
      </TUIChat>
    </TUIKit>
  );
}
