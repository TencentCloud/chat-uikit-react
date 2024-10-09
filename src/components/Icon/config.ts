import IconMoreUrl from './images/more.png';
import IconClearUrl from './images/clear.png';
import IconSearchUrl from './images/search.png';
import IconBackUrl from './images/back.png';
import IconEmojiUrl from './images/emoji.png';
import IconProgressUrl from './images/progress.png';
import IconFileUrl from './images/file.png';
import IconAddUrl from './images/add.png';
import IconImageUrl from './images/image.png';
import IconVideoUrl from './images/video.png';
import IconDocumentUrl from './images/files.png';
import IconStarUrl from './images/star.png';
import IconCopyUrl from './images/copy.png';
import IconDelUrl from './images/del.png';
import IconForwardUrl from './images/forward.png';
import IconReplyUrl from './images/reply.png';
import IconCloseUrl from './images/close.png';
import IconArrowRightUrl from './images/arrow-right.png';
import IconRightUrl from './images/right.png';
import IconEllipseUrl from './images/ellipse.png';
import IconCancelUrl from './images/cancel.png';
import IconArrowDownUrl from './images/arrow-down.png';
import IconEditUrl from './images/edit.png';
import IconConfirmUrl from './images/confirm.png';
import IconCameraUrl from './images/camera.png';
import IconQuoteUrl from './images/quote.png';
import IconRevocationUrl from './images/revocation.png';
import IconEffortUrl from './images/effort.png';
import IconCryUrl from './images/cry.png';
import IconSendUrl from './images/send.png';
import IconOwnerUrl from './images/owner.png';
import IconLivingUrl from './images/living.png';
import IconMemberUrl from './images/member.png';
import IconLikerUrl from './images/like.png';
import IconUnlikeUrl from './images/unlike.png';
import IconLikedUrl from './images/liked.png';
import IconUnlikedUrl from './images/unliked.png';
import IconUnionUrl from './images/union.png';
import IconUnunionUrl from './images/ununion.png';
import IconVectorUrl from './images/vector.png';
import IconUnvectorUrl from './images/unvector.png';
import IconVoiceUrl from './images/voice.png';
import IconAddCircleUrl from './images/add-friend.svg';
import IconMuteUrl from './images/mute.svg';
import IconVideoCallUrl from './images/video-call.svg';
import IconVoiceCallUrl from './images/voice-call.svg';

import { IconTypes } from './type';

interface IconConfigItem {
  url: string;
  className: string;
}

interface IconConfig {
  [propName: string]: IconConfigItem;
}

export const ICON_CONFIG: IconConfig = {
  [IconTypes.MORE]: {
    url: IconMoreUrl,
    className: 'tui-kit-icon-more',
  },
  [IconTypes.CREATE]: {
    url: IconAddCircleUrl,
    className: 'tui-kit-icon-create',
  },
  [IconTypes.CLEAR]: {
    url: IconClearUrl,
    className: 'tui-kit-icon-clear',
  },
  [IconTypes.SEARCH]: {
    url: IconSearchUrl,
    className: 'tui-kit-icon-search',
  },
  [IconTypes.BACK]: {
    url: IconBackUrl,
    className: 'tui-kit-icon-back',
  },
  [IconTypes.EMOJI]: {
    url: IconEmojiUrl,
    className: 'tui-kit-icon-emoji',
  },
  [IconTypes.PROGRESS]: {
    url: IconProgressUrl,
    className: 'tui-kit-icon-progress',
  },
  [IconTypes.FILE]: {
    url: IconFileUrl,
    className: 'tui-kit-icon-file',
  },
  [IconTypes.ADD]: {
    url: IconAddUrl,
    className: 'tui-kit-icon-add',
  },
  [IconTypes.IMAGE]: {
    url: IconImageUrl,
    className: 'tui-kit-icon-image',
  },
  [IconTypes.VIDEO]: {
    url: IconVideoUrl,
    className: 'tui-kit-icon-video',
  },
  [IconTypes.DOCUMENT]: {
    url: IconDocumentUrl,
    className: 'tui-kit-icon-document',
  },
  [IconTypes.STAR]: {
    url: IconStarUrl,
    className: 'tui-kit-icon-star',
  },
  [IconTypes.COPY]: {
    url: IconCopyUrl,
    className: 'tui-kit-icon-copy',
  },
  [IconTypes.DEL]: {
    url: IconDelUrl,
    className: 'tui-kit-icon-del',
  },
  [IconTypes.FORWARD]: {
    url: IconForwardUrl,
    className: 'tui-kit-icon-forward',
  },
  [IconTypes.REPLY]: {
    url: IconReplyUrl,
    className: 'tui-kit-icon-reply',
  },
  [IconTypes.CLOSE]: {
    url: IconCloseUrl,
    className: 'tui-kit-icon-close',
  },
  [IconTypes.ARROW_RIGHT]: {
    url: IconArrowRightUrl,
    className: 'tui-kit-icon-arrow-right',
  },
  [IconTypes.RIGHT]: {
    url: IconRightUrl,
    className: 'tui-kit-icon-right',
  },
  [IconTypes.ELLIPSE]: {
    url: IconEllipseUrl,
    className: 'tui-kit-icon-ellipse',
  },
  [IconTypes.CANCEL]: {
    url: IconCancelUrl,
    className: 'tui-kit-icon-cancel',
  },
  [IconTypes.ARROW_DOWN]: {
    url: IconArrowDownUrl,
    className: 'tui-kit-icon-arrow-down',
  },
  [IconTypes.EDIT]: {
    url: IconEditUrl,
    className: 'tui-kit-icon-edit',
  },
  [IconTypes.CONFIRM]: {
    url: IconConfirmUrl,
    className: 'tui-kit-icon-confirm',
  },
  [IconTypes.CAMERA]: {
    url: IconCameraUrl,
    className: 'tui-kit-icon-camera',
  },
  [IconTypes.QUOTE]: {
    url: IconQuoteUrl,
    className: 'tui-kit-icon-quote',
  },
  [IconTypes.REVOCATION]: {
    url: IconRevocationUrl,
    className: 'tui-kit-icon-revocation',
  },
  [IconTypes.EFFORT]: {
    url: IconEffortUrl,
    className: 'tui-kit-icon-effort',
  },
  [IconTypes.CRY]: {
    url: IconCryUrl,
    className: 'tui-kit-icon-cry',
  },
  [IconTypes.OWNER]: {
    url: IconOwnerUrl,
    className: 'tui-kit-icon-owner',
  },
  [IconTypes.SEND]: {
    url: IconSendUrl,
    className: 'tui-kit-icon-send',
  },
  [IconTypes.LIVING]: {
    url: IconLivingUrl,
    className: 'tui-kit-icon-living',
  },
  [IconTypes.MEMBER]: {
    url: IconMemberUrl,
    className: 'tui-kit-icon-member',
  },
  [IconTypes.LIKE]: {
    url: IconLikerUrl,
    className: 'tui-kit-icon-like',
  },
  [IconTypes.UNLIKE]: {
    url: IconUnlikeUrl,
    className: 'tui-kit-icon-unlike',
  },
  [IconTypes.LIKED]: {
    url: IconLikedUrl,
    className: 'tui-kit-icon-liked',
  },
  [IconTypes.UNLIKED]: {
    url: IconUnlikedUrl,
    className: 'tui-kit-icon-unliked',
  },
  [IconTypes.UNION]: {
    url: IconUnionUrl,
    className: 'tui-kit-icon-union',
  },
  [IconTypes.UNUNION]: {
    url: IconUnunionUrl,
    className: 'tui-kit-icon-ununion',
  },
  [IconTypes.VECTOR]: {
    url: IconVectorUrl,
    className: 'tui-kit-icon-vector',
  },
  [IconTypes.UNVECTOR]: {
    url: IconUnvectorUrl,
    className: 'tui-kit-icon-unvector',
  },
  [IconTypes.VOICE]: {
    url: IconVoiceUrl,
    className: 'tui-kit-icon-voice',
  },
  [IconTypes.ADDFRIEND]: {
    url: IconAddCircleUrl,
    className: 'tui-kit-icon-add-friend',
  },
  [IconTypes.LOADING]: {
    url: '',
    className: 'tui-kit-icon-loading',
  },
  [IconTypes.MUTE]: {
    url: IconMuteUrl,
    className: 'tui-kit-icon-mute',
  },
  [IconTypes.VIDEOCALL]: {
    url: IconVideoCallUrl,
    className: 'tui-kit-icon-video-call',
  },
  [IconTypes.VOICECALL]: {
    url: IconVoiceCallUrl,
    className: 'tui-kit-icon-voice-call',
  },
};
