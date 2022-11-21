import React, { useState } from 'react';
import { Icon, IconTypes } from '../Icon';

import './styles/index.scss';

interface onChangeParams {
  checked?: boolean,
  value?: any,
}

interface SelectProps {
  checked?: boolean,
  className?: string,
  onChange?: (data?: onChangeParams) => void,
  value?: any,
  id?: string,
}

export function Checkbox<
T extends SelectProps
>(props:React.PropsWithChildren<T>) {
  const {
    checked: propsChecked = false,
    className,
    onChange,
    value = '',
    id,
  } = props;

  const [checked, setChecked] = useState(propsChecked);

  const handleChange = (e) => {
    setChecked(e.target.checked);
    if (onChange) {
      onChange({
        value,
        checked: e.target.checked,
      });
    }
  };

  return (
    <div
      className={`${className} checkbox`}
      role="menuitem"
      tabIndex={0}
    >
      <input id={id} className="checkbox-input" onChange={handleChange} type="checkbox" checked={checked} value={value} />
      { !checked && <i className="checkbox-default" />}
      { checked && <Icon type={IconTypes.RIGHT} width={14} height={14} />}
    </div>
  );
}
