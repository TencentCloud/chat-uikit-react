import React from 'react';
import './TabList.scss';

interface TabListProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactElement[];
}

export const TabList: React.FC<TabListProps> = ({ activeTab, onChange, children }) => {
  return (
    <div className="tab-list">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.tabId === activeTab,
          onClick: onChange,
        })
      )}
    </div>
  );
};

export default TabList;