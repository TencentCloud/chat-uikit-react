import React, {
  PropsWithChildren,
} from 'react';
import { useUIManagerStore } from '../../../store';
import { isH5 } from '../../../utils/env';
import { FriendInfo } from './friendInfo';
import { BlockInfo } from './blockInfo';
import { AddFriendInfo } from './addFriendInfo';
import { GroupInfo } from './groupInfo';
import { FriendApplicationInfo } from './friendApplication';
import './index.scss';

interface TUIContactInfoProps {
  className?: string;
  showChats?: () => void;
}
export function UnMemoizedContactInfo<T extends TUIContactInfoProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const { showChats } = props;
  const { contactData } = useUIManagerStore('TUIContact');
  if (!contactData?.type) {
    return (<> </>);
  }
  return (
    <div className={`tui-contact-info ${isH5 ? 'tui-contact-info-h5' : ''} `}>
      {contactData?.type === 'addFriend' && (<AddFriendInfo profile={contactData?.data} />)}
      {contactData?.type === 'friend' && (<FriendInfo showChats={showChats} friend={contactData?.data} />)}
      {contactData?.type === 'block' && (<BlockInfo profile={contactData?.data} />)}
      {contactData?.type === 'group' && (<GroupInfo showChats={showChats} group={contactData?.data} />)}
      {contactData?.type === 'friendApplication' && <FriendApplicationInfo application={contactData?.data} />}
    </div>
  );
}
export const ContactInfo = React.memo(UnMemoizedContactInfo);
