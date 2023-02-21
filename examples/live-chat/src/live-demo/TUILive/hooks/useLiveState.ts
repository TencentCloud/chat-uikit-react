import { useCallback, useEffect, useState } from 'react';
import TIM, { ChatSDK, Conversation, Group } from 'tim-js-sdk';
import { GroupCounterUpdatedOption } from '../';

export interface UseLiveStateParams {
  conversation?: Conversation,
  tim?: ChatSDK,
  groupID?: string,
  setActiveConversation?: (conversation?: Conversation | undefined) => void,
}

export function useLiveState<T extends UseLiveStateParams>(props:T) {
  const {
    tim,
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

  const getGroupProfile = useCallback(async () => {
    if (groupID && !group) {
      const res = await tim?.getGroupProfile({ groupID });
      setGroup(res?.data?.group);
      await getOwnerProfile(res?.data?.group);
    }
  }, [tim, groupID]);

  const getOwnerProfile = async (params:Group) => {
    if (params?.ownerID) {
      const res = await tim?.getGroupMemberProfile({
        groupID,
        userIDList: [params?.ownerID],
      });
      setOwnerProfile(res?.data?.memberList[0]);
    }
  };

  const getGroupOnlineMemberCount = useCallback(async () => {
    if (groupID) {
      const imResponse = await tim?.getGroupOnlineMemberCount(groupID);
      const onlineMemberCount = imResponse?.data?.memberCount;
      if (onlineMemberCount > 0) {
        const membersRes = await tim?.getGroupMemberList({ groupID, offset: 0 });
        setMemberList(membersRes?.data?.memberList);
        const memberCount = membersRes?.data?.memberList.length;
        // The maximum value of getGroupMemberList is 1000
        const Count = onlineMemberCount > memberCount ? onlineMemberCount : memberCount;
        setMemberCount(Count)
      }
    }
  }, [tim]);

  const getGroupCounters = useCallback(async () => {
    if (groupID) {
      const options = {
        groupID,
      };
      const imResponse = await tim?.getGroupCounters(options);
      setGroupCounters(JSON.parse(JSON.stringify(imResponse.data.counters)));
    }
  }, [tim, groupID]);

  const increaseGroupCounter = useCallback(async (data:GroupCounterUpdatedOption) => {
    if (groupID) {
      const options = {
        groupID,
        ...data,
      };
      const imResponse = await tim?.increaseGroupCounter(options);
      handleGroupCounters(imResponse.data.counters);
    }
  }, [tim, groupID, groupCounters]);

  const decreaseGroupCounter = useCallback(async (data:GroupCounterUpdatedOption) => {
    if (groupID) {
      const options = {
        groupID,
        ...data,
      };
      const imResponse = await tim?.decreaseGroupCounter(options);
      handleGroupCounters(imResponse.data.counters);
    }
  }, [tim, groupID, groupCounters]);

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
        setActiveConversation && setActiveConversation(conversation);
        setLiveConversation(conversation);
      } else {
        const res = await tim?.getConversationProfile(getGroupConversationID(groupID));
        setActiveConversation && setActiveConversation(res?.data?.conversation);
        setLiveConversation(res?.data?.conversation);
      }
    })();
    return () => {
      (async () => {
        if (liveConversation) {
          await tim?.deleteConversation(getGroupConversationID(groupID));
          setLiveConversation(null);
          await tim?.quitGroup(groupID);
        }
      })();
    };
  }, [tim, conversation, liveConversation]);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | null | undefined = null;
    (async () => {
      await getGroupProfile();
      await getGroupOnlineMemberCount();
      timer = setInterval(async () => {
        await getGroupOnlineMemberCount();
      }, 1000 * 10);
    })();
    tim?.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
    tim?.on(TIM.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
    return () => {
      tim?.off(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
      tim?.off(TIM.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tim, groupID]);

  useEffect(() => {
    (async () => {
      if (liveConversation && group) {
        await tim?.joinGroup({ groupID, type: TIM.TYPES.GRP_AVCHATROOM });
        await getGroupCounters();
      }
    })();
  }, [tim, liveConversation, group]);

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
