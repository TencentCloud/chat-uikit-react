import React, { useState, useEffect } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { strChineseFirstPy } from '../static/word';
import { useProfile } from '../../../hooks';

export const useConversationCreate = (
  chat,
  conversationList,
  setFriendListResultHandler?:(
    newFriendListResult: object,
    setFriendListResult: React.Dispatch<React.SetStateAction<{string:Array<object>}>>
  ) => void,
) => {
  const [friendListSortResult, setFriendListSortResult] = useState({});
  const getFirstLetter = (str: string) => {
    const temp = str.trim();
    const uni = temp.charCodeAt(0);
    if (uni > 40869 || uni < 19968) {
      return temp.charAt(0);
    }
    return strChineseFirstPy.charAt(uni - 19968);
  };
  const queryFriendList = async () => {
    const frequentlyConversationProfile = conversationList.filter(
      (item) => item.type === TencentCloudChat.TYPES.CONV_C2C,
    ).slice(0, 5).map((item) => item.userProfile);
    const { code, data } = await chat.getFriendList();
    if (code === 0) {
      const sortResult = handleData(
        data.map((item) => item.profile),
        frequentlyConversationProfile,
      );
      setFriendListSortResult(sortResult);
      if (setFriendListResultHandler) {
        setFriendListResultHandler(sortResult, setFriendListSortResult);
      }
    }
  };
  const handleData = (profileList, frequentlyConversationProfile = []) => {
    const sortResult = {
      '#': [],
    };
    for (let i = 65; i <= 90; i += 1) {
      sortResult[String.fromCharCode(i)] = [];
    }
    profileList.forEach((profile) => {
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
      sortResult[key].sort((a, b) => {
        const { nick: aNick, userID: aUserID } = a;
        const { nick: bNick, userID: bUserID } = b;
        if (aNick || aUserID < bNick || bUserID) {
          return 1;
        } if (aNick || aUserID === bNick || bUserID) {
          return 1;
        }
        return -1;
      });
    });
    return sortResult;
  };
  const { getUserProfile } = useProfile(chat);
  const getFriendListSortSearchResult = async (searchValue: string) => {
    if (!searchValue) return friendListSortResult;
    const { data: profileList } = await getUserProfile([searchValue]);

    const result = {};
    let isIncludes = false;
    Object.keys(friendListSortResult).forEach((key) => {
      result[key] = friendListSortResult[key].filter(
        ({ nick, userID }) => {
          const tempNick = nick.toLocaleLowerCase();
          const tempSearchValue = searchValue.toLocaleLowerCase();
          const includes = tempNick
            ? tempNick.includes(tempSearchValue) : userID.includes(tempSearchValue);
          isIncludes = isIncludes || includes;
          return includes;
        },
      );
    });
    if (process.env?.REACT_APP_ONLINE === 'TencentCloudDemo') {
      return result;
    }
    return !isIncludes ? handleData(profileList) : result;
  };
  useEffect(() => {
    queryFriendList();
  }, [chat]);
  return {
    getFirstLetter,
    queryFriendList,
    getFriendListSortSearchResult,
    friendListSortResult,
  };
};
