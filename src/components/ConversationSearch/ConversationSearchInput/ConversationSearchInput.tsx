import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Icon, IconTypes } from '../../Icon';
import { Input, InputProps } from '../../Input';
import classNames from 'classnames';

import './ConversationSearchInput.scss';

type IConversationSearchInputProps = InputProps;

function ConversationSearchInput(props: IConversationSearchInputProps) {
  const {
    className,
    placeholder,
    clearable,
    value,
    onChange,
    prefix = <Icon type={IconTypes.SEARCH} height={16} width={16} />,
    onFocus,
    onBlur,
  } = props;
  const { t } = useUIKit();
  return (
    <Input
      className={classNames(
        'uikit-conversation-search-input',
        className,
      )}
      placeholder={placeholder || t('TUIConversation.Search')}
      clearable={clearable}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      prefix={prefix}
    />
  );
}

export {
  ConversationSearchInput,
  IConversationSearchInputProps,
};
