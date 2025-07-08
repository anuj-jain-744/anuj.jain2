import { useState, useMemo } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import CounterComponent from "components/CounterComp";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { sanitizeHtml } from "@dpm/shared-module";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

interface PropTypes {
  data: { [key: string]: string };
  handleNewAddition: (adult: number, child: number, srCitizen: number) => void;
  handleClose: () => void;
}

const AddAdditionalTraveller = ({
  data,
  handleNewAddition,
  handleClose,
}: PropTypes) => {
  const { adultCount, childCount, srCitizenCount } = useQuoteAndBuyContext();
  const defaultCount = useMemo(
    () => ({
      child: childCount,
      adult: adultCount,
      senior: srCitizenCount,
    }),
    []
  );
  const [counts, setCounts] = useState({
    [familtyFlowConstants.TITLES.CHILD]: childCount,
    [familtyFlowConstants.TITLES.ADULT]: adultCount,
    [familtyFlowConstants.TITLES.SR_CITIZEN]: srCitizenCount,
  });

  const handleCountChange = (type: string, change: number) => {
    setCounts({ ...counts, [type]: counts[type] + change });
  };

  const handleAdditionSubmit = () => {
    const additions = Object.values(counts);
    handleNewAddition(additions[0], additions[1], additions[2]);
    handleClose();
  };

  return (
    <Modal
      show
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
                type={familtyFlowConstants.TITLES.CHILD}
                defaultCount={defaultCount.child}
                maxLimit={6}
                onTotalChange={handleCountChange}
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
                type={familtyFlowConstants.TITLES.ADULT}
                defaultCount={defaultCount.adult}
                maxLimit={2 - counts[familtyFlowConstants.TITLES.SR_CITIZEN]}
                onTotalChange={handleCountChange}
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
                type={familtyFlowConstants.TITLES.SR_CITIZEN}
                defaultCount={defaultCount.senior}
                maxLimit={2 - counts[familtyFlowConstants.TITLES.ADULT]}
                onTotalChange={handleCountChange}
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
          {data?.submit}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAdditionalTraveller;
