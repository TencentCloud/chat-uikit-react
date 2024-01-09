import React, { PropsWithChildren } from 'react';
import { ChatSDK, Conversation } from '@tencentcloud/chat';
import { useTUIKit } from './hooks/useTUIKit';
import { useCreateTUIKitContext } from './hooks/useCreateTUIKitContext';
import { TUIKitProvider } from '../../context/TUIKitContext';
import './styles/index.scss';
import { TUIConversation } from '../TUIConversation';
import { TUIChat } from '../TUIChat';
import { TUIManage } from '../TUIManage';
import '../../locales/index';

export interface ChatProps {
  chat?: ChatSDK | null,
  language?: string,
  customClasses?: unknown,
  activeConversation?: Conversation,
}
export function TUIKit<
  T extends ChatProps
  >(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    children, chat, customClasses, activeConversation, language,
  } = props;
  (window as any).tencent_cloud_im_csig_react_uikit_23F_xa = true;
  const {
    conversation,
    contactData,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  } = useTUIKit({ chat, activeConversation, language });
  const chatContextValue = useCreateTUIKitContext({
    chat,
    language,
    conversation,
    contactData,
    setActiveConversation,
    customClasses,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  });

  return (
    <TUIKitProvider value={chatContextValue}>
      <div className="tui-kit">
        {children || (
          <>
            <TUIConversation />
            <TUIChat />
            <TUIManage />
          </>
        )}
      </div>
    </TUIKitProvider>
  );
}
