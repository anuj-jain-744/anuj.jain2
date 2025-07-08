import React, { useState, useEffect } from "react";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import style from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import BottomSection from "../../Motor/QuoteAndBuy/VehicleDetails/VehilceDetailsCard/BottomSection";
import { LanguageData } from "types/languageData";

interface AdditionalDriverModalProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData | undefined | null;
  openAddDriverModal: () => void;
}

const AdditionalDriverModal: React.FC<AdditionalDriverModalProps> = ({
  show,
  onHide,
  languageData,
  openAddDriverModal
}) => {
  const [showAddDriverModal, setShowAddDriverModal] = useState(show);
  const popTitle = "Additional Drivers";

  useEffect(() => { 
    setShowAddDriverModal(show);
  }, [show]);

  const handleClose = () => {
    setShowAddDriverModal(false);
    onHide();
  };

  return (
    <Modal
      show={showAddDriverModal}
      onHide={handleClose}
      //   className={style.mainContainer}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>
            {/* {languageData?.additional_drivers} */}
            {popTitle}
          </div>
          <img
            src={closeIcon}
            alt="close icon"
            className={style.modalCloseIcon}
            onClick={handleClose}
          />
        </div>

        <div className={style.body}>
          <div className={style.fixedContent}>
            <BottomSection languageData={languageData} onPopShow={true} handleClose={openAddDriverModal} setShowAddDriverModal={setShowAddDriverModal}/>
          </div>

          {/* <div className={style.scrollableContent}></div> for scollable content */}
        </div>
      </div>
    </Modal>
  );
};

export default AdditionalDriverModal;
