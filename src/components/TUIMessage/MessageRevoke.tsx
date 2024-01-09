import React, { PropsWithChildren, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TencentCloudChat from '@tencentcloud/chat';
import { MESSAGE_FLOW, MESSAGE_OPERATE } from '../../constants';
import { useTUIChatActionContext } from '../../context';
import type { MessageContextProps } from './MessageText';

function MessageRevokeWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;
  const { t } = useTranslation();
  const { operateMessage } = useTUIChatActionContext('MessageRevokeWithContext');

  const handleRevoke = useCallback(() => {
    operateMessage({
      [MESSAGE_OPERATE.REVOKE]: message,
    });
  }, [operateMessage]);

  return (
    <div className="bubble message-system message-revoke">
      {
        message?.flow === MESSAGE_FLOW.IN && <span>{message?.nick || message?.from}</span>
      }
      {
        message?.flow !== MESSAGE_FLOW.IN && <span>{t('TUIChat.You')}</span>
      }
      <span>{t('TUIChat.recalled a message')}</span>
      {
        message?.flow === MESSAGE_FLOW.OUT
        && message?.type === TencentCloudChat.TYPES.MSG_TEXT
        && <span className="edit" role="button" tabIndex={0} onClick={handleRevoke}>{t('TUIChat.Re-edit')}</span>
      }
    </div>
  );
}

const MemoizedMessageRevoke = React.memo(MessageRevokeWithContext) as
typeof MessageRevokeWithContext;

export function MessageRevoke(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageRevoke {...props} />
  );
}
