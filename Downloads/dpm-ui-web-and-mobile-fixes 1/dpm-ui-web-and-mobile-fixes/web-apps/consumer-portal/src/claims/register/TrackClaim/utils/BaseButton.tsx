import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import download from './../../../../assets/PolicyDocuments/download.svg';
import plus from './../../../../assets/PolicyDocuments/plus.svg';
import history from './../../../../assets/PolicyDocuments/history.svg';
import rightArrow from './../../../../assets/PolicyDetails/arrowRight.svg';
import React from "react";
import './baseButton.scss'

interface IButtonType {
  isDisabled?: boolean;
  title: string;
  classes?: string;
  onClickhandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant: "primary" | "secondary" | "outline" | "linked" | 'register' | 'policyPrimary' | 'policyDownload' | 'trackClaim';
  icon?: boolean;
  iconName?: "ChevronLeft" | "Download" | "Plus" | "History" | "RightArrow";
  iconPosition?: "left" | "right";
  largeSize?: boolean;
}

const BaseButton: React.FC<IButtonType> = ({
  isDisabled = false,
  title,
  classes = '',
  variant = 'primary',
  onClickhandler,
  icon = false,
  iconName,
  iconPosition = 'left',
  largeSize = true
}) => {
  const ButtonIconFactory = (name: IButtonType['iconName']) => {
    const icons: Record<NonNullable<IButtonType['iconName']>, JSX.Element> = {
      ChevronLeft: <ChevronLeftIcon aria-label="Chevron Left" />,
      Download: <img src={download} alt="Download Document" />,
      Plus: <img src={plus} alt="Add Document" />,
      History: <img src={history} alt="View History" />,
      RightArrow: <img src={rightArrow} alt="Right Arrow" />
    };

    return name ? icons[name] : null;
  };

  const renderIcon = icon && iconName ? ButtonIconFactory(iconName) : null;

  const variantValue: Record<IButtonType['variant'], string> = {
    outline: 'outlineBtn',
    register: 'register-call2action',
    policyPrimary: 'policy-primary-right',
    linked: 'linked',
    policyDownload: 'policy-download',
    trackClaim: 'track-claim',
    primary: '',
    secondary: ''
  };

  return (
    <button
      className={`${classes} ${variantValue[variant]} ${isDisabled ? 'disabled' : ''}`}
      disabled={isDisabled}
      onClick={onClickhandler}
      title={title}
    >
      {iconPosition === 'left' ? renderIcon : null}
      {title}
      {iconPosition === 'right' ? renderIcon : null}
    </button>
  );
};

export default BaseButton;