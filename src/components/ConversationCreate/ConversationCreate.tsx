import React, { useEffect, useMemo, useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { CreateGroupParams, IConversationModel, TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import cs from 'classnames';

import { Icon, IconTypes } from '../Icon';
import { ConversationCreateButton } from './ConversationCreateButton';
import { ConversationCreateUserSelectList } from './ConversationCreateUserSelectList';
import { ConversationCreateGroupDetail } from './ConversationCreateGroupDetail';

import './styles/index.scss';

export interface IConversationCreateProps {
  visible?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onBeforeCreateConversation?: (params: string | CreateGroupParams) => string | CreateGroupParams;
  onConversationCreated?: (conversation: IConversationModel) => void;
  onChangeCreateModelVisible: (visible: boolean) => void;
  conversationList?: IConversationModel[];
}
export enum PageStateTypes {
  USER_SELECT = 'Next',
  CREATE_DETAIL = 'Create',
  GROUP_TYPE = 'GroupType',
}
export function ConversationCreate<T extends IConversationCreateProps>(props: T) {
  const {
    visible = true,
    className,
    style,
    onChangeCreateModelVisible,
    conversationList = [],
    onBeforeCreateConversation,
    onConversationCreated,
  } = props;
  const { t } = useUIKit();

  const [showCreateModel, setShowCreateModel] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [pageState, setPageState] = useState<PageStateTypes>(PageStateTypes.USER_SELECT);
  const [selectList, setSelectList] = useState([]);

  const _onConversationCreated = (conversation: IConversationModel) => {
    setShowCreateModel(false);
    resetCreatePageState();
    TUIConversationService.switchConversation(conversation.conversationID);
    onConversationCreated?.(conversation);
  };

  useEffect(() => {
    onChangeCreateModelVisible(showCreateModel);
  }, [onChangeCreateModelVisible, showCreateModel]);

  const back = () => {
    if (isCreateGroup) {
      switch (pageState) {
        case PageStateTypes.USER_SELECT:
          setIsCreateGroup(false);
          break;
        case PageStateTypes.CREATE_DETAIL:
          setPageState(PageStateTypes.USER_SELECT);
          setSelectList([]);
          break;
        case PageStateTypes.GROUP_TYPE:
          setPageState(PageStateTypes.CREATE_DETAIL);
          break;
        default:
      }
    } else {
      setShowCreateModel(false);
      resetCreatePageState();
    }
  };

  function resetCreatePageState() {
    setIsCreateGroup(false);
    setPageState(PageStateTypes.USER_SELECT);
    setSelectList([]);
  }

  return useMemo(() => {
    if (!visible) {
      return null;
    }

    return (
      <div
        className={cs(
          'uikit-conversation-create-container',
          className,
        )}
        style={style}
      >
        {!showCreateModel && (
          <ConversationCreateButton
            onClick={() => setShowCreateModel(true)}
          />
        )}
        {showCreateModel && (
          <div className="tui-conversation-create">
            <div className="tui-conversation-create-header">
              <Icon onClick={back} type={IconTypes.BACK} width={9} height={16} />
              <div className="title">{t(!isCreateGroup ? 'TUIConversation.Start chat' : 'TUIConversation.Add Participants')}</div>
            </div>
            {
              pageState === PageStateTypes.USER_SELECT
                ? (
                    <ConversationCreateUserSelectList
                      isCreateGroup={isCreateGroup}
                      setIsCreateGroup={setIsCreateGroup}
                      selectList={selectList}
                      setSelectList={setSelectList as React.Dispatch<React.SetStateAction<any[]>>}
                      conversationList={conversationList}
                      onBeforeCreateConversation={onBeforeCreateConversation}
                      onConversationCreated={_onConversationCreated}
                      setPageState={setPageState}
                    />
                  )
                : (
                    <ConversationCreateGroupDetail
                      pageState={pageState}
                      setPageState={setPageState}
                      profileList={selectList.map((item: any) => item?.profile)}
                      onBeforeCreateConversation={onBeforeCreateConversation}
                      onConversationCreated={_onConversationCreated}
                    />
                  )
            }
          </div>
        )}
      </div>

    );
  }, [visible, className, showCreateModel, isCreateGroup, pageState, selectList, conversationList, onBeforeCreateConversation]);
}
