import React, { useEffect, useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { MESSAGE_OPERATE } from '../../constants';
import { useTUIChatStateContext } from '../../context';
import { isPC } from '../../utils/env';
import { useTUIMessageInputContext } from '../../context/MessageInputContext';
import { transformTextWithEmojiKeyToName } from '../MessageElement/utils/decodeText';

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
  const { t } = useUIKit();
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  // operateData
  useEffect(() => {
    if (operateData && operateData[MESSAGE_OPERATE.REVOKE]) {
      setText && setText(transformTextWithEmojiKeyToName(operateData[MESSAGE_OPERATE.REVOKE].payload.text));
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
