import TencentCloudChat from '@tencentcloud/chat';
import { useUIKit, useTUIContactContext } from '../../../context';

function useContactSearch() {
  const { blockList } = useTUIContactContext('TUIContactList');
  const { chat } = useUIKit('TUIContactSearch');

  const checkFriend = (info: any): Promise<any> => chat.checkFriend({
    userIDList: [info?.userID],
    type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_BOTH,
  }).then((res: any) => res?.data?.successUserIDList[0]?.relation
      === TencentCloudChat.TYPES.SNS_TYPE_BOTH_WAY);

  const isBlock = (userID: string) => (
    blockList?.includes(userID)
  );
  const getUserProfile = (userID: string) => (
    chat.getUserProfile({
      userIDList: [userID],
    })
  );

  return {
    checkFriend,
    isBlock,
    getUserProfile,
  };
}

export default useContactSearch;
