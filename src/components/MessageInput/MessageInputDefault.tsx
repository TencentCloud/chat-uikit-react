import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MESSAGE_OPERATE } from '../../constants';
import { useTUIChatStateContext } from '../../context';
import { isPC } from '../../utils/env';
import { useTUIMessageInputContext } from '../../context/MessageInputContext';
import { formatEmojiString } from '../MessageElement/utils/emojiMap';

export function TUIMessageInputDefault(): React.ReactElement {
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
    if (operateData && operateData[MESSAGE_OPERATE.REVOKE]) {
      setText && setText(formatEmojiString(operateData[MESSAGE_OPERATE.REVOKE].payload.text, 1));
    }
  }, [operateData]);

  // Focus
  useEffect(() => {
    if (focus && textareaRef && textareaRef.current) {
      textareaRef.current.autofocus = true;
      isPC && textareaRef?.current?.focus({
        preventScroll: true,
      });
      // eslint-disable-next-line
      // @ts-ignore
      textareaRef?.current?.addEventListener('paste', handlePasete);
    }
    return () => {
      // eslint-disable-next-line
      // @ts-ignore
      textareaRef?.current?.removeEventListener('paste', handlePasete);
    };
  }, [focus, textareaRef]);

  const [focused, setFocused] = useState<boolean>(false);

  const handleFocus = () => {
    setFocused(true);
  };
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursorPos && setCursorPos({
      start: e?.target?.selectionStart,
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
            // eslint-disable-next-line
          // @ts-ignore
            ref={textareaRef}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={(e: any) => { handleBlur(e); }}
          />
        )
      }
    </div>
  );
}
