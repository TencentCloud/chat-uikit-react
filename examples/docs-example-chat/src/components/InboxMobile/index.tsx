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

export interface IInboxMobileProps {
  chat?: ChatSDK;
  language?: string;
  customClasses?: string;
  currentConversationID?: string;
  currentEnv?: 'web' | 'mobile';
}

export function InboxMobile({ chat, language, customClasses, currentConversationID }: IInboxMobileProps) {
  return (
    <TUIKit chat={chat} language={language} customClasses={customClasses}>
      {!currentConversationID && (
        <>
          <TUIProfile />
          <TUIConversation />
        </>
      )}
      {currentConversationID && (
        <>
          <TUIChat>
            <TUIChatHeader />
            <TUIMessageList />
            <TUIMessageInput />
          </TUIChat>
          <TUIManage></TUIManage>
        </>
      )}
    </TUIKit>
  );
}
