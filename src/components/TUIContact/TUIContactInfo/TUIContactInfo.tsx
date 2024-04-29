import React, {
  PropsWithChildren,
} from 'react';
import { useTUIKitContext } from '../../../context';
import { isH5 } from '../../../utils/env';
import { FriendInfo } from './friendInfo';
import { BlockInfo } from './blockInfo';
import { AddFriendInfo } from './addFriendInfo';
import { FriendApplicationInfo } from './friendApplication';
import './index.scss';

interface TUIContactInfoProps {
  className?: string,
  showChat?: () => void,
}
export function UnMemoizedTUIContactInfo<T extends TUIContactInfoProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const { showChat } = props;
  const { contactData } = useTUIKitContext('TUIContact');
  if (!contactData?.type) {
    return (<> </>);
  }
  return (
    <div className={`tui-contact-info ${isH5 ? 'tui-contact-info-h5' : ''} `}>
      {contactData?.type === 'addFriend' && (<AddFriendInfo profile={contactData?.data} />)}
      {contactData?.type === 'friend' && (<FriendInfo openChat={showChat} friend={contactData?.data} />)}
      {contactData?.type === 'block' && (<BlockInfo profile={contactData?.data} />)}
      {contactData?.type === 'friendApplication' && <FriendApplicationInfo application={contactData?.data} />}
    </div>
  );
}
export const TUIContactInfo = React.memo(UnMemoizedTUIContactInfo);
