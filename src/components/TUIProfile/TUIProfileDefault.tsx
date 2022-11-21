import React, { PropsWithChildren, useState } from 'react';
import DatePicker from 'react-date-picker';
import TIM, { Profile } from 'tim-js-sdk';

import { useTUIKitContext } from '../../context';

import { Avatar } from '../Avatar';
import { DivWithEdit } from '../DivWithEdit';
import { Icon, IconTypes } from '../Icon';
import { handleDisplayAvatar } from '../untils';
import { ProfileParams } from './hooks';

const gender = {
  [TIM.TYPES.GENDER_UNKNOWN]: 'unknow',
  [TIM.TYPES.GENDER_MALE]: 'male',
  [TIM.TYPES.GENDER_FEMALE]: 'female',
};

const avatarList = [
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_1.png',
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_2.png',
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_3.png',
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_4.png',
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_5.png',
  'https://im.sdk.qcloud.com/download/tuikit-resource/avatar/avatar_6.png',
];

const genderList = [
  {
    label: 'Male',
    value: TIM.TYPES.GENDER_MALE,
  },
  {
    label: 'Female',
    value: TIM.TYPES.GENDER_FEMALE,
  },
];

export interface TUIProfileDefaultProps {
  userInfo?: Profile,
  update?:(option:ProfileParams) => void,
  className?: string,
}

function TUIProfileDefaultWithContext <T extends TUIProfileDefaultProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    userInfo,
    className,
    update,
  } = props;

  const { setTUIProfileShow } = useTUIKitContext('TUIProfileDefault');

  const [isEditName, setIsEditName] = useState('');

  // show birthday famate
  const showBirthdayFormat = (value: string) => {
    if (value?.length === 8) {
      const y = Number(value.slice(0, 4));
      const m = Number(value.slice(4, 6));
      const d = Number(value.slice(-2));
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  // edit birthday famate transform
  const editBirthdayFamate = (date:Date) => {
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const year = date.getFullYear();
    return `${year}${month}${day}`;
  };

  const editListMap = [
    {
      name: 'Signature',
      value: userInfo?.selfSignature,
      type: 'text',
      children: null,
    },
    {
      name: 'Gender',
      value: gender[userInfo?.gender]?.replace(
        gender[userInfo?.gender][0],
        gender[userInfo?.gender][0]?.toLocaleUpperCase(),
      ),
      type: 'select',
      children: (
        <ul className="select-list">
          {
        genderList?.map((item, index) => {
          const key = `${item.value}${index}`;
          return (
            <li
              className="select-list-item"
              role="menuitem"
              tabIndex={index}
              key={key}
              onClick={() => { editGender(item); }}
            >
              {item.label}
            </li>
          );
        })
      }
        </ul>
      ),
    },
    {
      name: 'Birthday',
      value: userInfo?.birthday,
      type: 'select',
      children: (
        <DatePicker
          className="tui-profile-birthday"
          calendarClassName="tui-profile-birthday-calendar"
          isOpen
          format="y-MM-dd"
          onChange={(value) => { editBirthday(value); }}
          value={showBirthdayFormat(`${userInfo?.birthday}`)}
        />
      ),
    },
  ];

  const handleSetEditName = (name:string) => {
    setIsEditName(name);
  };

  const confirm = (options) => {
    update(options);
    setIsEditName('');
  };

  // edit avatar
  const editAvatar = (url:string) => {
    confirm({ avatar: url });
  };

  // edit nick / selfSignature
  const editText = (data?:any) => {
    let key = '';
    switch (data?.name) {
      case 'nick':
        key = 'nick';
        break;
      case 'Signature':
        key = 'selfSignature';
        break;
      default:
        setIsEditName('');
        return;
    }
    const options = {
      [key]: data.value,
    };
    confirm(options);
  };

  // edit gender
  const editGender = (data) => {
    confirm({ gender: data.value });
  };

  // edit birthday
  const editBirthday = (value:Date) => {
    confirm({
      birthday: Number(editBirthdayFamate(value)),
    });
  };

  return (
    <div className={`${className} tui-profile`}>
      <header className="tui-profile-header">
        <Icon
          width={9}
          height={16}
          type={IconTypes.BACK}
          onClick={() => { setTUIProfileShow(false); }}
        />
        <h1>Personal information</h1>
      </header>
      <main className="tui-profile-main">
        <div className="tui-profile-avatar">
          <Avatar
            image={handleDisplayAvatar(userInfo?.avatar)}
            size={94}
            update={editAvatar}
            list={avatarList}
          />
        </div>
        <DivWithEdit
          name="nick"
          className="tui-profile-nick"
          value={userInfo?.nick}
          type="text"
          toggle={handleSetEditName}
          isEdit={isEditName === 'nick'}
          confirm={editText}
          close={() => { setIsEditName(''); }}
        />
        <div className="tui-profile-ID">
          <h5>ID:</h5>
          <span>{userInfo?.userID}</span>
        </div>
      </main>
      <ul className="tui-profile-list">
        {
          editListMap.map((item) => {
            const key = `${item.name}`;
            return (
              <li className="tui-profile-list-item" key={key}>
                <h4>{item.name}</h4>
                <DivWithEdit
                  className="tui-profile-div-with-edit"
                  classEditName="tui-profile-edit"
                  name={item.name}
                  value={item?.value}
                  type={item.type}
                  toggle={handleSetEditName}
                  isEdit={isEditName === item.name}
                  confirm={editText}
                  close={() => { setIsEditName(''); }}
                >
                  {item?.children}
                </DivWithEdit>
              </li>
            );
          })
        }

      </ul>
    </div>
  );
}

const MemoizedTUIProfileDefault = React.memo(TUIProfileDefaultWithContext) as
typeof TUIProfileDefaultWithContext;

export function TUIProfileDefault(props: TUIProfileDefaultProps)
:React.ReactElement {
  const options = { ...props };
  return <MemoizedTUIProfileDefault {...options} />;
}
