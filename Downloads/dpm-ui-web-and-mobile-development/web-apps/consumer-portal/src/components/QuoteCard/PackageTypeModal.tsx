import React, { useState, useEffect } from "react";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import style from "../../Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import "./index.scss";
import DoneIcon from "@mui/icons-material/Done";
import { PackageItem } from "./index";

interface PackageTypeModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  packageData: PackageItem[];
}

const PackageTypeModal: React.FC<PackageTypeModalProps> = ({
  show,
  onHide,
  packageData,
  title,
}) => {

  const [showAddDriverModal, setShowAddDriverModal] = useState(show);

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
      className={`package-modal ${style.mainContainer}`}
      centered
    >
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>{title}</div>
          <img
            src={closeIcon}
            alt="close icon"
            className={style.modalCloseIcon}
            onClick={handleClose}
          />
        </div>

        <div className={style.body}>
          <div className={style.fixedContent}>
            <ul className="quote-list">
              {packageData.map((packageitem: PackageItem) => (
                <li>
                  <DoneIcon />
                  {packageitem.itemname}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PackageTypeModal;
