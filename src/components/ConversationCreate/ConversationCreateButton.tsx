// ConversationSearch.tsx
import React from 'react';
import cs from 'classnames';
import { Icon, IconTypes } from '../Icon';
import './styles/conversationCreateButton.scss';

interface IConversationCreateButtonProps {
  visible?: boolean;
  onClick?: (event: React.BaseSyntheticEvent) => void;
  height?: number;
  width?: number;
  className?: string;
}

const ConversationCreateButton = (props: IConversationCreateButtonProps) => {
  const {
    visible = true,
    className,
    onClick,
    height = 24,
    width = 24,
  } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className={cs(
      'tui-conversation-create-button',
      className)}
    >
      <Icon
        onClick={onClick}
        type={IconTypes.CREATE}
        height={height}
        width={width}
      />
    </div>
  );
};

export {
  ConversationCreateButton,
  IConversationCreateButtonProps,
};
