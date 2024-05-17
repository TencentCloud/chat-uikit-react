import React, { useEffect, useRef } from 'react';
// The general logic of Switch style:
// Hide the input, then control the style through the label label and the span in the label, and add styles to the selected situation through 
// the pseudo-element selector: checked
// Note: After setting the display: inline; attribute, it is best to add vertical-align:top;, otherwise some inexplicable bugs will appear
import './Switch.scss';
import { creteNewId } from './utils/newId';

interface Props {
  checked: boolean,
  onChange: (e: React.ChangeEvent) => void,
  checkedColor?: string,
  className?: string,
}
// : React.FunctionComponent<Props>
export function Switch(props:Props) {
  const {
    checked, onChange, checkedColor = '#34C759', className,
  } = props;
  const idRef = useRef<string>(creteNewId());
  return (
    <div className="self-ui-switch">
      <label
        style={{ backgroundColor: checked ? checkedColor : undefined }}
        className={`self-ui-switch-label ${className}`}
        htmlFor={idRef.current}
      >
        <input
          checked={checked}
          onChange={onChange}
          id={idRef.current}
          className="self-ui-switch-input"
          type="checkbox"
        />
        <span className="self-ui-switch-button" />
      </label>
    </div>
  );
}
