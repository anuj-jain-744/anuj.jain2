import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { IDetails } from "types/coverageplan";
import ListItemIcon from "../ListItemIcon";

interface IViewDetails {
  DetailsData: IDetails[];
  label: string;
}

const ViewDetails: React.FC<IViewDetails> = ({ DetailsData, label }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <React.Fragment>
      <div className="radio-card-view-details pt-2" role="button" tabIndex={0} onClick={handleShow}>
        View Details
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="pb-0 border-0">
          <Modal.Title className="walaa-medium-500">{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {DetailsData?.map((item, key) => {
            return (
              <div
                className="d-flex align-items-center walaa-regular-400 list-item-container"
                key={key}
              >
                <ListItemIcon title={item?.itemname} />
              </div>
            );
          })}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
export default ViewDetails;
