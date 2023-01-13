import React, { useState } from 'react';
import { useTUIMessageInputContext } from '../../context/TUIMessageInputContext';
import { Icon, IconTypes } from '../Icon';
import { Popup } from '../Popup';
import {
  emojiUrl, emojiName, emojiMap,
  // bigEmojiList, faceUrl, IBigEmojiListItem,
} from '../TUIMessage/utils/emojiMap';

import type { EmojiData } from './hooks';

export function EmojiPicker():React.ReactElement {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [className, setClassName] = useState('');

  const handleShow = () => {
    setShow(!show);
  };
  const {
    onSelectEmoji,
    sendFaceMessage,
  } = useTUIMessageInputContext('TUIMessageInputDefault');

  const handleSelectEmoji = (e) => {
    const emoji: EmojiData = {
      index,
      data: e.target.dataset.data,
    };
    if (!emoji.data) {
      return;
    }
    if (index === 0) {
      onSelectEmoji(emoji);
    } else {
      sendFaceMessage(emoji);
      handleShow();
    }
  };

  const handleVisible = (data) => {
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
            index === 0 && emojiName.map((item:string, emojiIndex:number) => {
              const key = item + emojiIndex;
              return (
                <li
                  role="menuitem"
                  className="face-list-item"
                  key={key}
                  onClick={handleSelectEmoji}
                >
                  <img
                    src={`${emojiUrl + emojiMap[item]}`}
                    alt=""
                    data-data={item}
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
