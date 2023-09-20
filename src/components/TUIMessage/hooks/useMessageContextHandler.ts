import TencentCloudChat, { Message } from '@tencentcloud/chat';
import {
  handleAudioMessageShowContext,
  handleCustomMessageShowContext,
  handleFaceMessageShowContext,
  handleFileMessageShowContext,
  handleImageMessageShowContext,
  handleLocationMessageShowContext,
  handleMergerMessageShowContext,
  handleTextMessageShowContext,
  handleTipMessageShowContext,
  handleVideoMessageShowContext,
  translateGroupSystemNotice,
} from '../utils';

interface messageContextParams {
  message?: Message,
}

export const useMessageContextHandler = <T extends messageContextParams>(params:T) => {
  const {
    message,
  } = params;
  let context;
  if (message) {
    switch (message?.type) {
      case TencentCloudChat.TYPES.MSG_TEXT:
        context = handleTextMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_FACE:
        context = handleFaceMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_IMAGE:
        context = handleImageMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_AUDIO:
        context = handleAudioMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_VIDEO:
        context = handleVideoMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_FILE:
        context = handleFileMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_CUSTOM:
        context = handleCustomMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_MERGER:
        context = handleMergerMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_LOCATION:
        context = handleLocationMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_GRP_TIP:
        context = handleTipMessageShowContext(message);
        break;
      case TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE:
        context = translateGroupSystemNotice(message);
        break;

      default:
        break;
    }
  }

  return {
    context,
    message,
  };
};
