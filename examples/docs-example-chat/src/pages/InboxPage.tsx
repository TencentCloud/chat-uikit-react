import { useEffect, useState, useRef } from 'react';
import { TUIChatEngine, TUIStore, StoreName, TUIConversationService, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { useLocation } from 'react-router-dom';
import { setPlatform } from '@tencentcloud/chat-uikit-react';
import { Inbox } from '@/components/Inbox';
import { reportEvent, REPORT_KEY } from '@/utils/aegis';

import '@/styles/index.scss';
import '@/styles/inbox.scss';

export default function InboxPage() {
  const [currentTab, setCurrentTab] = useState<'web' | 'mobile'>('web');
  const [currentLanguage] = useState<string>('en');
  const [currentConversationID, setCurrentConversationID] = useState<string>('');
  const [lastConversationID, setLastConversationID] = useState<string>('');
  const isFirstRender = useRef<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    TUIStore.watch(StoreName.CONV, {
      conversationList: onConversationListUpdated,
      currentConversationID: onCurrentConversationIDUpdated,
    });
    return () => {
      TUIStore.unwatch(StoreName.CONV, {
        conversationList: onConversationListUpdated,
        currentConversationID: onCurrentConversationIDUpdated,
      });
    };
  }, []);

  function onCurrentConversationIDUpdated(conversationID: string) {
    setCurrentConversationID(conversationID);
  }

  function onConversationListUpdated(conversationList: IConversationModel[]) {
    if (isFirstRender.current) {
      return;
    }
    // default open first group chat
    const firstGroupChat = conversationList.find((item: IConversationModel) => item.type === TUIChatEngine.TYPES.CONV_GROUP);
    if (firstGroupChat && firstGroupChat.conversationID) {
      TUIConversationService.switchConversation(firstGroupChat.conversationID);
      isFirstRender.current = true;
    }
  }

  const onSwitchEnv = (env: 'web' | 'mobile') => {
    setCurrentTab(env);
    setPlatform(env === 'mobile' ? 'h5' : 'pc');
    if (currentTab === 'web' && env === 'mobile' && currentConversationID) {
      setLastConversationID(currentConversationID);
      TUIConversationService.switchConversation('');
    } else if (currentTab === 'mobile' && env === 'web' && lastConversationID) {
      TUIConversationService.switchConversation(lastConversationID);
    }
    reportEvent({ actionKey: REPORT_KEY[`SWITCH_TO_${env === 'mobile' ? 'MOBILE' : 'WEB'}`], fromPath: pathname });
  };

  return (
    <div className="iframe-container">
      <div className="switch-container">
        <div className={`switch-button ${currentTab === 'web' ? 'switch-button-active' : null}`} onClick={() => onSwitchEnv('web')}>WEB</div>
        <div className={`switch-button ${currentTab === 'mobile' ? 'switch-button-active' : null}`} onClick={() => onSwitchEnv('mobile')}>MOBILE</div>
      </div>
      <div className="chat-container">
        <div className={`inbox-container inbox-container-${currentTab}`}>
          <Inbox language={currentLanguage} currentEnv={currentTab} currentConversationID={currentConversationID} />
        </div>
      </div>
    </div>
  );
}
