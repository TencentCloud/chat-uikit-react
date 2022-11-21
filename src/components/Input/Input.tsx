import React, {
  useRef, useState, useImperativeHandle, InputHTMLAttributes,
} from 'react';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'>
{
  className?: string,
  customClassName?: string,
  placeholder?: string,
  clearable?: boolean,
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
  value?: InputHTMLAttributes<HTMLInputElement>['value'],
  border?: '' | 'bottom',
  disabled?: boolean,
  maxLength?: number
}
export interface InputRef {
  focus: (options?: object) => void;
  blur: () => void;
  input: HTMLInputElement | null;
}
export const Input = React.forwardRef<InputRef, InputProps>(
  (props:InputProps, ref):React.ReactElement => {
    const {
      className = '',
      customClassName = '',
      placeholder,
      clearable = false,
      prefix,
      suffix,
      onChange,
      onBlur,
      onFocus,
      value: propsValue = '',
      border = '',
      disabled = false,
      maxLength = undefined,
    } = props;

    const [focused, setFocused] = useState<boolean>(false);

    const [value, setValue] = useState(propsValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFocus = (e) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlur = (e) => {
      setFocused(false);
      onBlur?.(e);
    };
    const clearInput = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setValue('');
      focus();
      const currentTarget = inputRef.current.cloneNode(true) as HTMLInputElement;
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
        inputRef.current.focus();
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
            className={`tui-kit-input ${customClassName}`}
            placeholder={placeholder}
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {suffix}
          {(clearable && value)
          && <Icon type={IconTypes.CLEAR} height={13} width={13} onClick={clearInput} />}
        </div>
      </div>
    );
  },
);
