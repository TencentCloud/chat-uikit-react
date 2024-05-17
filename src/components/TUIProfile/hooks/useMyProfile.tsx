import { useCallback, useEffect, useState } from 'react';
import TencentCloudChat, { Profile } from '@tencentcloud/chat';
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
  const [myProfile, setMyPofile] = useState<Profile>();
  const { chat, myProfile: contextProfile } = useTUIKitContext('useMyProfile');

  const getMyProfile = useCallback(async () => {
    if (contextProfile) {
      setMyPofile(contextProfile);
    } else {
      const res = await chat?.getMyProfile();
      setMyPofile(res?.data);
    }
  }, [chat]);

  const updateMyProfile = useCallback(async (options: any) => {
    const res = await chat?.updateMyProfile(options);
    const userInfo: any = { ...myProfile };
    const keys = Object.keys(res.data);
    keys.map((name) => {
      userInfo[name] = res.data[name];
      return name;
    });
    setMyPofile(userInfo);
    return res;
  }, [chat]);

  const onProfileUpdated = (event: any) => {
    console.log('onProfileUpdated', event.data);
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
