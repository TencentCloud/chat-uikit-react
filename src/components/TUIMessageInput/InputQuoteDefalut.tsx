import React, { PropsWithChildren, useCallback } from 'react';
import './styles/index.scss';

import { Message } from 'tim-js-sdk';
import { useTUIChatActionContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import { MESSAGE_OPERATE } from '../../constants';
import { useHandleQuoteMessage } from './hooks/useHandleQuoteMessage';

interface InputQuoteProps {
  message?: Message
}

export function InputQuoteDefalut <T extends InputQuoteProps>(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { operateMessage } = useTUIChatActionContext('MessageRevokeWithContext');
  const { cloudCustomData } = useHandleQuoteMessage(message);

  const handleClose = useCallback(() => {
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: null,
    });
  }, [operateMessage]);

  const context = cloudCustomData?.messageReply;

  return context && (
    <div className="input-quote">
      <div className="input-quote-content">
        <label htmlFor="input-quote-content">{message?.nick || message?.from}</label>
        <span>{context?.messageAbstract}</span>
      </div>
      <Icon className="icon" width={12} height={12} type={IconTypes.CLOSE} onClick={handleClose} />
    </div>
  );
}
