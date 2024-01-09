import React, {
  PropsWithChildren, useMemo,
} from 'react';
import { Message } from '@tencentcloud/chat';
import { UnknowPorps, useTUIKitContext } from '../../../context';
import { TUIMessageProps } from '../../TUIMessage/TUIMessage';
import { getTimeStamp } from '../../untils';

interface MessageListElementProps {
  enrichedMessageList: Array<Message>;
  TUIMessage?: React.ComponentType<TUIMessageProps | UnknowPorps>,
  intervalsTimer?: number
}

function useMessageListElement <T extends MessageListElementProps>(
  props: PropsWithChildren<T>,
) {
  const {
    enrichedMessageList,
    TUIMessage,
    intervalsTimer,
  } = props;
  const { language } = useTUIKitContext('TUIConversation');

  return useMemo(() => enrichedMessageList?.map((item: Message, index:number) => {
    const key = `${item.ID}-${index}`;
    const preMessageTImer = index > 0 ? enrichedMessageList[index - 1]?.time : -1;
    const currrentTimer = item?.time || 0;
    const isShowIntervalsTimer = preMessageTImer !== -1
      ? (currrentTimer - preMessageTImer) >= intervalsTimer : false;
    return (
      <li className="message-list-item" key={key}>
        {
         isShowIntervalsTimer && <div className="message-list-time" key={`${currrentTimer + index}`}>{currrentTimer ? getTimeStamp(currrentTimer * 1000, language) : 0}</div>
        }
        <TUIMessage message={item} />
      </li>
    );
  }), [enrichedMessageList]);
}

export default useMessageListElement;
