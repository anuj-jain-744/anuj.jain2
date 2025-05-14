import React, { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import CounterComponent from "./CounterComp";
import { sanitizeHtml } from "@dpm/shared-module";
import "./index.scss";

interface AddAdditionalTravellerProps {
  adultCount: number;
  childCount: number;
  srCitizenCount: number;
  setAdultCount: (count: number) => void;
  setChildCount: (count: number) => void;
  setSrCitizenCount: (count: number) => void;
  data: { [key: string]: string };
  showTravelerAddForm: () => void;
  setAdditionalCounts: (count: {
    child: number;
    adult: number;
    srCitizen: number;
  }) => void;
}

const AddAdditionalTraveller: React.FC<AddAdditionalTravellerProps> = ({
  adultCount,
  childCount,
  srCitizenCount,
  setAdultCount,
  setChildCount,
  setSrCitizenCount,
  data,
  showTravelerAddForm,
  setAdditionalCounts,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [localCounts, setLocalCounts] = useState({
    adult: 0,
    child: 0,
    srCitizen: 0,
  });
  const [intialCounts, setIntialCounts] = useState({
    adult: 0,
    child: 0,
    srCitizen: 0,
  });

  const getTotalCount = () =>
    localCounts.adult + localCounts.child + localCounts.srCitizen;

  const handleTotalChange = (type: string, change: number) => {
    setLocalCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type as keyof typeof prev] || 0) + change),
    }));
  };
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    // reset local counts to match props
    const init = {
      child: childCount,
      adult: adultCount,
      srCitizen: srCitizenCount,
    };
    setIntialCounts(init);
    setLocalCounts(init);
    setShowModal(true);
  };

  const handleNewAddition = () => {
    setAdultCount(localCounts.adult);
    setChildCount(localCounts.child);
    setSrCitizenCount(localCounts.srCitizen);
    setAdditionalCounts(typeCounts);
    handleClose();
    showTravelerAddForm();
  };
  const typeCounts = {
    child: localCounts.child - intialCounts.child,
    adult: localCounts.adult - intialCounts.adult,
    srCitizen: localCounts.srCitizen - intialCounts.srCitizen,
  };

  return (
    <>
      <button className="driver-sub1-btn" onClick={handleShow}>
        {data?.add_traveller}
      </button>

      <Modal
        show={showModal}
        centered
        onHide={handleClose}
        className="modal-lg info-modal-main"
      >
        <Modal.Header closeButton className="info-modal-head">
          <Modal.Title className="add-modal-title">
            {data?.add_traveller_button}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-modal-body">
          <div className="add-modal-info">
            {data?.select_number_of_travellers}
            <span className="text-danger">*</span>
          </div>
          <div className="add-traveler-popup">
            <Col className="age-input-warp">
              <Row className="age-input-box col-4">
                <div
                  className="age-input-label"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(`${data?.children}`),
                  }}
                ></div>
                <CounterComponent
                  maxLimit={6}
                  totalLimit={getTotalCount()}
                  onTotalChange={handleTotalChange}
                  type="child"
                  step={1}
                  countReceived={localCounts.child}
                  currentCounts={localCounts}
                />
              </Row>
              <Row className="age-input-box col-4 row-left-align">
                <div
                  className="age-input-label"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(`${data?.adult}`),
                  }}
                ></div>
                <CounterComponent
                  maxLimit={2}
                  totalLimit={getTotalCount()}
                  onTotalChange={handleTotalChange}
                  type="adult"
                  step={1}
                  countReceived={localCounts.adult}
                  currentCounts={localCounts}
                />
              </Row>
              <Row className="age-input-box col-4">
                <div
                  className="age-input-label"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(`${data?.senior_citizen}`),
                  }}
                ></div>
                <CounterComponent
                  maxLimit={2}
                  totalLimit={getTotalCount()}
                  onTotalChange={handleTotalChange}
                  type="srCitizen"
                  step={1}
                  countReceived={localCounts.srCitizen}
                  currentCounts={localCounts}
                />
              </Row>
            </Col>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary add-cancel-btn" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNewAddition}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddAdditionalTraveller;
