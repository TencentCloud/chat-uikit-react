import React, { useCallback } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { Toast } from '../../../Toast';
import { useUIManagerStore } from '../../../../store';

function useContactInfo() {
  const { chat } = useUIManagerStore();

  const removeFromBlocklist = useCallback((userID: string) => {
    chat.removeFromBlacklist({
      userIDList: [userID],
    });
  }, [chat]);

  const addFriend = useCallback((param: any) => {
    chat.addFriend({
      to: param?.userID,
      source: 'AddSource_Type_Web',
      remark: param?.remark,
      wording: param?.wording,
    }).catch((error: any) => {
      console.warn('delete friend failed:', error);
      Toast({
        text: error,
        type: 'error',
      });
    });
  }, [chat]);

  const deleteFriend = useCallback((userID: string) => {
    chat.deleteFriend({
      userIDList: [userID],
    });
  }, [chat]);

  const addToBlocklist = useCallback((userID: string) => {
    chat.addToBlacklist({
      userIDList: [userID],
    });
  }, [chat]);

  const acceptFriendApplication = useCallback((userID: string) => {
    chat.acceptFriendApplication({
      userID,
      type: TencentCloudChat.TYPES.SNS_APPLICATION_AGREE_AND_ADD,
    });
  }, [chat]);

  const refuseFriendApplication = useCallback((userID: string) => {
    chat.refuseFriendApplication({
      userID,
    });
  }, [chat]);
  const isFriend = (info: any): Promise<boolean> => (
    new Promise((resolve, reject) => {
      chat.checkFriend({
        userIDList: [info?.userID],
        type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_BOTH,
      })
        .then((res: any) => {
          switch (res?.data?.successUserIDList[0]?.relation) {
            case TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION:
              resolve(false);
              break;
            case TencentCloudChat.TYPES.SNS_TYPE_A_WITH_B:
              resolve(false);
              break;
            case TencentCloudChat.TYPES.SNS_TYPE_B_WITH_A:
              resolve(false);
              break;
            case TencentCloudChat.TYPES.SNS_TYPE_BOTH_WAY:
              resolve(true);
              break;
            default:
              resolve(false);
              break;
          }
        })
        .catch((error: any) => {
          console.warn('checkFriend error', error);
          reject(error);
        });
    })
  );
  const isBlock = async (userID: string) => {
    const { data } = await chat.getBlacklist();
    return data.includes(userID);
  };

  return {
    addToBlocklist,
    removeFromBlocklist,
    isFriend,
    isBlock,
    addFriend,
    deleteFriend,
    acceptFriendApplication,
    refuseFriendApplication,
  };
}

export default useContactInfo;
