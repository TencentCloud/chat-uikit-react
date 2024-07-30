import { ChatSDK } from '@tencentcloud/chat';

export interface boxProps {
  chat?: ChatSDK;
  language?: string;
  customClasses?: string;
  currentConversationID?: string;
  currentEnv?: 'web' | 'mobile';
}
