import React, { PropsWithChildren } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { useTranslation } from 'react-i18next';
import { JSONStringToParse } from '../utils';
import { isCallMessage } from './utils';
import type { MessageContextProps } from './MessageText';
import { useComponentContext, useTUIChatActionContext } from '../../context';
import { useUIManager } from '../../context';
import { CallMessage } from '@tencentcloud/call-uikit-react';
import { startCall } from '../Chat/utils';

function MessageCustomWithContext<T extends MessageContextProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;
  const { t } = useTranslation();
  const { callButtonClicked } = useTUIChatActionContext('TUIChat');
  const { MessageCustomPlugins } = useComponentContext('MessageCustom');
  const { conversation } = useUIManager('MessageCustom');
  const handleContext = (data: any) => {
    if (data.data === 'Hyperlink') {
      const extension = JSONStringToParse(data?.extension);
      if (extension?.item) {
        return extension?.item.map((item: any) => <a target="_blank" key={item.value} href={item.value} rel="noreferrer">{item.value}</a>);
      }
      if (extension?.hyperlinks_text) {
        const hyperlinks = extension.hyperlinks_text;
        return (
          <>
            {extension.title}
            {' '}
            <a target="_blank" key={hyperlinks?.value} href={hyperlinks?.value} rel="noreferrer">{hyperlinks.key}</a>
          </>
        );
      }
    }
    if (data.data === 'group_create') {
      return `${message?.nick || message?.from} Create a group`;
    }
    const botMessage = JSONStringToParse(data.data);
    if (botMessage?.chatbotPlugin === 1 && botMessage?.src === 15 && (botMessage?.subtype === 'welcome_msg' || botMessage?.subtype === 'clarify_msg')) {
      return (
        // eslint-disable-next-line
        // @ts-ignore
        <MessageCustomPlugins data={JSONStringToParse(data.data).content} />
      );
    }

    if (conversation?.type === 'C2C' && message && isCallMessage(message)) {
      const callType = conversation?.type;
      const userID = conversation?.userProfile.userID;
      return (
        <CallMessage
          callType={callType}
          message={message}
          onClick={({ callMediaType }: any) =>
            startCall({ callType, callMediaType, userIDList: [userID], callButtonClicked })}
        >
        </CallMessage>
      );
    }

    return `[${t('TUIChat.Custom message')}]`;
  };

  return (
    <div className={`bubble message-custom bubble-${message?.flow}  ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`}>
      {handleContext(context?.custom)}
      {children}
    </div>
  );
}

const MemoizedMessageCustom = React.memo(MessageCustomWithContext) as
typeof MessageCustomWithContext;

export function MessageCustom(props: MessageContextProps): React.ReactElement {
  return (
    <MemoizedMessageCustom {...props} />
  );
}
