import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Drawer.module.scss';

export interface IDrawerProps {
  open: boolean;
  onClose: () => void;
  direction?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
}

const Drawer: React.FC<IDrawerProps> = ({
  open,
  onClose,
  direction = 'right',
  children,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const drawerClass = [
    styles['drawer'],
    styles[`drawer--${direction}`],
    open ? styles['drawer--open'] : styles['drawer--close'],
  ].join(' ');

  const maskClass = [
    styles['drawer__mask'],
    open ? styles['drawer__mask--open'] : styles['drawer__mask--close'],
  ].join(' ');

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const content = (
    <div className={styles['drawer__wrapper']}>
      <div className={maskClass} onClick={handleMaskClick} />
      <div className={drawerClass} ref={drawerRef}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default Drawer;
