import React from 'react';
import './ChatDefaultContent.scss';
import logoIcon from "../assets/image/logo.svg";
import { useUIKit } from '@tencentcloud/chat-uikit-react';

const ChatDefaultContent: React.FC = () => {
  const { t } = useUIKit();
  return (
    <div className="welcome">
      <div className="welcome-title">
        {t('Welcome')}
        <img className='logo' src={logoIcon} alt="" />
        {t('Chat')}
      </div>
      <div className="welcome-content">
        {t('We provide a Sample Friend and a Sample Customer Service Group by default, so that you can fully try out all the features of one-to-one chat and group chat of Tencent Cloud Chat without adding additional friends or groups.')}
        <br />
        {t('You can log in and try out anytime and anywhere.')}
      </div>
    </div>
  );
};

export default ChatDefaultContent;
