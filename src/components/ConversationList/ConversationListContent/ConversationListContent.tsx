import cs from 'classnames';
import { PlaceHolder, PlaceHolderTypes } from '../../PlaceHolder';
import './ConversationListContent.scss';

interface IConversationListContentProps {
  /** Renders a customized component in the conversation list main. */
  children: React.ReactNode;
  /** Indicates whether the chat list is empty */
  empty?: boolean;
  /** Indicates whether the chat list is currently loading */
  loading?: boolean;
  /** Indicates whether there was an error loading the chat list */
  error?: boolean;
  /** A custom component to display when the chat list is empty */
  PlaceholderEmptyList?: React.ReactNode;
  /** A custom component to display while the chat list is loading */
  PlaceholderLoading?: React.ReactNode;
  /** A custom component to display when there is an error loading the chat list */
  PlaceholderLoadError?: React.ReactNode;
  /** The custom class name */
  className?: string;
  /** The custom css style */
  style?: React.CSSProperties;
}

function ConversationListContent<T extends IConversationListContentProps>(
  props: T,
): React.ReactElement {
  const {
    children,
    empty = false,
    loading = false,
    error = false,
    PlaceholderEmptyList = <PlaceHolder type={PlaceHolderTypes.NO_CONVERSATIONS} />,
    PlaceholderLoading = <PlaceHolder type={PlaceHolderTypes.LOADING} />,
    PlaceholderLoadError = <PlaceHolder type={PlaceHolderTypes.WRONG} />,
    className,
    style,
  } = props;

  let content;

  if (error) {
    content = PlaceholderLoadError;
  } else if (loading) {
    content = PlaceholderLoading;
  } else if (empty) {
    content = PlaceholderEmptyList;
  } else {
    content = children;
  }

  return (
    <div
      className={cs('uikit-chat-list__container', className)}
      style={style}
    >
      {content}
    </div>
  );
}

export { ConversationListContent, IConversationListContentProps };
