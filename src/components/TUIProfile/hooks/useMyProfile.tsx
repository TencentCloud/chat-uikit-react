import { useCallback, useEffect, useState } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { useTUIKitContext } from '../../../context';

export interface ProfileParams {
  nick?: string,
  avatar?: string,
  gender?: string,
  selfSignature?: string,
  allowType?: string,
  birthday?: number,
  location?: string,
  language?: string,
  messageSettings?: number,
  adminForbidType?: string,
  level?: number,
  role?: number,
  profileCustomField?: Array<any>,
}

export function useMyProfile() {
  const [myProfile, setMyPofile] = useState(null);
  const { chat, myProfile: contextProfile } = useTUIKitContext('useMyProfile');

  const getMyProfile = useCallback(async () => {
    if (contextProfile) {
      setMyPofile(contextProfile);
    } else {
      const res = await chat?.getMyProfile();
      setMyPofile(res?.data);
    }
  }, [chat]);

  const updateMyProfile = useCallback(async (options) => {
    const res = await chat?.updateMyProfile(options);
    const userInfo = { ...myProfile };
    const keys = Object.keys(res.data);
    keys.map((name) => {
      userInfo[name] = res.data[name];
      return name;
    });
    setMyPofile(userInfo);
    return res;
  }, [chat]);

  const onProfileUpdated = (event) => {
    console.log('onProfileUpdated', event.data); // 包含 Profile 对象的数组
  };

  useEffect(() => {
    (async () => {
      await getMyProfile();
    })();
    chat?.on(TencentCloudChat.EVENT.PROFILE_UPDATED, onProfileUpdated);
    return () => {
      chat?.off(TencentCloudChat.EVENT.PROFILE_UPDATED, onProfileUpdated);
    };
  }, [chat]);

  return {
    myProfile,
    updateMyProfile,
  };
}
