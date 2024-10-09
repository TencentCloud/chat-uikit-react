import { useMemo } from 'react';

export const useCreateMessageInputContext = (value:any) => {
  const {
    textareaRef,
    handleChange,
    handleSubmit,
    handleEnterKeyDown,
    onSelectEmoji,
    sendFaceMessage,
    disabled,
    focus,
    operateData,
    pluginConfig,
  } = value;
  const messageInputContext = useMemo(
    () => ({
      textareaRef,
      handleChange,
      handleSubmit,
      handleEnterKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      operateData,
      pluginConfig,
      ...value,
    }),
    [
      textareaRef,
      handleChange,
      handleSubmit,
      handleEnterKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      operateData,
      pluginConfig,
    ],
  );

  return messageInputContext;
};
