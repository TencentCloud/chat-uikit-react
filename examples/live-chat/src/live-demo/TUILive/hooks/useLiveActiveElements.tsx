import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Icon, IconTypes } from '@tencentcloud/chat-uikit-react';
import { useTUILiveContext } from '..';

interface ativeClickReturn {
  value?: boolean,
  suffixValue?: boolean,
}

interface useLiveAtiveBasicParams {
  className?: string,
  icon?: IconTypes,
  activeIcon?: IconTypes,
  iconWidth?: number,
  iconHeight?: number,
  name?: string,
  key?: string,
  value?: boolean,
  onClick?: () => Promise<ativeClickReturn>;
}

export interface useLiveAtiveElementsParams extends useLiveAtiveBasicParams {
  suffix?: useLiveAtiveBasicParams;
}

export function useLiveActiveElements<T extends useLiveAtiveElementsParams>(
  props:PropsWithChildren<T>,
) {
  const {
    name,
    key = '',
    icon,
    activeIcon,
    value: propsValue,
    className,
    suffix,
    iconWidth,
    iconHeight,
  } = props;

  const {
    increaseGroupCounter,
    decreaseGroupCounter,
    callback,
  } = useTUILiveContext('TUILiveHeader');

  const [value, setValue] = useState(false);
  const [suffixValue, setSuffixValue] = useState(false);

  const hadnleGroupCounter = useCallback(async (data:boolean) => {
    if (data && increaseGroupCounter) {
      await increaseGroupCounter({
        key,
        value: 1,
      });
    } 
    if (!data && decreaseGroupCounter) {
      await decreaseGroupCounter({
        key,
        value: 1,
      });
    }
    callback && callback(key);
  }, [increaseGroupCounter, decreaseGroupCounter, callback, key]);

  const handleClick = async () => {
    await hadnleGroupCounter(!value);
    setValue(!value);
    setSuffixValue(false);
  };

  const handleSuffixClick = async () => {
    if (value) {
      await hadnleGroupCounter(suffixValue);
    }
    setSuffixValue(!suffixValue);
    setValue(false);
  };
  useEffect(() => {
    if (propsValue) {
      setValue(propsValue);
    }
  }, [propsValue]);

  useEffect(() => {
    if (suffix?.value) {
      setSuffixValue(suffix?.value);
    }
  }, [suffix?.value]);
  return (
    <li className="tui-live-item opate-item" key={name}>
      <div className="opate-box" role="menuitem" tabIndex={0} onClick={handleClick}>
        <Icon type={value ? activeIcon : icon} width={iconWidth || 15} height={iconHeight || 15} />
        <span className="list-item-text">{name}</span>
      </div>
      {
        suffix && (
        <div role="menuitem" tabIndex={0} className="opate-item-suffix line opate-box" onClick={handleSuffixClick}>
          <Icon
            type={suffixValue ? suffix.activeIcon : suffix.icon}
            width={iconWidth || 15}
            height={iconHeight || 15}
          />
        </div>
        )
      }
    </li>
  );
}
