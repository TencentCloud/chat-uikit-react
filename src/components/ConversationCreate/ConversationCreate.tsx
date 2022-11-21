import React, { useMemo, useState } from 'react';
import './styles/index.scss';
import { Conversation } from 'tim-js-sdk';
import { Icon, IconTypes } from '../Icon';
import { ConversationCreateUserSelectList } from './ConversationCreateUserSelectList';
import { ConversationCreatGroupDetail } from './ConversationCreatGroupDetail';
import { useTUIKitContext } from '../../context';
import { useConversation } from '../../hooks';

export interface ConversationCreateProps {
  className?: string,
  setConversationCreated: React.Dispatch<React.SetStateAction<boolean>>,
  conversationList?: Array<Conversation>
}
export enum PageStateTypes {
  USER_SELECT='Next',
  CREATE_DETAIL='Create',
  GROUP_TYPE='GroupType',
}
export function ConversationCreate<T extends ConversationCreateProps>(props:T) {
  const { className = '', setConversationCreated, conversationList = [] } = props;
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [pageState, setPageState] = useState<PageStateTypes>(PageStateTypes.USER_SELECT);
  const [selectList, setSelectList] = useState([]);
  const { tim } = useTUIKitContext();
  const { createConversation } = useConversation(tim);
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
      setConversationCreated(false);
    }
  };
  return useMemo(() => (
    <>
      <div className="tui-conversation-create-header">
        <Icon onClick={back} type={IconTypes.BACK} width={9} height={16} />
        <div className="title">{ !isCreateGroup ? 'New Chat' : 'Add Participants'}</div>
      </div>
      {pageState === PageStateTypes.USER_SELECT ? (
        <ConversationCreateUserSelectList
          isCreateGroup={isCreateGroup}
          setIsCreateGroup={setIsCreateGroup}
          className={className}
          selectList={selectList}
          setSelectList={setSelectList}
          conversationList={conversationList}
          setConversationCreated={setConversationCreated}
          setPageState={setPageState}
        />
      ) : (
        <ConversationCreatGroupDetail
          pageState={pageState}
          setPageState={setPageState}
          profileList={selectList.map((item) => item.profile)}
          createConversation={createConversation}
          setConversationCreated={setConversationCreated}
        />
      )}
    </>
  ), [isCreateGroup, selectList, pageState]);
}
