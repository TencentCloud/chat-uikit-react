import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MESSAGE_OPERATE } from '../../constants';
import { useTUIChatStateContext } from '../../context';

import { useTUIMessageInputContext } from '../../context/TUIMessageInputContext';
import { formatEmojiString } from '../TUIMessage/utils/emojiMap';

export function TUIMessageInputDefault():React.ReactElement {
  const {
    text,
    disabled,
    handleChange,
    handleKeyDown,
    handlePasete,
    textareaRef,
    focus,
    setText,
    setCursorPos,
  } = useTUIMessageInputContext('TUIMessageInputDefault');
  const { t } = useTranslation();
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  // operateData
  useEffect(() => {
    if (operateData[MESSAGE_OPERATE.REVOKE]) {
      setText(formatEmojiString(operateData[MESSAGE_OPERATE.REVOKE].payload.text, 1));
    }
  }, [operateData]);

  // Focus
  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.autofocus = true;
      textareaRef?.current?.focus();
      textareaRef?.current?.addEventListener('paste', handlePasete);
    }
    return () => {
      textareaRef?.current?.removeEventListener('paste', handlePasete);
    };
  }, [focus]);

  const [focused, setFocused] = useState<boolean>(false);

  const handleFocus = (e) => {
    setFocused(true);
  };
  const handleBlur = (e) => {
    setCursorPos({
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });
    setFocused(false);
  };

  return (
    <div className={`input-box ${disabled ? 'disabled' : ''} ${focused ? 'tui-kit-input-box--focus' : 'tui-kit-input-box--blur'}`}>
      <div className="input-visibility-content">{text}</div>
      {
        !disabled
        && (
        <textarea
          placeholder={t('TUIChat.Enter a message')}
          rows={1}
          value={text}
          ref={textareaRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        )
      }
    </div>
  );
}
