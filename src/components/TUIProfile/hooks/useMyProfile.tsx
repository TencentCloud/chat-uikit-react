import { useEffect, useState } from 'react';
import { Profile } from '@tencentcloud/chat';
import {
  TUIUserService,
  TUIStore,
  StoreName,
  UpdateMyProfileParams,
} from "@tencentcloud/chat-uikit-engine";
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
  const [myProfile, setMyProfile] = useState<Profile>();

  const updateMyProfile = (options: UpdateMyProfileParams) => {
    TUIUserService.updateMyProfile(options);
    const userInfo: any = { ...myProfile };
    setMyProfile(userInfo);
  };

  useEffect(() => {
    TUIStore.watch(StoreName.USER, {
      userProfile: (userProfileData: any) => {
        setMyProfile(userProfileData);
      },
    });
  }, []);

  return {
    myProfile,
    updateMyProfile,
  };
}
