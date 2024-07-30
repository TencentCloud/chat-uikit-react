import { ChatSDK } from '@tencentcloud/chat';
import { InboxMobile } from '@/components/InboxMobile';
import { InboxWeb } from '@/components/InboxWeb';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

export interface IInboxProps {
  chat?: ChatSDK;
  language?: string;
  customClasses?: string;
  currentConversationID?: string;
  currentEnv?: 'web' | 'mobile';
}

export function Inbox({ chat, language, customClasses, currentConversationID, currentEnv }: IInboxProps) {
  return currentEnv === 'mobile'
    ? (
        <InboxMobile
          chat={chat}
          language={language}
          customClasses={customClasses}
          currentConversationID={currentConversationID}
        />
      )
    : (
        <InboxWeb
          chat={chat}
          language={language}
          customClasses={customClasses}
          currentConversationID={currentConversationID}
        />
      );
}
