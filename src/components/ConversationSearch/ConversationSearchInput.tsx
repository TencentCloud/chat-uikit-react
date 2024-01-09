import React, { useState, useEffect, InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { Input, InputProps } from '../Input';

export function ConversationSearchInput(props:InputProps) {
  const {
    className = '',
    placeholder,
    clearable,
    value,
    onChange: handleChange,
    prefix = <Icon type={IconTypes.SEARCH} height={16} width={16} />,
  } = props;
  const { t } = useTranslation();
  return (
    <Input
      className={`conversation-search-input ${className}`}
      placeholder={placeholder || t('TUIConversation.Search')}
      clearable={clearable}
      value={value}
      onChange={handleChange}
      prefix={prefix}
    />
  );
}
