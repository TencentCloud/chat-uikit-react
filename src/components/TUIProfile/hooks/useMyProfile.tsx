import { useCallback, useEffect, useState } from 'react';
import TIM from 'tim-js-sdk';
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
  const { tim, myProfile: contextProfile } = useTUIKitContext('useMyProfile');

  const getMyProfile = useCallback(async () => {
    if (contextProfile) {
      setMyPofile(contextProfile);
    } else {
      const res = await tim?.getMyProfile();
      setMyPofile(res?.data);
    }
  }, [tim]);

  const updateMyProfile = useCallback(async (options) => {
    const res = await tim?.updateMyProfile(options);
    const userInfo = { ...myProfile };
    const keys = Object.keys(res.data);
    keys.map((name) => {
      userInfo[name] = res.data[name];
      return name;
    });
    setMyPofile(userInfo);
    return res;
  }, [tim]);

  const onProfileUpdated = (event) => {
    console.log('onProfileUpdated', event.data); // 包含 Profile 对象的数组
  };

  useEffect(() => {
    (async () => {
      await getMyProfile();
    })();
    tim?.on(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated);
    return () => {
      tim?.off(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated);
    };
  }, [tim]);

  return {
    myProfile,
    updateMyProfile,
  };
}
