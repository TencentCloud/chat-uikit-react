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
    pluginConfig,
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
      pluginConfig,
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
      operateData,
      pluginConfig,
    ],
  );

  return messageInputContext;
};
