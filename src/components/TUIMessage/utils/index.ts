import TIM, { Conversation, Group, Message } from 'tim-js-sdk';
import { decodeText } from './decodeText';
import constant, { MESSAGE_STATUS } from '../../../constants';
import { JSONStringToParse } from '../../untils';

function t(params:string) {
  const str = params.split('.');
  return str[str.length - 1];
}

// Handling avatars
export function handleAvatar(item: any) {
  let avatar = '';
  switch (item.type) {
    case TIM.TYPES.CONV_C2C:
      avatar = isUrl(item?.userProfile?.avatar)
        ? item?.userProfile?.avatar
        : 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';
      break;
    case TIM.TYPES.CONV_GROUP:
      avatar = isUrl(item?.groupProfile?.avatar)
        ? item?.groupProfile?.avatar
        : 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/im/demo/TUIkit/web/img/constomer.svg';
      break;
    default:
      avatar = isUrl(item?.groupProfile?.avatar)
        ? item?.groupProfile?.avatar
        : 'https://web.sdk.qcloud.com/component/TUIKit/assets/group_avatar.png';
      break;
  }
  return avatar;
}

// Handling names
export function handleName(item: Conversation) {
  let name = '';
  switch (item.type) {
    case TIM.TYPES.CONV_C2C:
      name = item?.userProfile.nick || item?.userProfile?.userID || '';
      break;
    case TIM.TYPES.CONV_GROUP:
      name = item.groupProfile.name || item?.groupProfile?.groupID || '';
      break;
    default:
      name = t('系统通知');
      break;
  }
  return name;
}
// Handle whether there is someone@
export function handleAt(item: any) {
  const List = [
    `[${t('TUIConversation.有人@我')}]`,
    `[${t('TUIConversation.@所有人')}]`,
    `[${t('TUIConversation.@所有人')}][${t('TUIConversation.有人@我')}]`,
  ];
  let showAtType = '';
  for (let index = 0; index < item.groupAtInfoList.length; index += 1) {
    if (item.groupAtInfoList[index].atTypeArray[0] && item.unreadCount > 0) {
      showAtType = List[item.groupAtInfoList[index].atTypeArray[0] - 1];
    }
  }
  return showAtType;
}
// Internal display of processing message box
export function handleShowLastMessage(item: Conversation) {
  const { lastMessage } = item;
  const conversation = item;
  let showNick = '';
  let lastMessagePayload = '';
  // Judge the number of unread messages and display them only
  // when the message is enabled without interruption.
  const showUnreadCount = conversation.unreadCount > 0
    && conversation.messageRemindType === TIM.TYPES.MSG_REMIND_ACPT_NOT_NOTE
    ? t(`[${conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}条]`)
    : '';
  // Determine the lastmessage sender of the group.
  // Namecard / Nick / userid is displayed by priority
  if (conversation.type === TIM.TYPES.CONV_GROUP) {
    if (lastMessage.fromAccount === conversation.groupProfile.selfInfo.userID) {
      showNick = t('TUIConversation.我');
    } else {
      showNick = lastMessage.nameCard || lastMessage.nick || lastMessage.fromAccount;
    }
  }
  // Display content of lastmessage message body
  if (lastMessage.type === TIM.TYPES.MSG_TEXT) {
    lastMessagePayload = lastMessage.payload.text;
  } else {
    lastMessagePayload = lastMessage.messageForShow;
  }

  if (lastMessage.isRevoked) {
    lastMessagePayload = t('TUIChat.撤回了一条消息');
  }

  if (conversation.type === TIM.TYPES.CONV_GROUP && lastMessage.type === TIM.TYPES.MSG_GRP_TIP) {
    return lastMessagePayload;
  }
  // Specific display content of message box
  return `${showUnreadCount}${showNick ? `${showNick}:` : ''}${lastMessagePayload}`;
}

// Handling system tip message display
export function handleTipMessageShowContext(message: Message) {
  const options = {
    message,
    text: '',
  };
  let userName = message.nick || message?.payload?.userIDList.join(',');
  if (message?.payload?.memberList?.length > 0) {
    userName = '';
    message?.payload?.memberList?.map((user: any) => {
      userName += `${user?.nick || user?.userID},`;
      return user;
    });
    userName = userName.slice(0, -1);
  }
  switch (message.payload.operationType) {
    case TIM.TYPES.GRP_TIP_MBR_JOIN:
      options.text = `${userName} ${t('message.tip.加入群组')}`;
      break;
    case TIM.TYPES.GRP_TIP_MBR_QUIT:
      options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.退出群组')}`;
      break;
    case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
      options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.被')}${message.payload.operatorID}${t(
        'message.tip.踢出群组',
      )}`;
      break;
    case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
      options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.成为管理员')}`;
      break;
    case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
      options.text = `${t('message.tip.群成员')}：${userName} ${t('message.tip.被撤销管理员')}`;
      break;
    case TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
      // options.text =  `${userName} 修改群组资料`;
      options.text = handleTipGrpUpdated(message);
      break;
    case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
      message.payload.memberList.map((member:any) => {
        if (member.muteTime > 0) {
          options.text = `${t('message.tip.群成员')}：${member.userID}${t('message.tip.被禁言')}`;
        } else {
          options.text = `${t('message.tip.群成员')}：${member.userID}${t('message.tip.被取消禁言')}`;
        }
        return member;
      });
      break;
    default:
      options.text = `[${t('message.tip.群提示消息')}]`;
      break;
  }
  return options;
}

function handleTipGrpUpdated(message: Message) {
  const { payload } = message;
  const { newGroupProfile } = payload;
  const { operatorID } = payload;
  let text = '';
  const name = Object.keys(newGroupProfile)[0];
  switch (name) {
    case 'muteAllMembers':
      if (newGroupProfile[name]) {
        text = `${t('message.tip.管理员')} ${operatorID} ${t('message.tip.开启全员禁言')}`;
      } else {
        text = `${t('message.tip.管理员')} ${operatorID} ${t('message.tip.取消全员禁言')}`;
      }
      break;
    case 'ownerID':
      text = `${newGroupProfile[name]} ${t('message.tip.成为新的群主')}`;
      break;
    case 'groupName':
      text = `${operatorID} ${t('message.tip.修改群名为')} ${newGroupProfile[name]}`;
      break;
    case 'notification':
      text = `${operatorID} ${t('message.tip.发布新公告')}`;
      break;
    default:
      break;
  }
  return text;
}

// Parsing and handling text message display
export function handleTextMessageShowContext(item: any) {
  const options = {
    text: decodeText(item.payload),
  };
  return options;
}

// Parsing and handling face message display
export function handleFaceMessageShowContext(item: any) {
  const face = {
    message: item,
    name: '',
    url: '',
  };
  face.name = item.payload.data;
  if (item.payload.data.indexOf('@2x') < 0) {
    face.name = `${face.name}@2x`;
  }
  face.url = `https://web.sdk.qcloud.com/im/assets/face-elem/${face.name}.png`;
  return face;
}

// Parsing and handling location message display
export function handleLocationMessageShowContext(item: any) {
  const location: any = {
    lon: '',
    lat: '',
    href: '',
    url: '',
    description: '',
    message: item,
  };
  location.lon = item.payload.longitude.toFixed(6);
  location.lat = item.payload.latitude.toFixed(6);
  location.href = 'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&'
    + `pointx=${location.lon}&pointy=${location.lat}&name=${item.payload.description}`;
  location.url = 'https://apis.map.qq.com/ws/staticmap/v2/?'
    + `center=${location.lat},${location.lon}&zoom=10&size=300*150&maptype=roadmap&`
    + `markers=size:large|color:0xFFCCFF|label:k|${location.lat},${location.lon}&`
    + 'key=UBNBZ-PTP3P-TE7DB-LHRTI-Y4YLE-VWBBD';
  location.description = item.payload.description;
  return location;
}

// Parsing and handling image message display
export function handleImageMessageShowContext(item: any) {
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: item.payload.imageInfoArray[1].url,
    message: item,
  };
}

// Parsing and handling video message display
export function handleVideoMessageShowContext(item: any) {
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item?.progress,
    url: item?.payload?.videoUrl,
    snapshotUrl: item?.payload?.snapshotUrl,
    message: item,
  };
}

// Parsing and handling audio message display
export function handleAudioMessageShowContext(item: any) {
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: item.payload.url,
    message: item,
    second: item.payload.second,
  };
}

// Parsing and handling file message display
export function handleFileMessageShowContext(item: any) {
  let size = '';
  if (item.payload.fileSize >= 1024 * 1024) {
    size = `${(item.payload.fileSize / (1024 * 1024)).toFixed(2)} Mb`;
  } else if (item.payload.fileSize >= 1024) {
    size = `${(item.payload.fileSize / 1024).toFixed(2)} Kb`;
  } else {
    size = `${item.payload.fileSize.toFixed(2)}B`;
  }
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: item.payload.fileUrl,
    message: item,
    name: item.payload.fileName,
    size,
  };
}

// Parsing and handling merger message display
export function handleMergerMessageShowContext(item: Message) {
  return { message: item, ...item.payload };
}

// Parse audio and video call messages
export function extractCallingInfoFromMessage(message: Message) {
  let callingmessage:any = {};
  let objectData:any = {};
  try {
    callingmessage = JSONStringToParse(message.payload.data);
  } catch (error) {
    callingmessage = {};
  }
  if (callingmessage.businessID !== 1) {
    return '';
  }
  try {
    objectData = JSONStringToParse(callingmessage.data);
  } catch (error) {
    objectData = {};
  }
  switch (callingmessage.actionType) {
    case 1: {
      if (objectData.call_end >= 0 && !callingmessage.groupID) {
        return `${t('message.custom.talkTime')}：${formatTime(objectData.call_end)}`;
      }
      if (callingmessage.groupID) {
        return `${t('message.custom.groupCallEnd')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.all')}`;
    }
    case 2:
      return `${t('message.custom.cancel')}`;
    case 3:
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.accepted')}`;
    case 4:
      return `${t('message.custom.rejected')}`;
    case 5:
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.noResp')}`;
    default:
      return '';
  }
}

// Parsing and handling custom message display
export function handleCustomMessageShowContext(item: Message) {
  return {
    message: item,
    custom: extractCallingInfoFromMessage(item) || item?.payload || `[${t('message.custom.custom')}]`,
  };
}

// Parsing and handling system message display
export function translateGroupSystemNotice(message: Message) {
  const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID;
  switch (message.payload.operationType) {
    case 1:
      return `${message.payload.operatorID} ${t('message.tip.申请加入群组')}：${groupName}`;
    case 2:
      return `${t('message.tip.成功加入群组')}：${groupName}`;
    case 3:
      return `${t('message.tip.申请加入群组')}：${groupName} ${t('message.tip.被拒绝')}`;
    case 4:
      return `${t('message.tip.你被管理员')}${message.payload.operatorID} ${t('message.tip.踢出群组')}：${groupName}`;
    case 5:
      return `${t('message.tip.群')}：${groupName} ${t('message.tip.被')} ${message.payload.operatorID} ${t(
        'message.tip.解散',
      )}`;
    case 6:
      return `${message.payload.operatorID} ${t('message.tip.创建群')}：${groupName}`;
    case 7:
      return `${message.payload.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
    case 8:
      return `${t('message.tip.你退出群组')}：${groupName}`;
    case 9:
      return `${t('message.tip.你被')}${message.payload.operatorID} ${t('message.tip.设置为群')}：${groupName} ${t(
        'message.tip.的管理员',
      )}`;
    case 10:
      return `${t('message.tip.你被')}${message.payload.operatorID} ${t('message.tip.撤销群')}：${groupName} ${t(
        'message.tip.的管理员身份',
      )}`;
    case 12:
      return `${message.payload.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
    case 13:
      return `${message.payload.operatorID} ${t('message.tip.同意加群')}：${groupName}`;
    case 14:
      return `${message.payload.operatorID} ${t('message.tip.拒接加群')}：${groupName}`;
    case 255:
      return `${t('message.tip.自定义群系统通知')}: ${message.payload.userDefinedField}`;
    default:
      return '';
  }
}

// Image loading complete
export function getImgLoad(container: Document, className: string, callback: () => void) {
  const images = container?.querySelectorAll(`.${className}`) || [];
  const promiseList = Array.prototype.slice.call(images).map(
    (node: HTMLImageElement) => new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = node.src;
      loadImg.onload = () => {
        resolve(node);
      };
    }),
  );

  Promise.all(promiseList)
    .then(() => {
      callback();
    })
    .catch((e) => {
      console.error('网络异常', e);
    });
}

// Determine whether it is url
export function isUrl(url: string) {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
}

// Handling custom message options
export function handleOptions(businessID: string, version: number, other: Message) {
  return {
    businessID,
    version,
    ...other,
  };
}

// Determine if it is a typing message
export function isTypingMessage(item: Message) {
  if (!item) return false;
  try {
    const { businessID } = JSONStringToParse(item?.payload?.data);
    if (businessID === constant.TYPE_TYPING) return true;
  } catch {
    return false;
  }
  return false;
}

export function formatTime(secondTime:number) {
  const time:number = secondTime;
  let newTime; let hour; let minite; let seconds;
  if (time >= 3600) {
    hour = parseInt(`${time / 3600}`, 10) < 10 ? `0${parseInt(`${time / 3600}`, 10)}` : parseInt(`${time / 3600}`, 10);
    minite = parseInt(`${(time % 60) / 60}`, 10) < 10 ? `0${parseInt(`${(time % 60) / 60}`, 10)}` : parseInt(`${(time % 60) / 60}`, 10);
    seconds = time % 3600 < 10 ? `0${time % 3600}` : time % 3600;
    if (seconds > 60) {
      minite = parseInt(`${seconds / 60}`, 10) < 10 ? `0${parseInt(`${seconds / 60}`, 10)}` : parseInt(`${seconds / 60}`, 10);
      seconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
    }
    newTime = `${hour}:${minite}:${seconds}`;
  } else if (time >= 60 && time < 3600) {
    minite = parseInt(`${time / 60}`, 10) < 10 ? `0${parseInt(`${time / 60}`, 10)}` : parseInt(`${time / 60}`, 10);
    seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
    newTime = `00:${minite}:${seconds}`;
  } else if (time < 60) {
    seconds = time < 10 ? `0${time}` : time;
    newTime = `00:00:${seconds}`;
  }
  return newTime;
}
