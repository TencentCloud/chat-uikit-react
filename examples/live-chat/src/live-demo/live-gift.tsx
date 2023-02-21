import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Popup
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import giftIcon from './image/gift.png';
import gift_1Icon from './image/gift_1.png';
import gift_2Icon from './image/gift_2.png';
// import gift_3Icon from './image/gift_3.png';
import gift_4Icon from './image/gift_4.png';
import gift_5Icon from './image/gift_5.png';
// import gift_6Icon from './image/gift_6.png';
import gift_image from './image/gift_image.png';

import './style.scss'

interface  LiveGiftProps {
  callback?: (data:any)=>void,
}

export function LiveGift<T extends LiveGiftProps>(props: PropsWithChildren<T>):React.ReactElement  {
  const [show, setShow] = useState<boolean>(false);
  const [className, setClassName] = useState<string>('');
  const [money, setMoney] = useState<number>(99999);
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [payTotal, setpPyTotal] = useState<number>(100);


  const { callback } = props;

  const handleShow = () => {
    setShow(!show);
  }
  const handleVisible = (data:any) => {
    setClassName(`${!data.top && 'emoji-plugin-top'} ${!data.left && 'emoji-plugin-right'}`);
  }
  const giftList = [
    {
      name: 'Chat Ability',
      money: 10,
      icon: gift_1Icon,
      style: {
        background: `linear-gradient(180deg, #FF975F 0%, #FF975F 100%)`
      }
    },
    // {
    //   name: 'Unlock a random emoji',
    //   money: 320,
    //   icon: gift_2Icon,
    //   style: {
    //     background: `#8F67FF`
    //   }
    // },
    // {
    //   name: 'Send a message in',
    //   money: 320,
    //   icon: gift_3Icon,
    //   style: {
    //     background: `#7288FF`
    //   }
    // },
    {
      name: 'Unique Emoji',
      money: 20,
      icon: gift_4Icon,
      style: {
        background: `#7AE0CC`
      }
    },
    {
      name: 'Highlight',
      money: 50,
      icon: gift_5Icon,
      style: {
        background: `#5ACBEE`
      }
    },
    {
      name: 'ALL',
      money: 100,
      icon: gift_2Icon,
      style: {
        background: `#8F67FF`
      }
    },
    // {
    //   name: 'VIP',
    //   money: 2000,
    //   icon: gift_6Icon,
    //   style: {
    //     background: `linear-gradient(180deg, #000000 0%, #6D6051 100%), #69AF53`
    //   }
    // }
  ]
  const sendGift = (data:any) => {
    const val = money - data.money;
    if (val < 0) {
      return console.warn('no money');
    }
    const total = payTotal + data.money;
    setpPyTotal(total);
    const level = parseInt(`${total / 100}`, 10);
    setMoney(val);
    handleShow();
    setGiftShow(true);
    callback && callback(level);
  }

  useEffect(()=>{
    let timer = null;
    if (giftShow) {
      timer = setTimeout(() => {
        setGiftShow(false);
      }, 1000*5);
    } else {
      timer && clearTimeout(timer);
    }
  }, [giftShow])

  return (
    <div className='tui-gift'>
      <div className='tui-gift-wallet' onClick={handleShow}>
        <img className="icon-gift" src={giftIcon} alt="" />
        <span>{money}</span>
      </div>
      <Popup
      className={`tui-gift-popup ${className}`}
      show={show}
      close={handleShow}
      handleVisible={handleVisible}
    >
      <header className='tui-gift-popup-header'>
        <h1>Rewards</h1>
        <i className='icon-close' onClick={handleShow}></i>
      </header>
      <ol className='tui-gift-list'>
        {
          giftList.map((item)=>(
            <dl className='tui-gift-item' key={item.name} onClick={()=>{sendGift(item)}}>
              <dd style={item.style}>
                <img className='gift-item-icon' src={item.icon} alt="" />
                <div className='tui-gift-wallet'>
                  <img className="icon-gift" src={giftIcon} alt="" />
                  <span>{item.money}</span>
                </div>
              </dd>
              <dt className='tui-gift-name'>{item.name}</dt>
            </dl>
          ))
        }
      </ol>
    </Popup>
    { 
      giftShow && <img className='gift-image' src={gift_image} alt="" />
    }
    </div>
  )
}  