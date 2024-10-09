import React, { PropsWithChildren, useState } from 'react';
import { CreateGroupParams, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { useConversationList, ConversationListProvider } from '../../context/ConversationListContext';
import { ConversationListHeader as DefaultConversationListHeader, type IConversationListHeaderProps } from './ConversationListHeader';
import { ConversationListContent as DefaultConversationListContent, type IConversationListContentProps } from './ConversationListContent';
import { ConversationSearch as DefaultConversationSearch, type IConversationSearchProps } from '../ConversationSearch';
import { ConversationPreview, ConversationPreviewUI as DefaultConversationPreviewUI, type IConversationPreviewUIProps } from '../ConversationPreview';
import { ConversationCreate as DefaultConversationCreate, type IConversationCreateProps } from '../ConversationCreate';
import { ConversationActions as DefaultConversationActions, type IConversationActionsConfig, type IConversationActionsProps } from '../ConversationActions';
import { PlaceHolder as DefaultPlaceHolder, PlaceHolderTypes } from '../PlaceHolder';
import { Avatar as DefaultAvatar, AvatarProps } from '../Avatar';
import { isH5 } from '../../utils/env';
import cs from 'classnames';

import './ConversationList.scss';

interface IConversationListProps {
  /** Determines whether the conversation search input appears on the conversation list view. (Default: True) */
  enableSearch?: boolean;
  /** Determines whether the conversation creation button appears on the conversation list view. (Default: True) */
  enableCreate?: boolean;
  /** Determines whether the conversation action button appears on the conversation list view. (Default: True) */
  enableActions?: boolean;
  /** Specifies the prop to customize action on the conversation list item. */
  actionsConfig?: IConversationActionsConfig;
  /** Specifies a react component to customize the header of the conversation list. */
  Header?: React.ComponentType<IConversationListHeaderProps>;
  /** Specifies a react component to customize the conversation list component. */
  List?: React.ComponentType<IConversationListContentProps>;
  /** Specifies a react component to customize the conversation preview. */
  Preview?: React.ComponentType<IConversationPreviewUIProps>;
  /** Specifies a react component to customize the conversation create component. */
  ConversationCreate?: React.ComponentType<IConversationCreateProps>;
  /** Specifies a react component to customize the conversation search. */
  ConversationSearch?: React.ComponentType<IConversationSearchProps>;
  /** Specifies a react component to customize the conversation actions in conversation preview. */
  ConversationActions?: React.ComponentType<IConversationActionsProps>;
  /** Specifies a react component to customize the placeholder when the conversation list is empty. */
  PlaceholderEmptyList?: React.ReactNode;
  /** Specifies a react component to customize the placeholder when the conversation list is loading. */
  PlaceholderLoading?: React.ReactNode;
  /** Specifies a react component to customize the placeholder when the conversation list loaded error. */
  PlaceholderLoadError?: React.ReactNode;
  /** Specifies a react component to customize the avatar in list. */
  Avatar?: React.ComponentType<AvatarProps>;
  /** Specifies a function to filter conversations in the conversation list. */
  filter?: (conversationList: IConversationModel[]) => IConversationModel[];
  /** Specifies a function to sort conversations in the conversation list. */
  sort?: (conversationList: IConversationModel[]) => IConversationModel[];
  /** Specifies the prop to receive callback when a user clicks a conversation in the conversation list. */
  onSelectConversation?: (conversation: IConversationModel) => void;
  /** Specifies the prop to execute custom operations before creating a channel. */
  onBeforeCreateConversation?: (params: string | CreateGroupParams) => string | CreateGroupParams;
  /** Specifies the prop to receive callback when a conversation is created. */
  onConversationCreated?: (conversation: IConversationModel) => void;
  /** The custom class name */
  className?: string;
  /** The custom css style */
  style?: React.CSSProperties;
}

function ConversationListComponent<T extends IConversationListProps>(
  props: T,
): React.ReactElement {
  const {
    enableSearch = true,
    enableCreate = true,
    enableActions = true,
    actionsConfig,
    Header = DefaultConversationListHeader,
    List = DefaultConversationListContent,
    Preview = DefaultConversationPreviewUI,
    ConversationCreate = DefaultConversationCreate,
    ConversationSearch = DefaultConversationSearch,
    ConversationActions = DefaultConversationActions,
    PlaceholderEmptyList = <DefaultPlaceHolder type={PlaceHolderTypes.NO_CONVERSATIONS} />,
    PlaceholderLoading = <DefaultPlaceHolder type={PlaceHolderTypes.LOADING} />,
    PlaceholderLoadError = <DefaultPlaceHolder type={PlaceHolderTypes.WRONG} />,
    Avatar = DefaultAvatar,
    onSelectConversation,
    onBeforeCreateConversation,
    onConversationCreated,
    className,
    style,
  } = props;

  const {
    conversationList,
    filteredAndSortedConversationList,
    isLoading,
    isLoadError,
  } = useConversationList();

  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  return (
    <div
      className={cs(className, 'uikit-chat-list', {
        'uikit-chat-list--mobile': isH5,
      })}
      style={style}
    >
      <Header>
        <ConversationSearch
          visible={enableSearch}
          conversationList={conversationList}
          Avatar={Avatar}
          ResultPreview={ConversationPreview}
        />
        <ConversationCreate
          className={cs({
            'uikit-chat-list__header--creating': isCreateModelShow,
          })}
          visible={enableCreate}
          onChangeCreateModelVisible={visible => setIsCreateModelShow(visible)}
          onBeforeCreateConversation={onBeforeCreateConversation}
          onConversationCreated={onConversationCreated}
        />
      </Header>
      <List
        empty={filteredAndSortedConversationList.length === 0}
        loading={isLoading}
        error={isLoadError}
        PlaceholderEmptyList={PlaceholderEmptyList}
        PlaceholderLoadError={PlaceholderLoadError}
        PlaceholderLoading={PlaceholderLoading}
      >
        {filteredAndSortedConversationList.map((conversation: IConversationModel) => (
          <ConversationPreview
            key={conversation.conversationID}
            conversation={conversation}
            enableActions={enableActions}
            Preview={Preview}
            Avatar={Avatar}
            ConversationActions={ConversationActions}
            onSelectConversation={onSelectConversation}
            actionsConfig={actionsConfig}
          />
        ))}
      </List>
    </div>
  );
}

function ConversationList<T extends IConversationListProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  return (
    <ConversationListProvider filter={props.filter} sort={props.sort}>
      <ConversationListComponent {...props} />
    </ConversationListProvider>
  );
}

export { ConversationList, IConversationListProps };
