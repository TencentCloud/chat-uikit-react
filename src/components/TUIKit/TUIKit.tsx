import React, { PropsWithChildren } from 'react';
import { ChatSDK, Conversation } from 'tim-js-sdk';
import { useTUIKit } from './hooks/useTUIKit';
import { useCreateTUIKitContext } from './hooks/useCreateTUIKitContext';
import { TUIKitProvider } from '../../context/TUIKitContext';
import './styles/index.scss';
import { TUIConversation } from '../TUIConversation';
import { TUIChat } from '../TUIChat';
import { TUIManage } from '../TUIManage';

export interface ChatProps {
  tim?: ChatSDK | null,
  customClasses?: unknown,
  activeConversation?: Conversation,
}
export function TUIKit<
  T extends ChatProps
  >(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    children, tim, customClasses, activeConversation,
  } = props;
  (window as any).tencent_cloud_im_csig_react_uikit_23F_xa = true;
  const {
    conversation,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
  } = useTUIKit({ tim, activeConversation });
  const chatContextValue = useCreateTUIKitContext({
    tim,
    conversation,
    setActiveConversation,
    customClasses,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
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
