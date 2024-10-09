import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
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

  const { uploadPendingMessageList } = useTUIChatStateContext('MessageProgressWithContext');
  const { isShowProgress: contextIsShow = false, Progress: contextProgress } = useTUIMessageContext('MessageProgressWithContext');

  const Progress = propsProgress || contextProgress;
  const isShow = propsIsShow || contextIsShow;

  const handleLoading = () => !!((
    message?.type === TencentCloudChat.TYPES.MSG_IMAGE
    || message?.type === TencentCloudChat.TYPES.MSG_VIDEO
    || message?.type === TencentCloudChat.TYPES.MSG_FILE
  ) && message?.status === MESSAGE_STATUS.UNSEND);

  useEffect(() => {
    if (uploadPendingMessageList && uploadPendingMessageList.length > 0) {
      uploadPendingMessageList.map((item:MessageProgressItem) => {
        if (item?.ID === message?.ID) {
          setProgressMessage(item);
          item?.progress && setProgress(item.progress);
        }
        return item;
      });
    }
  }, [uploadPendingMessageList]);

  if (!isShow) {
    return <></>;
  }

  if (Progress && progressMessage) {
    return <Progress message={progressMessage} />;
  }
  // eslint-disable-next-line
  // @ts-ignore
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
