import React, { useEffect, useState } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { useTUIKitContext } from '../../../context';

function useTUIContact() {
  const { chat } = useTUIKitContext();
  const [friendList, setFriendList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [friendApplicationList, setFriendApplicationList] = useState([]);
  const [blocklistProfile, setBlocklistProfile] = useState([]);
  const [isShowContactList, setShowContactList] = useState(true);

  useEffect(() => {
    getFriendList();
    getBlocklist();
    getFriendApplicationList();
  }, [chat]);

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
    const { code, data } = await chat.getFriendList();
    if (code === 0) {
      setFriendList(data);
    }
  };
  // todo: 获取 100个
  const getBlocklist = async () => {
    const { data: _blocklist } = await chat.getBlacklist();
    if (_blocklist.length === 0) {
      return;
    }
    setBlockList(_blocklist);
    getBlocklistProfile(_blocklist);
  };

  const getBlocklistProfile = async (_blocklist: Array<string>) => {
    const { data } = await chat.getUserProfile({
      userIDList: _blocklist,
    });
    setBlocklistProfile(data);
  };
  const onFriendApplicationListUpdated = (event) => {
    setFriendApplicationList(event?.data?.friendApplicationList);
  };
  const onBlocklistUpdated = (event) => {
    setBlockList(event.data);
    getBlocklistProfile(event.data);
  };

  const onFriendListUpdated = (event) => {
    setFriendList(event.data);
  };

  return {
    friendList,
    blocklistProfile,
    friendApplicationList,
    blockList,
    isShowContactList,
    setShowContactList,
  };
}

export default useTUIContact;
