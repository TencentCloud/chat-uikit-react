import React, {
  PropsWithChildren, useMemo,
} from 'react';
import { Message } from '@tencentcloud/chat';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { UnknowPorps } from '../../../context';
import { TUIMessageProps } from '../../MessageElement/Message';
import { getTimeStamp } from '../../utils';

interface MessageListElementProps {
  enrichedMessageList: Message[];
  TUIMessage?: React.ComponentType<TUIMessageProps | UnknowPorps>;
  intervalsTimer?: number;
}

function useMessageListElement<T extends MessageListElementProps>(
  props: PropsWithChildren<T>,
) {
  const {
    enrichedMessageList,
    TUIMessage,
    intervalsTimer,
  } = props;
  const { language } = useUIKit();

  return useMemo(() => enrichedMessageList?.map((item: Message, index: number) => {
    const key = `${item.ID}-${index}`;
    const preMessageTImer = index > 0 ? enrichedMessageList[index - 1]?.time : -1;
    const currrentTimer = item?.time || 0;
    const isShowIntervalsTimer = intervalsTimer && preMessageTImer !== -1
      ? (currrentTimer - preMessageTImer) >= intervalsTimer
      : false;
    return (
      <li className="message-list-item" key={key}>
        {
          isShowIntervalsTimer && (
            <div className="message-list-time" key={`${currrentTimer + index}`}>
              {currrentTimer ? getTimeStamp(currrentTimer * 1000, language) : 0}
            </div>
          )
        }
        {/* // eslint-disable-next-line
        // @ts-ignore */}
        <TUIMessage message={item} />
      </li>
    );
  }), [enrichedMessageList]);
}

export default useMessageListElement;
