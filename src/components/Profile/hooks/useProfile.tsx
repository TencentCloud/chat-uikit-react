import React, { useState, useEffect } from 'react';
import { ChatSDK, Profile } from '@tencentcloud/chat';

export function useProfile(chat: ChatSDK, profileHandler?: (
  profile: Profile,
  setProfile?: React.Dispatch<React.SetStateAction<Profile>>,
) => void) {
  const [myProfile, setMyProfile] = useState<Profile>();

  const getProfile = async (userIDList: Array<string>) => {
    const res = await chat?.getUserProfile({
      userIDList,
    });
    return res.data;
  };
  const getMyProfile = async () => {
    const res = await chat?.getMyProfile();
    setMyProfile(res?.data);
  };
  useEffect(() => {
    getMyProfile();
  }, [chat]);
  return {
    myProfile,
    setMyProfile,
    getProfile,
  };
}
