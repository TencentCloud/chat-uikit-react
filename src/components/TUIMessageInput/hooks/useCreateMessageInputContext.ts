import { useMemo } from 'react';

export const useCreateMessageInputContext = (value:any) => {
  const {
    textareaRef,
    handleChange,
    handleSubmit,
    handleKeyDown,
    onSelectEmoji,
    sendFaceMessage,
    disabled,
    focus,
    operateData,
    plugins,
    showNumber,
    MoreIcon,
  } = value;
  const messageInputContext = useMemo(
    () => ({
      textareaRef,
      handleChange,
      handleSubmit,
      handleKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      operateData,
      plugins,
      showNumber,
      MoreIcon,
      ...value,
    }),
    [
      textareaRef,
      handleChange,
      handleSubmit,
      handleKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      plugins,
      showNumber,
      MoreIcon,
      operateData,
    ],
  );

  return messageInputContext;
};
