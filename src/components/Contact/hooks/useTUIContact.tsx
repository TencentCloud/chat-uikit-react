import React, { useEffect, useState } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import {
  TUIStore,
  StoreName,
  IGroupModel,
} from '@tencentcloud/chat-uikit-engine';
import { useUIManagerStore } from '../../../store';

function useTUIContact() {
  const { chat } = useUIManagerStore();
  const [friendList, setFriendList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [friendApplicationList, setFriendApplicationList] = useState([]);
  const [blocklistProfile, setBlocklistProfile] = useState([]);
  const [groupList, setGroupList] = useState<IGroupModel[]>();

  const [isShowContactList, setShowContactList] = useState(true);

  useEffect(() => {
    TUIStore.watch(StoreName.GRP, {
      groupList: onGroupListUpdated,
    });
    getFriendList();
    getBlocklist();
    getFriendApplicationList();
  }, [chat]);

  const onGroupListUpdated = (list: IGroupModel[]) => {
    setGroupList(list);
  };
  useEffect(() => {
    chat?.on(TencentCloudChat.EVENT.BLACKLIST_UPDATED, onBlocklistUpdated);
    chat?.on(TencentCloudChat.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated);
    chat?.on(
      TencentCloudChat.EVENT.FRIEND_APPLICATION_LIST_UPDATED,
      onFriendApplicationListUpdated,
    );
  }, [chat]);
  const getFriendApplicationList = async () => {
    const { data } = await chat.getFriendApplicationList();
    setFriendApplicationList(data?.friendApplicationList);
  };

  const getFriendList = async () => {
    const { code, data } = await chat?.getFriendList();
    if (code === 0) {
      setFriendList(data);
    }
  };
  const getBlocklist = async () => {
    const { data: _blocklist } = await chat?.getBlacklist();
    if (_blocklist.length === 0) {
      return;
    }
    setBlockList(_blocklist);
    getBlocklistProfile(_blocklist);
  };

  const getBlocklistProfile = async (_blocklist: string[]) => {
    const { data } = await chat.getUserProfile({
      userIDList: _blocklist,
    });
    setBlocklistProfile(data);
  };
  const onFriendApplicationListUpdated = (event: any) => {
    setFriendApplicationList(event?.data?.friendApplicationList);
  };
  const onBlocklistUpdated = (event: any) => {
    setBlockList(event.data);
    getBlocklistProfile(event.data);
  };

  const onFriendListUpdated = (event: any) => {
    setFriendList(event.data);
  };

  return {
    friendList,
    groupList,
    blocklistProfile,
    friendApplicationList,
    blockList,
    isShowContactList,
    setShowContactList,
  };
}

export default useTUIContact;
