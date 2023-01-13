import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { MESSAGE_STATUS } from '../../constants';
import { useTUIChatStateContext, useTUIMessageContext } from '../../context';

export interface MessageProgressProps {
  message?: Message,
  className?: string,
  Progress?: React.ComponentType<{message: Message}>,
  isShow?: boolean,
}

interface MessageProgressItem extends Message {
  progress?: number,
}

function MessageProgressWithContext <T extends MessageProgressProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    children,
    Progress: propsProgress,
    isShow: propsIsShow = false,
  } = props;

  const [progressMessage, setProgressMessage] = useState<Message>();
  const [progress, setProgress] = useState<number>(0);

  const { uploadPenddingMessageList } = useTUIChatStateContext('MessageProgressWithContext');
  const { isShowProgress: contextIsShow = false, Progress: contextProgress } = useTUIMessageContext('MessageProgressWithContext');

  const Progress = propsProgress || contextProgress;
  const isShow = propsIsShow || contextIsShow;

  const handleLoading = () => !!((
    message?.type === TIM.TYPES.MSG_IMAGE
    || message?.type === TIM.TYPES.MSG_VIDEO
    || message?.type === TIM.TYPES.MSG_FILE
  ) && message?.status === MESSAGE_STATUS.UNSEND);

  useEffect(() => {
    if (uploadPenddingMessageList && uploadPenddingMessageList.length > 0) {
      uploadPenddingMessageList.map((item:MessageProgressItem) => {
        if (item?.ID === message?.ID) {
          setProgressMessage(item);
          setProgress(item?.progress);
        }
        return item;
      });
    }
  }, [uploadPenddingMessageList]);

  if (!isShow) {
    return null;
  }

  if (Progress) {
    return <Progress message={progressMessage} />;
  }

  return handleLoading() && (
    <div className="progress-box">
      <span
        className="progress"
        style={
        {
          width: `${progress * 100}%`,
        }
      }
      />
      {children}
    </div>
  );
}

const MemoizedMessageProgress = React.memo(MessageProgressWithContext) as
typeof MessageProgressWithContext;

export function MessageProgress(props:MessageProgressProps):React.ReactElement {
  return (
    <MemoizedMessageProgress {...props} />
  );
}
