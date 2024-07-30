import { ChatSDK } from '@tencentcloud/chat';
import {
  TUIKit,
  TUIChat,
  TUIChatHeader,
  TUIMessageList,
  TUIMessageInput,
  TUIProfile,
  TUIConversation,
  TUIManage,
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

export interface IInboxWebProps {
  chat?: ChatSDK;
  language?: string;
  customClasses?: string;
  currentConversationID?: string;
  currentEnv?: 'web' | 'mobile';
}

export function InboxWeb({ chat, language, customClasses }: IInboxWebProps) {
  return (
    <TUIKit chat={chat} language={language} customClasses={customClasses}>
      <div className="sample-chat-left-container">
        <TUIProfile className="sample-chat-profile" />
        <TUIConversation />
      </div>
      <TUIChat>
        <TUIChatHeader />
        <TUIMessageList />
        <TUIMessageInput />
      </TUIChat>
      <TUIManage></TUIManage>
    </TUIKit>
  );
}
