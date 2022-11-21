import React, { useState, useEffect } from 'react';
import { ChatSDK, Profile } from 'tim-js-sdk';

export function useProfile(tim: ChatSDK, profileHandler?: (
  profile: Profile,
  setProfile?: React.Dispatch<React.SetStateAction<Profile>>,
) => void) {
  const [myProfile, setMyProfile] = useState<Profile>();

  const getProfile = async (userIDList: Array<string>) => {
    const res = await tim?.getUserProfile({
      userIDList,
    });
    return res.data;
  };
  const getMyProfile = async () => {
    const res = await tim?.getMyProfile();
    setMyProfile(res?.data);
  };
  useEffect(() => {
    getMyProfile();
  }, [tim]);
  return {
    myProfile,
    setMyProfile,
    getProfile,
  };
}
