import { useCallback, useEffect, useState } from 'react';
import TencentCloudChat, { ChatSDK, Conversation, Group } from '@tencentcloud/chat';
import {
  TUIConversationService,
} from '@tencentcloud/chat-uikit-engine';
import { GroupCounterUpdatedOption } from '../';

export interface UseLiveStateParams {
  conversation?: Conversation,
  chat?: ChatSDK,
  groupID?: string,
  setActiveConversation?: (conversation?: Conversation | undefined) => void,
}

export function useLiveState<T extends UseLiveStateParams>(props:T) {
  const {
    chat,
    conversation,
    groupID = '',
    setActiveConversation,
  } = props;
  const [liveConversation, setLiveConversation] = useState<any>(undefined);
  const [group, setGroup] = useState<any>(undefined);
  const [groupCounters, setGroupCounters] = useState<any>(undefined);
  const [groupCounterUpdated, setGroupCounterUpdated] = useState<any>(undefined);
  const [ownerProfile, setOwnerProfile] = useState<any>(undefined);
  const [memberCount, setMemberCount] = useState(0);
  const [memberList, setMemberList] = useState<any>(undefined);

  const searchGroupByID = (groupID:string, success: Function, failure: Function) => {
    chat?.searchGroupByID(groupID).then((res) => {
      if (res.data.group) {
        success(groupID);
      } else {
        failure(groupID);
      }
    }).catch(() => {
      failure(groupID);
    })
  }

  const getGroupProfile = useCallback(async () => {
    if (groupID && !group && chat?.isReady()) {
      searchGroupByID(groupID, async ()=> {
        const res = await chat?.getGroupProfile({ groupID });
        setGroup(res?.data?.group);
        await getOwnerProfile(res?.data?.group);
      }, async () => {
        const res = await chat?.createGroup({
          type: TencentCloudChat.TYPES.GRP_AVCHATROOM,
          groupID,
          name: 'my live room'
        });
        setGroup(res?.data?.group);
        await getOwnerProfile(res?.data?.group);
      })
    }
  }, [chat?.isReady(), groupID]);

  const getOwnerProfile = async (params:Group) => {
    if (params?.ownerID) {
      const res = await chat?.getGroupMemberProfile({
        groupID,
        userIDList: [params?.ownerID],
      });
      setOwnerProfile(res?.data?.memberList[0]);
    }
  };

  const getGroupOnlineMemberCount = useCallback(async () => {
    if (groupID) {
      const imResponse = await chat?.getGroupOnlineMemberCount(groupID);
      const onlineMemberCount = imResponse?.data?.memberCount;
      if (onlineMemberCount > 0) {
        const membersRes = await chat?.getGroupMemberList({ groupID, offset: 0 });
        setMemberList(membersRes?.data?.memberList);
        const memberCount = membersRes?.data?.memberList.length;
        // The maximum value of getGroupMemberList is 1000
        const Count = onlineMemberCount > memberCount ? onlineMemberCount : memberCount;
        setMemberCount(Count)
      }
    }
  }, [chat?.isReady()]);

  const getGroupCounters = useCallback(async () => {
    if (groupID) {
      const options = {
        groupID,
      };
      const imResponse = await chat?.getGroupCounters(options);
      setGroupCounters(JSON.parse(JSON.stringify(imResponse.data.counters)));
    }
  }, [chat?.isReady(), groupID]);

  const increaseGroupCounter = useCallback(async (data:GroupCounterUpdatedOption) => {
    if (groupID) {
      const options = {
        groupID,
        ...data,
      };
      const imResponse = await chat?.increaseGroupCounter(options);
      handleGroupCounters(imResponse.data.counters);
    }
  }, [chat?.isReady(), groupID, groupCounters]);

  const decreaseGroupCounter = useCallback(async (data:GroupCounterUpdatedOption) => {
    if (groupID) {
      const options = {
        groupID,
        ...data,
      };
      const imResponse = await chat?.decreaseGroupCounter(options);
      handleGroupCounters(imResponse.data.counters);
    }
  }, [chat?.isReady(), groupID, groupCounters]);

  const onGroupAttributesUpdated = (event: { data: any; }) => {
    console.log('onGroupAttributesUpdated', event?.data);
  };

  const onGroupCounterUpdated = (event: { data: { groupID: any; key: any; value: any; }; }) => {
    const { groupID: _groupID, key, value } = event.data;
    if (_groupID === groupID) {
      setGroupCounterUpdated({
        [key]: value,
      });
    }
  };

  const handleGroupCounters = useCallback((options: any) => {
    setGroupCounters({
      ...groupCounters,
      ...options,
    });
  }, [groupCounters]);

  const getGroupConversationID = (groupID: string) => {
    return `GROUP${groupID}`;
  }

  useEffect(() => {
    if (groupCounterUpdated) {
      handleGroupCounters(groupCounterUpdated);
    }
  }, [groupCounterUpdated]);

  useEffect(() => {
    (async () => {
      if (liveConversation) {
        return;
      }
      if (conversation) {
        TUIConversationService.switchConversation(conversation.conversationID);
        setActiveConversation && setActiveConversation(conversation);
        setLiveConversation(conversation);
      } else {
        const timer = setTimeout(async() => {
          const res = await chat?.getConversationProfile(getGroupConversationID(groupID));
          TUIConversationService.switchConversation(res?.data?.conversation.conversationID);
          setActiveConversation && setActiveConversation(res?.data?.conversation);
          setLiveConversation(res?.data?.conversation);
          clearTimeout(timer);
        }, 1200);
      }
    })();
  }, [chat?.isReady(), conversation, liveConversation]);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | null | undefined = null;
    (async () => {
      await getGroupProfile();
      await getGroupOnlineMemberCount();
      timer = setInterval(async () => {
        await getGroupOnlineMemberCount();
      }, 1000 * 10);
    })();
    chat?.on(TencentCloudChat.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
    chat?.on(TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
    return () => {
      chat?.off(TencentCloudChat.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
      chat?.off(TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
      if (timer) {
        clearInterval(timer);
      }
      setGroup(undefined);
      setGroupCounterUpdated(undefined);
      setOwnerProfile(undefined);
      setMemberList(undefined);
      setMemberCount(0);
    };
  }, [chat?.isReady(), groupID]);

  useEffect(() => {
    (async () => {
      if (liveConversation && group) {
        await chat?.joinGroup({ groupID, type: TencentCloudChat.TYPES.GRP_AVCHATROOM });
        await getGroupCounters();
      }
    })();
  }, [chat?.isReady(), liveConversation, group]); 

  return {
    group,
    ownerProfile,
    memberCount,
    memberList,
    groupCounters,
    increaseGroupCounter,
    decreaseGroupCounter,
  };
}
