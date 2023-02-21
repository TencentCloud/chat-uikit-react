import React, { PropsWithChildren } from 'react';
import { Conversation, Group } from 'tim-js-sdk';
import { TUILiveTagParam, useTUILiveContext } from './context/TUILiveContext';

import './styles/index.scss';

import  { Icon, IconTypes } from '@tencentcloud/chat-uikit-react';
import { formateNumber } from './untils';

export interface TUILiveHeaderBaseProps {
  className?: string,
  conversation?: Conversation,
  group?: Group,
}

interface TUILiveHeaderProps extends TUILiveHeaderBaseProps {
  TUILiveHeader?: React.ComponentType<TUILiveHeaderBaseProps>,
  menuIcon?: React.ReactElement,
  onTagClick?: (data?:TUILiveTagParam)=> void,
}

function UnMemoizedTUILiveHeader<T extends TUILiveHeaderProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    conversation,
    group: porpsGroup,
    TUILiveHeader,
    menuIcon: propsMenuIcon,
    onTagClick: propsOnTagClick,
  } = props;

  const {
    group: contextGroup,
    menuIcon: contextMenuIcon,
    onTagClick: contextOnTagClick,
    memberCount,
    groupCounters,
  } = useTUILiveContext('TUILiveHeader');

  const group = porpsGroup || contextGroup;
  const menuIcon = propsMenuIcon || contextMenuIcon;
  let onTagClick: any;
  if ( propsOnTagClick || contextOnTagClick) {
    onTagClick = propsOnTagClick || contextOnTagClick
  } else {
    onTagClick = ()=>{}
  }

  if (TUILiveHeader) (<TUILiveHeader conversation={conversation} group={group} />);

  const groupCustomField = (group?.groupCustomField || []).filter((item) => (item?.value));

  const contentList = [
    {
      icon: IconTypes.MEMBER,
      value: memberCount,
    },
    {
      icon: IconTypes.UNION,
      value: groupCounters?.LiveDemoFollow || 0,
    },
    {
      icon: IconTypes.VECTOR,
      value: groupCounters?.LiveDemoSubscribe || 0,
    },
  ];

  return (
    <header className={`tui-live-header ${className}`}>
      <div className="tui-live-header-name">
        <h1>{group?.name || group?.groupID}</h1>
        {menuIcon}
      </div>
      <div className="tui-live-header-content">
        <div className="tui-live-header-label">
          <Icon className="icon" type={IconTypes.LIVING} width={12} height={12} />
          <p>Living</p>
        </div>
        <ul className="tui-live-list tag-list">
          {
            groupCustomField?.map((item, index) => (
              <li
                role="menuitem"
                tabIndex={index}
                className="tui-live-item tag-item"
                key={item.value}
                onClick={(e) => { onTagClick({ value: item.value, ele: e }); }}
              >
                {item?.value}
              </li>
            ))
          }
        </ul>
        <ul className="tui-live-list">
          {
            contentList?.map((item) => (
              <li className="tui-live-item" key={item.icon}>
                <Icon className="icon" type={item.icon} width={12} height={12} />
                <span className="list-item-text">{formateNumber(item.value || 0, 1)}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </header>
  );
}

export const TUILiveHeader = React.memo(UnMemoizedTUILiveHeader) as
typeof UnMemoizedTUILiveHeader;
