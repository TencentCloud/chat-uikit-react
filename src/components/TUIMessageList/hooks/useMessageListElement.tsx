import React, {
  PropsWithChildren, useMemo,
} from 'react';
import { Message } from 'tim-js-sdk';
import { UnknowPorps } from '../../../context';
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

  return useMemo(() => enrichedMessageList?.map((item: Message, index:number) => {
    const key = `${JSON.stringify(item)}${index}`;
    const preMessageTImer = index > 0 ? enrichedMessageList[index - 1]?.time : -1;
    const currrentTimer = item?.time || 0;
    const isShowIntervalsTImer = preMessageTImer !== -1
      ? (currrentTimer - preMessageTImer) >= intervalsTimer : false;
    return (
      <>
        {
         isShowIntervalsTImer && <div className="message-list-time" key={`${currrentTimer + index}`}>{currrentTimer ? getTimeStamp(currrentTimer * 1000) : 0}</div>
       }
        <li className="message-list-item" key={key}>
          <TUIMessage message={item} key={key} />
        </li>

      </>
    );
  }), [enrichedMessageList]);
}

export default useMessageListElement;
