import cs from 'classnames';
import './ConversationListHeader.scss';

interface IConversationListHeaderProps {
  /** The main of the conversation list header */
  children: React.ReactNode;
  /** A custom component to display in the left area of header */
  left?: React.ReactNode;
  /** A custom component to display in the right area of header */
  right?: React.ReactNode;
  /** The custom class name */
  className?: string;
  /** The custom css style */
  style?: React.CSSProperties;
}

function ConversationListHeader<T extends IConversationListHeaderProps>(
  props: T,
): React.ReactElement {
  const {
    children,
    left,
    right,
    className,
    style,
  } = props;

  return (
    <div
      className={cs(
        'uikit-chat-list__header',
        className,
      )}
      style={style}
    >
      <div className="uikit-chat-list__header__left">{left}</div>
      {children}
      <div className="uikit-chat-list__header__right">{right}</div>
    </div>
  );
}

export { ConversationListHeader, IConversationListHeaderProps };
