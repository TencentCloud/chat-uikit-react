// ConversationActions.tsx
import React, { useRef, useEffect } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { IConversationModel } from '@tencentcloud/chat-uikit-engine';
import cs from 'classnames';

import { Plugins } from '../Plugins';
import { Icon, IconTypes } from '../Icon';

import './ConversationActions.scss';

interface IConversationActionsConfig {
  /** Determines whether the pin button appears on the conversation actions list view. (Default: True) */
  enablePin?: boolean;
  /**  Determines whether the mute button appears on the conversation actions list view. (Default: True) */
  enableMute?: boolean;
  /** Determines whether the delete button appears on the conversation actions list view. (Default: True) */
  enableDelete?: boolean;
  /** Function to override the default behavior when user pin or unpin a conversation.  */
  onConversationPin?: (conversation: IConversationModel, e?: React.MouseEvent) => void;
  /** Function to override the default behavior when user mute or unmute a conversation. */
  onConversationMute?: (conversation: IConversationModel, e?: React.MouseEvent) => void;
  /** Function to override the default behavior when user delete a conversation. */
  onConversationDelete?: (conversation: IConversationModel, e?: React.MouseEvent) => void;
  /**
   * An object containing custom conversation actions (key) and object (value).
   * Each value is an object with the following properties:
   * enable: Determines whether the custom action is enabled. (Default: True)
   * label: The label of the custom action.
   * onClick: The function to be called when the custom action is clicked.
   * Note: The key of the custom action must be unique.
   */
  customConversationActions?: Record<string, IConversationActionItem>;
  /** The icon react element to be displayed in the action popup. */
  PopupIcon?: React.ReactElement;
  /** An array of react elements to be displayed in the action popup. */
  PopupElements?: React.ReactElement[];
  /** The function to be called when the action popup is clicked. */
  onClick?: (e: React.MouseEvent, key?: string, conversation?: IConversationModel) => void;
}

interface IConversationActionsProps extends IConversationActionsConfig {
  /** The conversation model. */
  conversation: IConversationModel;
  /** The class name of the root element. */
  className?: string;
  /** The style of the root element. */
  style?: React.CSSProperties;
}

interface IConversationActionItem {
  /** Determines whether the custom action is enabled. (Default: True)  */
  enable?: boolean;
  /** label: The label of the custom action. */
  label: string;
  /** onClick: The function to be called when the custom action is clicked. */
  onClick: (conversation: IConversationModel, e?: React.MouseEvent) => void;
}

interface IPluginsRef {
  closeMore?: () => void;
}

const ConversationActions = (props: IConversationActionsProps) => {
  const {
    conversation,
    PopupIcon,
    enablePin = true,
    enableMute: isMuteEnabled = true,
    enableDelete: isDeleteEnabled = true,
    onConversationPin,
    onConversationMute,
    onConversationDelete,
    customConversationActions,
    PopupElements,
    onClick,
    className,
    style,
  } = props;

  const { t } = useUIKit();
  const pluginsRef = useRef<IPluginsRef>(null);
  const [conversationActions, setConversationActions] = React.useState<Record<string, IConversationActionItem>>({});

  const defaultConversationActions: Record<string, IConversationActionItem> = {
    delete: {
      enable: isDeleteEnabled,
      label: t('TUIConversation.Delete'),
      onClick: onConversationDelete || ((_conversation: IConversationModel) => { _conversation.deleteConversation(); }),
    },
    pin: {
      enable: enablePin,
      label: t(conversation.isPinned ? 'TUIConversation.Unpin' : 'TUIConversation.Pin'),
      onClick: onConversationPin || ((_conversation: IConversationModel) => { _conversation.pinConversation(); }),
    },
    mute: {
      enable: isMuteEnabled,
      label: t(conversation.isMuted ? 'TUIConversation.Unmute' : 'TUIConversation.Mute'),
      onClick: onConversationMute || ((_conversation: IConversationModel) => { _conversation.muteConversation(); }),
    },
  };

  useEffect(() => {
    setConversationActions({
      ...defaultConversationActions,
      ...customConversationActions,
    });
  }, [conversation, customConversationActions]);

  const onClickMenuItem = (e: React.MouseEvent, key: string) => {
    pluginsRef?.current?.closeMore && pluginsRef.current.closeMore();
    onClick?.(e, key, conversation);
    conversationActions[key]?.onClick(conversation, e);
  };

  return (
    <div
      className={cs({
        'uikit-conversation-actions': true,
        className,
      })}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
    >
      <Plugins
        customClass="uikit-conversation-actions__container"
        ref={pluginsRef}
        plugins={(
          PopupElements
          || (
            Object.keys(conversationActions).map((key: string) => {
              if (conversationActions[key].enable === false) return null;
              return (
                <div
                  key={key}
                  className={cs(
                    'uikit-conversation-actions__item',
                    [`uikit-conversation-actions__item--${key}`],
                  )}
                  onClick={e => onClickMenuItem(e, key)}
                >
                  {conversationActions[key].label}
                </div>
              );
            })
          )
        )}
        showNumber={0}
        MoreIcon={(
          PopupIcon
          || (
            <Icon
              className="uikit-conversation-actions__popup-icon"
              width={16}
              height={16}
              type={IconTypes.MORE}
            />
          )
        )}
      />
    </div>
  );
};

export {
  ConversationActions,
  IConversationActionsProps,
  IConversationActionItem,
  IConversationActionsConfig,
};
