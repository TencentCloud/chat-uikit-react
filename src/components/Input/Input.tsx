/* eslint-disable react/display-name */
import React, {
  useRef, useState, useImperativeHandle, InputHTMLAttributes,
} from 'react';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  clearable?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  border?: '' | 'bottom';
  disabled?: boolean;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
export interface InputRef {
  focus: (options?: object) => void;
  blur: () => void;
  input: HTMLInputElement | null;
}
export const Input = React.forwardRef<InputRef, InputProps>(
  (props: InputProps, ref): React.ReactElement => {
    const {
      className = '',
      inputClassName = '',
      placeholder,
      clearable = false,
      prefix,
      suffix,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      value: propsValue = '',
      border = '',
      disabled = false,
      maxLength = undefined,
    } = props;

    const [focused, setFocused] = useState<boolean>(false);
    const enterCodeList = ['Enter', 'NumpadEnter'];
    const [value, setValue] = useState(propsValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFocus = (e: any) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlur = (e: any) => {
      setFocused(false);
      onBlur?.(e);
    };
    const handleEnterKeyDown = (e: any) => {
      if (enterCodeList.indexOf(e?.key) > -1 && onKeyDown) {
        e?.preventDefault();
        onKeyDown(e);
      }
    };
    const clearInput = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setValue('');
      focus();
      const currentTarget = inputRef?.current?.cloneNode(
        true,
      ) as HTMLInputElement;
      const event = Object.create(e, {
        target: { value: currentTarget },
        currentTarget: { value: currentTarget },
      });
      currentTarget.value = '';
      onChange?.(event as React.ChangeEvent<HTMLInputElement>);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (inputRef.current) {
        onChange?.(e);
      }
    };
    const focus = () => {
      if (inputRef.current) {
        inputRef.current.focus({
          preventScroll: true,
        });
      }
    };
    useImperativeHandle(ref, () => ({
      focus,
      blur: () => {
        inputRef.current?.blur();
      },
      input: inputRef.current,
    }));

    return (
      <div className={`${className} tui-kit-input-container`}>
        <div className={`tui-kit-input-box ${border && `tui-kit-input-border--${border}`} ${focused ? 'tui-kit-input-box--focus' : 'tui-kit-input-box--blur'}`}>
          {prefix}
          <input
            maxLength={maxLength}
            disabled={disabled}
            className={`tui-kit-input ${inputClassName}`}
            placeholder={placeholder}
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleEnterKeyDown}
          />
          {suffix}
          {(clearable && value)
          && <Icon type={IconTypes.CLEAR} height={13} width={13} onClick={(e: any) => { clearInput(e); }} />}
        </div>
      </div>
    );
  },
);
