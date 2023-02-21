import React, { PropsWithChildren, useMemo } from 'react';
import { Conversation, GroupMember, Profile } from 'tim-js-sdk';
import { useTUIKitContext } from '@tencentcloud/chat-uikit-react';
import {
  OwnerLabelListItem,
  TUILiveContextProvider,
  TUILiveContextValue,
  TUILiveMemberListItemParams,
  TUILiveTagParam,
} from './context/TUILiveContext';
import { useLiveState } from './hooks';

import './styles/index.scss';
import { TUILiveContent } from './TUILiveContent';
import { TUILiveFooter } from './TUILiveFooter';
import { TUILiveHeader } from './TUILiveHeader';

interface TUILiveProps {
  className?: string,
  url?: string,
  conversation?: Conversation,
  myProfile?: Profile,
  ownerProfile?: GroupMember,
  activePlugins?: Array<React.ReactElement>,
  menuIcon?: React.ReactElement,
  headerTag?: Array<string>,
  footerTag?: Array<string>,
  onTagClick?: (data?:TUILiveTagParam)=> void,
  groupID?: string,
  memberGroupList?: Array<TUILiveMemberListItemParams>,
  ownerLabelList?: Array<OwnerLabelListItem>,
  callback?: (data?:any) => void,
}

function UnMemoizedTUILive<T extends TUILiveProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    url,
    conversation: propsConversation,
    ownerProfile: propsOwnerProfile,
    myProfile: propsMyProfile,
    children,
    activePlugins = [],
    menuIcon,
    onTagClick,
    groupID,
    memberGroupList,
    ownerLabelList,
    callback,
  } = props;

  const {
    tim,
    conversation: contextConversation,
    myProfile: contextMyProfile,
    setActiveConversation,
  } = useTUIKitContext('TUILive');

  const myProfile = propsMyProfile || contextMyProfile;

  const conversation = propsConversation || contextConversation;
  const {
    group,
    ownerProfile: contextOwnerProfile,
    memberCount,
    memberList,
    groupCounters,
    increaseGroupCounter,
    decreaseGroupCounter,
  } = useLiveState({
    tim,
    conversation: propsConversation || contextConversation,
    groupID,
    setActiveConversation,
  });

  const ownerProfile = propsOwnerProfile || contextOwnerProfile;

  const liveContextValue: TUILiveContextValue = useMemo(
    () => ({
      url,
      group,
      conversation,
      ownerProfile,
      myProfile,
      activePlugins,
      menuIcon,
      onTagClick,
      memberCount,
      memberList,
      memberGroupList,
      ownerLabelList,
      groupCounters,
      increaseGroupCounter,
      decreaseGroupCounter,
      callback,
    }),
    [
      url,
      group,
      conversation,
      ownerProfile,
      myProfile,
      activePlugins,
      menuIcon,
      memberGroupList,
      onTagClick,
      memberCount,
      memberList,
      ownerLabelList,
      groupCounters,
      increaseGroupCounter,
      decreaseGroupCounter,
      callback,
    ],
  );

  return (
    <TUILiveContextProvider value={liveContextValue}>
      <>
        <div className={`tui-live ${className}`}>
          <TUILiveHeader />
          <TUILiveContent />
          <TUILiveFooter />
        </div>
        {
        children && children
        }
      </>
    </TUILiveContextProvider>
  );
}

export const TUILive = React.memo(UnMemoizedTUILive) as
typeof UnMemoizedTUILive;
