import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import warningIcon from "assets/common/dialogWarningIcon.svg";
import ThemeButton from "components/ThemeButton/ThemeButton";
import style from './DialogBox.module.scss';

interface DialogBoxProps {
    onClose: () => void;
    title?: string;
    description?: string;
    iconType?: 'warning' | 'error' | 'info' | 'success';
    totalButtons?: number;
    buttonOneText?: string;
    buttonTwoText?: string;
    subDescription?: string;
    onConfirm?: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  onClose, 
  title, 
  description, 
  subDescription,
  iconType, 
  totalButtons, 
  buttonOneText, 
  buttonTwoText,
  onConfirm 
}) => {
  const [show, setShow] = useState(true);
  
  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleConfirm = () => {
    setShow(false);
    if (onConfirm) {
      onConfirm(); 
    }
  };

  const getIcon = () => {
    switch (iconType) {
        case 'warning':
            return warningIcon;
        // case 'error':   // keeping as currently we don't have icons
        //     return errorIcon;
        // case 'info':
        //     return infoIcon;
        default:
            return warningIcon;
    }
  };

  return (
    <>
      <Modal className={style.mainContainer} show={show} onHide={handleClose} centered>
        <div className={style.container}>
            <div className={style.frameContainer}>
                <div className={style.upperFrameContainer}>
                    <img src={getIcon()} alt={iconType} />
                    <div className={style.contentContainer}>
                        <div className={style.header}>{title}</div>
                        <div className={style.descriptionContainer}>{description}</div>
                        <div className={style.subDescriptionContainer}>{subDescription}</div>
                    </div>
                </div>
                <div className={style.bottomFrameContainer}>
                  <ThemeButton 
                    variant="outline" 
                    onClickhandler={handleClose} 
                    title={buttonOneText} 
                    classes={'endoCancelBtn'}
                  />
                  {totalButtons === 2 && (
                    <ThemeButton 
                      variant="policyPrimary" 
                      onClickhandler={handleConfirm} 
                      title={buttonTwoText} 
                      classes={"endoConfirmBtn"}
                    />
                  )}
                </div>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default DialogBox;