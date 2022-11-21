import TIM, { Message } from 'tim-js-sdk';
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
      case TIM.TYPES.MSG_TEXT:
        context = handleTextMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_FACE:
        context = handleFaceMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_IMAGE:
        context = handleImageMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_AUDIO:
        context = handleAudioMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_VIDEO:
        context = handleVideoMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_FILE:
        context = handleFileMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_CUSTOM:
        context = handleCustomMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_MERGER:
        context = handleMergerMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_LOCATION:
        context = handleLocationMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_GRP_TIP:
        context = handleTipMessageShowContext(message);
        break;
      case TIM.TYPES.MSG_GRP_SYS_NOTICE:
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
