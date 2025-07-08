import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import download from './../../assets/PolicyDetails/Download.svg';
import plus from './../../assets/PolicyDocuments/plus.svg';
import history from './../../assets/PolicyDocuments/history.svg';
import rightArrow from './../../assets/PolicyDetails/arrowRight.svg';
import Receipt from './../../assets/PolicyDetails/Receipt.svg';
import accountCircle from './../../assets/PolicyDetails/accountCircle.svg';
import manageaccounts from './../../assets/PolicyDetails/manageaccounts.svg';
import Change from 'assets/Dashboard/Change.svg';
import time from './../../assets/PolicyDetails/time.svg';
import receiptLong from './../../assets/PolicyDetails/receiptLong.svg';
import upload from 'assets/TrackYourClaim/upload.svg';
import plusWhite from './../../assets/QuoteAndBuy/plusWhite.svg';
import rightArrowDark from './../../assets/PolicyDetails/rightArrowDark.svg';
import arrowRightRed from './../../assets/AlertIcon/arrowRightRed.svg';
import closeIcon from './../../assets/AlertIcon/closeIcon.svg';


// import './ThemeButton.scss';

type IconName = "Upload" | "ChevronLeft" | "ChevronRight" | "Download" | "Plus" | "History" | "RightArrow" | "Receipt" | "AccountCircle" | "ManageAccounts" | "Change" | "Time" | "ReceiptLong" | "PlusWhite" | "RightArrowDark" | "ArrowRightRed" | "CloseIcon";

type ButtonVariant = "dashboardSlide" | "outline" | "removeNo" | "renewOutline" | "removeYes" | "outlineVehicleDetails" | "linked" | 'register' | 'policyPrimary' | 'policyDownload' | 'trackClaim' | 'policyLink' | 'addEmail' | 'policyDetails' | 'register-call2action' | 'addDriver' | 'removeNo' | 'removeYes' | 'outlineVehicleDetails' | 'renewOutline' | 'dashboardSlide' | 'linked' | 'filterBtnsActive' | 'filterBtnsInactive' | 'filterBtnsDisabled';

interface IButtonTypeBase {
  isDisabled?: boolean;
  title: string | undefined;
  classes?: string;
  onClickhandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant: ButtonVariant;
  iconPosition?: "left" | "right";
  dataTestId?: string;
  buttonTitle: string;
}

interface IButtonTypeWithIcon extends IButtonTypeBase {
  icon: true;
  iconName: IconName;
}

interface IButtonTypeWithoutIcon extends IButtonTypeBase {
  icon?: false;
  iconName?: never;
}

type IButtonType = IButtonTypeWithIcon | IButtonTypeWithoutIcon;

const ThemeButton: React.FC<IButtonType> = ({
  isDisabled = false,
  title,
  classes = '',
  variant,
  onClickhandler,
  icon = false,
  iconName,
  iconPosition = 'left',
  dataTestId,
  buttonTitle,
}) => {
  
  const ButtonIconFactory = (name: IconName): JSX.Element => {
    const icons: Record<IconName, JSX.Element> = {
      ChevronLeft: <ChevronLeftIcon aria-label="Chevron Left" />,
      ChevronRight: <ChevronRightIcon aria-label="Chevron Right" />,
      Download: <img src={download} alt="Download Document" />,
      Plus: <img src={plus} alt="Add Document" />,
      History: <img src={history} alt="View History" />,
      RightArrow: <img src={rightArrow} alt="Right Arrow" />,
      Receipt: <img src={Receipt} alt="Receipt long" />,
      AccountCircle: <img src={accountCircle} alt="Account Circle" />,
      ManageAccounts: <img src={manageaccounts} alt="Manage Accounts" />,
      Change: <img src={Change} alt="Change" />,
      Time: <img src={time} alt="Time" />,
      ReceiptLong: <img src={receiptLong} alt="Receipt Long" />,
      Upload: <img src={upload} alt="Upload Document" />,
      PlusWhite: <img src={plusWhite} alt="Plus White" />,
      RightArrowDark: <img src={rightArrowDark} alt="Right Arrow Dark" />,
      ArrowRightRed: <img src={arrowRightRed} alt="Arrow Right Red" />,
      CloseIcon: <img src={closeIcon} alt="Arrow Right Red" />,
    };
    
    return icons[name];
  };

  const renderIcon = icon && iconName ? ButtonIconFactory(iconName) : null;

  const variantValue: Record<ButtonVariant, string> = {
    outline: 'outlineBtn',
    register: 'register-call2action',
    policyPrimary: 'policy-primary-right',
    linked: 'linked',
    policyDownload: 'policy-download',
    trackClaim: 'track-claim',
    policyLink: 'policy-link',
    policyDetails: 'policy-details',
    addDriver: 'add-driver',
    removeNo: 'remove-no',
    removeYes: 'remove-yes',
    outlineVehicleDetails: 'outline-vehicle-details',
    renewOutline: 'renew-outline',
    dashboardSlide: 'dashboardSlideBtn',
    addEmail: 'addEmail',
    filterBtnsActive: 'filterBtnsActive',
    filterBtnsInactive: 'filterBtnsInactive',
    filterBtnsDisabled: 'filterBtnsDisabled',
  };
  return (
    <button
      className={`${classes} ${variantValue[variant]} ${isDisabled ? 'disabled' : ''}`}
      disabled={isDisabled}
      onClick={onClickhandler}
      title={buttonTitle? buttonTitle : title}
      data-testid={dataTestId}
    >
      {iconPosition === 'left' && renderIcon}
      {title}
      {iconPosition === 'right' && renderIcon}
    </button>
  );
};

export default ThemeButton;