import React, { useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { useTUIMessageInputContext } from '../../context/MessageInputContext';
import { Icon, IconTypes } from '../Icon';
import { Popup } from '../Popup';
import {
  emojiBaseUrl, emojiUrlMap,
  // bigEmojiList, faceUrl, IBigEmojiListItem,
} from '../MessageElement/utils/emojiMap';

import type { EmojiData } from './hooks';

export function EmojiPicker(): React.ReactElement {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [className, setClassName] = useState('');

  const { t } = useUIKit();

  const handleShow = () => {
    setShow(!show);
  };
  const {
    onSelectEmoji,
    sendFaceMessage,
  } = useTUIMessageInputContext('TUIMessageInputDefault');

  const handleSelectEmoji = (e: any) => {
    const emoji: EmojiData = {
      index,
      data: e.target.dataset.data,
    };
    if (!emoji.data) {
      return;
    }
    if (index === 0) {
      onSelectEmoji && onSelectEmoji(emoji);
    } else {
      sendFaceMessage && sendFaceMessage(emoji);
      handleShow();
    }
  };

  const handleVisible = (data: any) => {
    setClassName(`${!data.top && 'emoji-plugin-top'} ${!data.left && 'emoji-plugin-right'}`);
  };

  return (
    <div className="emoji-picker input-plugin-popup">
      <Icon width={20} height={20} type={IconTypes.EMOJI} onClick={handleShow} />
      <Popup
        className={`input-plugin-popup-box ${className}`}
        show={show}
        close={handleShow}
        handleVisible={handleVisible}
      >
        <ul className="face-list">
          {
            index === 0 && Object.keys(emojiUrlMap).map((emojiKey: string) => {
              return (
                <li
                  role="menuitem"
                  className="face-list-item"
                  key={emojiKey}
                  onClick={handleSelectEmoji}
                >
                  <img
                    src={emojiBaseUrl + emojiUrlMap[emojiKey]}
                    alt={t(`Emoji.${emojiKey}`)}
                    data-data={emojiKey}
                  />
                </li>
              );
            })
          }
        </ul>
      </Popup>
    </div>
  );
}
