import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import CounterComponent from "components/CounterComp";
import { sanitizeHtml } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

interface AddAdditionalTravellerProps {
  data: { [key: string]: string };
  handleNewAddition: (adult: number, child: number, srCitizen: number) => void;
}

const AddAdditionalTraveller: React.FC<AddAdditionalTravellerProps> = ({
  data,
  handleNewAddition,
}) => {
  const {
    totalCount,
    adultCount,
    childCount,
    srCitizenCount,
    setTotalCount,
    setAdultCount,
    setChildCount,
    setSrCitizenCount,
  } = useQuoteAndBuyContext();
  const [showModal, setShowModal] = useState(false);
  const [adult, setAdult] = useState<any>(adultCount);
  const [child, setChild] = useState<any>(childCount);
  const [srCitizen, setSrCitizen] = useState<any>(srCitizenCount);
  const [totalCountCopy, setTotalCountCopy] = useState<any>(totalCount);

  const handleTotalChange = (type: string, change: number) => {
    let newAdultCount = adult;
    let newChildCount = child;
    let newSrCitizenCount = srCitizen;
    switch (type) {
      case familtyFlowConstants.TITLES.ADULT:
        newAdultCount = (adult ?? 0) + change;
        setAdult(newAdultCount);
        break;
      case familtyFlowConstants.TITLES.CHILD:
        newChildCount = (child ?? 0) + change;
        setChild(newChildCount);
        break;
      case familtyFlowConstants.TITLES.SR_CITIZEN:
        newSrCitizenCount = (srCitizen ?? 0) + change;
        setSrCitizen(newSrCitizenCount);
        break;
      default:
        break;
    }
    setTotalCountCopy(
      (newAdultCount ?? 0) + (newChildCount ?? 0) + (newSrCitizenCount ?? 0)
    );
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleAdditionSubmit = () => {
    handleNewAddition(adult, child, srCitizen);
    handleClose();
  };

  return (
    <>
      <button className="traveler-add-btn" onClick={handleShow}>
        {`+ ${data?.add_traveller_button}`}
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
                  totalLimit={totalCountCopy}
                  onTotalChange={handleTotalChange}
                  type={familtyFlowConstants.TITLES.CHILD}
                  step={3}
                  countReceived={child}
                />
              </Row>
              <Row className="age-input-box col-4">
                <div
                  className="age-input-label"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(`${data?.adult}`),
                  }}
                ></div>
                <CounterComponent
                  maxLimit={2}
                  totalLimit={totalCountCopy}
                  onTotalChange={handleTotalChange}
                  type={familtyFlowConstants.TITLES.ADULT}
                  step={3}
                  countReceived={adult}
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
                  totalLimit={totalCountCopy}
                  onTotalChange={handleTotalChange}
                  type={familtyFlowConstants.TITLES.SR_CITIZEN}
                  step={3}
                  countReceived={srCitizen}
                />
              </Row>
            </Col>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary add-cancel-btn" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdditionSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddAdditionalTraveller;
