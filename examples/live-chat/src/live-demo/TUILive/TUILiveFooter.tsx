import React, { PropsWithChildren } from 'react';
import {
  Conversation,
  Group,
  Profile,
  GroupMember,
} from 'tim-js-sdk';
import { OwnerLabelListItem, useTUILiveContext } from './context/TUILiveContext';

import './styles/index.scss';

import { useLiveAtiveElements } from './hooks/useLiveAtiveElements';
import  { Icon, IconTypes, Avatar } from '@tencentcloud/chat-uikit-react';
import { formateNumber } from './untils';

const defaultUserAvatar = 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';


export interface TUILiveFooterBaseProps {
  className?: string,
  conversation?: Conversation,
  group?: Group,
  ownerProfile?: GroupMember,
  myProfile?: Profile,
  ownerLabelList?: Array<OwnerLabelListItem>,
}

interface TUILiveFooterProps extends TUILiveFooterBaseProps {
  TUILiveFooter?: React.ComponentType<TUILiveFooterBaseProps>,
  activePlugins?: Array<React.ReactElement>,
}

function UnMemoizedTUILiveFooter<T extends TUILiveFooterProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    conversation,
    group: porpsGroup,
    ownerLabelList: propsOwnerLabelList,
    ownerProfile: propsOwnerProfile,
    myProfile: propsMyProfile,
    TUILiveFooter,
    activePlugins: propsActivePlugins = [],
  } = props;

  const {
    group: contextGroup,
    ownerProfile: contextOwnerProfile,
    myProfile: contextMyProfile,
    activePlugins: contextActivePlugins,
    ownerLabelList: contextOwnerLabelList,
    groupCounters,
  } = useTUILiveContext('TUILiveHeader');

  const group = porpsGroup || contextGroup;
  const myProfile = propsMyProfile || contextMyProfile;
  const activePlugins = propsActivePlugins || contextActivePlugins;

  if (TUILiveFooter) {
    (
      <TUILiveFooter
        conversation={conversation}
        group={group}
        myProfile={myProfile}
      />
    );
  }

  const ownerLabelList = propsOwnerLabelList || contextOwnerLabelList;
  const ownerProfile = propsOwnerProfile || contextOwnerProfile;
  const ownerProfileCustomField = ownerLabelList || (ownerProfile?.memberCustomField
    || []).filter((item) => (item?.value));

  const Follow = useLiveAtiveElements({
    icon: IconTypes.UNUNION,
    activeIcon: IconTypes.UNION,
    name: 'Follow',
    iconWidth: 12,
    iconHeight: 12,
    key: 'LiveDemoFollow',
    value: false,
  });

  const Subscribe = useLiveAtiveElements({
    icon: IconTypes.UNVECTOR,
    activeIcon: IconTypes.VECTOR,
    name: 'Subscribe',
    key: 'LiveDemoSubscribe',
    value: false,
  });

  const LikeOrUnlike = useLiveAtiveElements({
    icon: IconTypes.LIKE,
    activeIcon: IconTypes.LIKED,
    name: formateNumber((groupCounters as any)?.LiveDemoLike, 1),
    value: false,
    key: 'LiveDemoLike',
    suffix: {
      icon: IconTypes.UNLIKE,
      activeIcon: IconTypes.UNLIKED,
      value: false,
    },
  });

  const plugins = [Follow, Subscribe, LikeOrUnlike, ...activePlugins].filter((item) => item);

  return (
    <footer className={`tui-live-footer ${className}`}>
      <Avatar size={40} image={ownerProfile?.avatar || defaultUserAvatar} />
      <div className="tui-live-footer-main">
        <div className="owner-name">
          <h1>{ownerProfile?.nick || ownerProfile?.userID}</h1>
          <Icon type={IconTypes.OWNER} width={15} height={15} />
        </div>
        <ul className="tui-live-list tag-list">
          {
            ownerProfileCustomField?.map((item) => (
              <li className="tui-live-item tag-item" key={item.value}>{item?.value}</li>
            ))
          }
        </ul>
      </div>
      <ul className="tui-live-list opate-list">
        {plugins}
      </ul>
    </footer>
  );
}

export const TUILiveFooter = React.memo(UnMemoizedTUILiveFooter) as
typeof UnMemoizedTUILiveFooter;
