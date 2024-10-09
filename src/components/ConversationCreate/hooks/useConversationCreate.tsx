import React, { useState, useEffect } from 'react';
import { StoreName, TUIStore, TUIUserService, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import TencentCloudChat, { Friend, Profile } from '@tencentcloud/chat';
import { strChineseFirstPy } from '../static/word';

export const useConversationCreate = (
  conversationList: IConversationModel[],
  setFriendListResultHandler?: (
    newFriendListResult: object,
    setFriendListResult: React.Dispatch<React.SetStateAction<{ string: object[] }>>
  ) => void,
) => {
  const [friendListSortResult, setFriendListSortResult] = useState<any>();
  const getFirstLetter = (str: string) => {
    const temp = str.trim();
    const uni = temp.charCodeAt(0);
    if (uni > 40869 || uni < 19968) {
      return temp.charAt(0);
    }
    return strChineseFirstPy.charAt(uni - 19968);
  };
  const queryFriendList = async (friendList: Friend[]) => {
    const frequentlyConversationProfile = conversationList.filter(
      (item: IConversationModel) => item?.type === TencentCloudChat.TYPES.CONV_C2C,
    ).slice(0, 5).map((item: IConversationModel) => item?.userProfile);
    const sortResult = handleData(
      friendList?.map((item: Friend) => item.profile),
      frequentlyConversationProfile,
    );
    setFriendListSortResult(sortResult);
    if (setFriendListResultHandler) {
      setFriendListResultHandler(sortResult, setFriendListSortResult);
    }
  };
  function handleData(profileList: Profile[], frequentlyConversationProfile?: any) {
    const sortResult: any = {
      '#': [],
    };
    for (let i = 65; i <= 90; i += 1) {
      sortResult[String.fromCharCode(i)] = [];
    }
    profileList?.forEach((profile) => {
      const { nick, userID } = profile;
      const first = getFirstLetter(nick || userID);
      if (first >= 'a' && first <= 'z') {
        sortResult[first.toLocaleUpperCase()].push(profile);
      } else if (first < 'A' || first > 'z') {
        sortResult['#'].push(profile);
      } else {
        sortResult[first].push(profile);
      }
    });
    Object.keys(sortResult).forEach((key) => {
      sortResult[key].sort((a: any, b: any) => {
        const { nick: aNick, userID: aUserID } = a;
        const { nick: bNick, userID: bUserID } = b;
        if (aNick || aUserID <= bNick || bUserID) {
          return 1;
        }
        return -1;
      });
    });
    return sortResult;
  }
  // const { getUserProfile } = useProfile();
  const getFriendListSortSearchResult = async (searchValue: string) => {
    if (!searchValue) return friendListSortResult;
    const { data } = await TUIUserService.getUserProfile({
      userIDList: [searchValue],
    });
    const result: any = {};
    let isIncludes = false;
    Object.keys(friendListSortResult).forEach((key) => {
      result[key] = friendListSortResult[key].filter(
        // eslint-disable-next-line
        // @ts-ignore
        ({ nick, userID }) => {
          const tempNick = nick?.toLocaleLowerCase();
          const tempSearchValue = searchValue.toLocaleLowerCase();
          const userIDValue = userID.toLocaleLowerCase();
          let includes;
          if (process.env?.REACT_APP_ONLINE === 'TencentCloudDemo') {
            includes = tempNick ? tempNick.includes(tempSearchValue) : userIDValue.includes(tempSearchValue);
          } else {
            includes = userIDValue === tempSearchValue;
          }
          isIncludes = isIncludes || includes;
          return includes;
        },
      );
    });
    if (process.env?.REACT_APP_ONLINE === 'TencentCloudDemo') {
      return result;
    }
    return !isIncludes ? handleData(data) : result;
  };

  function onFriendListUpdated(list: Friend[]) {
    queryFriendList(list);
  }

  useEffect(() => {
    TUIStore.watch(StoreName.FRIEND, {
      friendList: onFriendListUpdated,
    });
    return () => {
      TUIStore.unwatch(StoreName.FRIEND, {
        friendList: onFriendListUpdated,
      });
    };
  }, []);
  return {
    getFirstLetter,
    queryFriendList,
    getFriendListSortSearchResult,
    friendListSortResult,
  };
};
