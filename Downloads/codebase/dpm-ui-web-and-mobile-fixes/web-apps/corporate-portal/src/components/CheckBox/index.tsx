import React from 'react';
import "./index.scss";

interface CheckboxWithLabelProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {

  return (
    <div className={`checkBox-view ${className}`}>
      <input
        className='checkBox'
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        className='label-text'
        htmlFor={id}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
};

export default CheckboxWithLabel;

