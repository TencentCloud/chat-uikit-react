import React from 'react';
import './Tab.scss';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';

interface TabProps {
  tabId: string;
  label: string;
  active?: boolean;
  onClick?: (tabId: string) => void;
  Icon?: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ tabId, label, active = false, onClick, Icon }) => {
  const { t } = useUIKit();
  return (
    <div
      className={`tab ${active ? 'active' : ''}`}
      onClick={() => onClick?.(tabId)}
    >
      { Icon }
      { t(label) }
    </div>
  );
};

export default Tab;