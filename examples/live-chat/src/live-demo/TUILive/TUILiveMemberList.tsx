import React, {
  PropsWithChildren, useEffect, useState,
} from 'react';
import { GroupMember } from 'tim-js-sdk';
import { TUILiveMemberListItemParams, useTUILiveContext } from './context/TUILiveContext';

import './styles/index.scss';

import  { Icon, IconTypes, Avatar } from '@tencentcloud/chat-uikit-react';

const defaultUserAvatar = 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';

export interface TUILiveMemberListProps {
  className?: string,
  memberGroupList?: Array<TUILiveMemberListItemParams>,
}

interface MemberGroupItemParams extends TUILiveMemberListItemParams {
  list?: Array<GroupMember>,
  show?: boolean,
}

function UnMemoizedTUILiveMemberList<T extends TUILiveMemberListProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    memberGroupList: propsMemberGroupList,
  } = props;

  const {
    memberGroupList: contextMemberGroupList,
    memberList = [],
    ownerProfile,
  } = useTUILiveContext('TUILiveHeader');

  const [memberGroupList, setMemberGroupList] = useState<
  Array<MemberGroupItemParams>>([]);

  const toggleItemList = (index:number) => {
    const nextTodos = memberGroupList.map((todo, todoIndex) => {
      if (todoIndex === index) return { ...todo, show: !todo.show };
      return todo;
    });
    setMemberGroupList(nextTodos);
  };

  useEffect(() => {
    const memberGroup = propsMemberGroupList || contextMemberGroupList || [];
    if (memberGroup?.length > 0 && memberList?.length > 0 && memberGroupList?.length === 0) {
      const list = memberGroup.map((memberGroupItem:TUILiveMemberListItemParams) => {
        const data:any = { ...memberGroupItem, list: [], show: true };
        if (data.filter) {
          data.list = data?.filter(memberList, ownerProfile);
        }
        return data;
      });
      setMemberGroupList(list);
    }

    if (memberGroup?.length === 0 && memberList?.length > 0 && memberGroupList?.length === 0) {
      const list = [
        {
          title: 'All',
          name: 'All',
          show: true,
          list: memberList,
        },
      ];
      setMemberGroupList(list);
    }
  }, [propsMemberGroupList, contextMemberGroupList, ownerProfile, memberGroupList, memberList]);

  return (
    <main className="tui-live-members">
      {
        memberGroupList?.map((itemList, itemListIndex) => (
          <ul className="list" key={itemList?.name}>
            <div
              role="menuitem"
              tabIndex={itemListIndex}
              className={`list-header ${!itemList?.show && 'close-arrow'}`}
              onClick={() => { toggleItemList(itemListIndex); }}
            >
              <h1>{itemList?.title}</h1>
              <Icon
                type={IconTypes.ARROW_DOWN}
                width={12}
                height={7}
              />
            </div>
            {
              itemList?.show
              && itemList?.list?.map((item:GroupMember) => (
                <li className="list-item" key={item?.userID}>
                  <Avatar size={18} image={item?.avatar || defaultUserAvatar} />
                  <span className="nick">{item?.nick || item?.userID}</span>
                </li>
              ))
            }
          </ul>
        ))
      }
    </main>
  );
}

export const TUILiveMemberList = React.memo(UnMemoizedTUILiveMemberList) as
typeof UnMemoizedTUILiveMemberList;
