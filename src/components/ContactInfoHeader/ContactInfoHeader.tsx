import React, { useMemo } from 'react';
import './ContactInfoHeader.scss';
import { ContactGroupItem, ContactItemType, useUIKit } from '@tencentcloud/chat-uikit-react';
import { IconChevronLeft } from '@tencentcloud/uikit-base-component-react';

interface ContactInfoHeaderProps {
  activeContact: ContactGroupItem | undefined;
  onClick: () => void;
}

export const ContactInfoHeader: React.FC<ContactInfoHeaderProps> = (props: ContactInfoHeaderProps) => {
  const { activeContact, onClick } = props;
  const { t, language } = useUIKit();
  const defaultGroupTitles: Partial<Record<ContactItemType, string>> = useMemo(() => ({
    [ContactItemType.FRIEND_REQUEST]: t('TUIContact.New contacts'),
    [ContactItemType.GROUP_REQUEST]: t('TUIContact.Group applications'),
    [ContactItemType.SEARCH_USER]: t('TUIContact.New contacts'),
    [ContactItemType.SEARCH_GROUP]: t('TUIContact.Group applications'),
    [ContactItemType.FRIEND]: t('TUIContact.My friends'),
    [ContactItemType.GROUP]: t('TUIContact.My groups'),
    [ContactItemType.BLACK]: t('TUIContact.Blacklist'),
  }), [t, language]);
  return (
    <header className="contact-header--h5">
      <button className='icon-btn'>
        <IconChevronLeft
          onClick={onClick}
          size="28px"
        />
      </button>
      <p className='contact-title'>{activeContact && defaultGroupTitles[activeContact.type]}</p>
    </header>
  );
};

export default ContactInfoHeader;
