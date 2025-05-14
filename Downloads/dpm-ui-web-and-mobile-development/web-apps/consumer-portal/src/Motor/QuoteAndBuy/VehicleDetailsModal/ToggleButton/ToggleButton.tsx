import React from 'react';
import style from './ToggleButton.module.scss';

interface ToggleProps {
  leftLabel?: string;
  rightLabel?: string;
  isActive?: boolean;
  onChange?: (value: boolean) => void;
}

const ToggleButton: React.FC<ToggleProps> = ({
  leftLabel = 'Yes',
  rightLabel = 'No',
  isActive = false,
  onChange
}) => {
  const handleClick = (value: boolean) => {
    onChange?.(value);
  };

  return (
    <div className={style.container}>
      <div className={style.tabsContainer}>
        <div 
          className={isActive ? style.toggled : style.default} 
          onClick={() => handleClick(true)}
        >
          <div className={style.text}>{leftLabel}</div>
        </div>
        <div 
          className={!isActive ? style.toggled : style.default} 
          onClick={() => handleClick(false)}
        >
          <div className={style.text}>{rightLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;