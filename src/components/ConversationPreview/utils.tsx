import TUIChatEngine, { IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { Conversation, Profile } from '@tencentcloud/chat';
import { defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { transformTextWithEmojiKeyToName } from '../MessageElement/utils/decodeText';

interface IMessageProfile {
  name?: string;
  nick?: string;
  groupID?: string;
  userID?: string;
  avatar?: string;
}

export const generateHighlightTitle = (
  conversation: IConversationModel,
  highlightMatchString?: string,
): Array<{ text: string; isHighlight: boolean }> => {
  const titleString = conversation.getShowName();
  if (!highlightMatchString) return [{ text: titleString, isHighlight: false }];
  const matchLowerCaseString = highlightMatchString.toLowerCase();
  const titleList = titleString.split(new RegExp(`(${highlightMatchString})`, 'gi'))
    .map((item: string) => { return { text: item, isHighlight: item.toLowerCase() === matchLowerCaseString }; });
  return titleList;
};

export const getLatestMessagePreview = (
  conversation: IConversationModel,
  myProfile?: Profile,
) => {
  const { lastMessage, type } = conversation;
  if (!lastMessage) {
    return '';
  }
  const {
    fromAccount, nick, nameCard, isRevoked,
  } = lastMessage;
  let { messageForShow } = lastMessage;
  if (lastMessage.type === TUIChatEngine.TYPES.MSG_CUSTOM && lastMessage.payload?.description) {
    messageForShow = lastMessage.payload.description;
  }
  let from = '';
  switch (type) {
    case TUIChatEngine.TYPES.CONV_GROUP:
      from = lastMessage?.fromAccount === myProfile?.userID ? 'You' : `${nameCard || nick || fromAccount || ''}`;
      from = `${from ? `${from}:` : ''}`;
      break;
    case TUIChatEngine.TYPES.CONV_C2C:
      from = isRevoked ? 'you ' : '';
      break;
    default:
  }
  return (
    <div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    >
      <span>{from}</span>
      <span>{lastMessage.isRevoked ? 'recalled a message' : transformTextWithEmojiKeyToName(messageForShow)}</span>
    </div>
  );
};

// The following is compatible with old versions
export const getMessageProfile = (conversation: IConversationModel | Conversation): IMessageProfile => {
  // eslint-disable-next-line
  // @ts-ignore
  if (!conversation) return null;
  let result: IMessageProfile = {};
  const { type, groupProfile, userProfile } = conversation;
  switch (type) {
    case TUIChatEngine.TYPES.CONV_C2C:
      result = userProfile;
      break;
    case TUIChatEngine.TYPES.CONV_GROUP:
      result = groupProfile;
      break;
    default:
      break;
  }
  return result;
};

export const getDisplayTitle = (
  conversation: IConversationModel,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  const {
    name, nick, groupID, userID,
  } = getMessageProfile(conversation);
  const { type, remark } = conversation;
  let title = '';
  switch (type) {
    case TUIChatEngine.TYPES.CONV_C2C:
      title = remark || nick || userID || '';
      break;
    case TUIChatEngine.TYPES.CONV_GROUP:
      title = name || groupID || '';
      break;
    default:
      title = '';
  }
  const handleTitle = (str: string) => {
    const tempStr = str.toLocaleLowerCase();
    const pos = searchValue && tempStr.indexOf(searchValue.toLocaleLowerCase());
    const titleList = str.split(new RegExp(`(${searchValue})`, 'gi'));
    if (pos === '') return <></>;
    return (
      <div>
        {searchValue && titleList.map((textItem: string, index: number) =>
          (textItem.toLowerCase() === searchValue.toLowerCase())
            ? (
                <span key={index} style={{ color: highlightColor }}>{textItem}</span>
              )
            : (
                <span key={index}>{textItem}</span>
              ),
        )}
        ;
      </div>
    );
  };
  return !searchValue ? title : handleTitle(title);
};

export const getDisplayImage = (conversation: IConversationModel) => {
  const { type } = conversation;
  const { avatar } = getMessageProfile(conversation);
  let displayImage = avatar;
  if (!avatar) {
    switch (type) {
      case TUIChatEngine.TYPES.CONV_C2C:
        displayImage = defaultUserAvatar;
        break;
      case TUIChatEngine.TYPES.CONV_GROUP:
        displayImage = defaultGroupAvatarWork;
        break;
      default:
        displayImage = defaultGroupAvatarWork;
    }
  }
  return displayImage;
};
