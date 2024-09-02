import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/index.scss';
import { Conversation } from '@tencentcloud/chat';
import { Icon, IconTypes } from '../Icon';
import { ConversationCreateUserSelectList } from './ConversationCreateUserSelectList';
import { ConversationCreatGroupDetail } from './ConversationCreatGroupDetail';
import { useUIKit } from '../../context';
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
  const { t } = useTranslation();
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [pageState, setPageState] = useState<PageStateTypes>(PageStateTypes.USER_SELECT);
  const [selectList, setSelectList] = useState([]);
  const { chat } = useUIKit();
  const { createConversation } = useConversation(chat);

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
        <div className="title">{ t(!isCreateGroup ? 'TUIConversation.Start chat' : 'TUIConversation.Add Participants')}</div>
      </div>
      {pageState === PageStateTypes.USER_SELECT ? (
        <ConversationCreateUserSelectList
          isCreateGroup={isCreateGroup}
          setIsCreateGroup={setIsCreateGroup}
          className={className}
          selectList={selectList}
          // eslint-disable-next-line
          // @ts-ignore
          setSelectList={setSelectList}
          conversationList={conversationList}
          setConversationCreated={setConversationCreated}
          setPageState={setPageState}
        />
      ) : (
        <ConversationCreatGroupDetail
          pageState={pageState}
          setPageState={setPageState}
          profileList={selectList.map((item: any) => item?.profile)}
          // eslint-disable-next-line
          // @ts-ignore
          createConversation={createConversation}
          setConversationCreated={setConversationCreated}
        />
      )}
    </>
  ), [isCreateGroup, selectList, pageState]);
}
