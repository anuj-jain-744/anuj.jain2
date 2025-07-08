import React, { useEffect, useState } from "react";
import { Accordion, Card, Row, Col, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import yesIcon from "assets/common/danger_close_circle.svg";
import noIcon from "assets/common/success_tick_circle.svg";
import { getAmountWithIcon } from "@app-shell/utils/common";
import {
  coverageTypeIdMap,
  TRAVEL_PLAN_TYPE,
  TRAVELER,
  commonKeywords,
} from "constant";
import "./index.scss";

interface CompareBenefitPopupProps {
  data: any;
  onClose: () => void;
  plan: string;
}

const CompareBenefitPopup: React.FC<CompareBenefitPopupProps> = ({ data, onClose, plan }) => {

  let benefits = [];
  let plan1 = [];
  let plan2 = [];
  let coverage_accordions = [];
  let headers = [];
  
  if (plan === coverageTypeIdMap.worldwide) {
    benefits = data?.worldwide_benefits[0].benefits;
    plan1 = data?.worldwide_benefits[0].pearl;
    plan2 = data?.worldwide_benefits[0].traveller;
    coverage_accordions = data?.worldwide_accordions;
    headers = data?.worldwide_headers;

  } else if (plan === coverageTypeIdMap.worldwide1) {
    benefits = data?.worldwide_except_benefits[0].benefits;
    plan1 = data?.worldwide_except_benefits[0].pearl;
    plan2 = data?.worldwide_except_benefits[0].traveller;
    coverage_accordions = data?.worldwide_except_accordians;
    headers = data?.worldwide_except_headers;
  } else if (plan === coverageTypeIdMap.europe) {
    benefits = data?.europe_benefits[0].benefits;
    plan1 = data?.europe_benefits[0].schengen;
    plan2 = data?.europe_benefits[0].europe;
    coverage_accordions = data?.europe_accordions;
    headers = data?.europe_headers;
  }




  const groupBenefitsUnderAccordions = () => {
    const groupedBenefits = [];
    const staticRows = benefits.slice(0, 1).map((benefit, index) => ({
      header: null,
      items: [benefit],
      plan1: [plan1[index]],
      plan2: [plan2[index]]
    }));
    groupedBenefits.push(...staticRows);
    let currentAccordion = null;
    benefits.slice(1).forEach((benefit, index) => {
      const adjustedIndex = index + 1;
      if (coverage_accordions.includes(benefit)) {
        currentAccordion = {
          header: benefit,
          items: [],
          plan1: [],
          plan2: []
        };
        groupedBenefits.push(currentAccordion);
      } else if (currentAccordion) {
        currentAccordion.items.push(benefit);
        currentAccordion.plan1.push(plan1[adjustedIndex]);
        currentAccordion.plan2.push(plan2[adjustedIndex]);
      } else {
        groupedBenefits.push({
          header: null,
          items: [benefit],
          plan1: [plan1[adjustedIndex]],
          plan2: [plan2[adjustedIndex]]
        });
      }
    });

    return groupedBenefits;
  };

  const groupedBenefits = groupBenefitsUnderAccordions();

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  }
  useEffect(() => {
    setActiveAccordion(1)
  }, [])

  return (<Modal
    show={true}
    onHide={onClose}
    centered
    className="compare-modal-custom"
    size="lg"
  >
    <Modal.Header className="compare_header">
      <Modal.Title data-testid="tooltip-title" className="custom_modal_title">{data?.compare_benefits}</Modal.Title>
      <CloseIcon data-testid="img-role" className="compare_modal-close-icon" onClick={onClose} />

    </Modal.Header>

    <Modal.Body>
      <div className="table">
        <Row className="header-row">
          {headers.map((header: string, index: number) => (
            <Col
              key={index}
              className={`header-cell text-center ${index === 0
                  ? "col-bg-one col-md-6 force-white"
                  : index === 1
                    ? "col-md-3 col-bg-two msplit-text"
                    : index === 2
                      ? "col-md-3 col-bg-three split-text"
                      : ""
                }`}

            >
              {index === 1 || index === 2 ? (
                <>
                  <div className="first-word">{header.split(" ")[0] == TRAVEL_PLAN_TYPE.type_traveller ? TRAVELER : header.split(" ")[0]}</div>
                  <div className="remaining-words">
                    {header
                      .split(" ")
                      .slice(1)
                      .map((word, i) =>
                        word === data?.sar ? (
                          <span key={i} className="small-text"></span>
                        ) : (
                          <span key={i}>{getAmountWithIcon(word)}</span>
                        )
                      )}
                  </div>
                </>
              ) : (
                <span>{data?.coverage_benefits}</span>
              )}
            </Col>
          ))}
        </Row>


        {groupedBenefits.map((group, index) => {
          if (group.header) {
            return (
              <div key={index} className="accordion-section-compare-benefit">
                <Accordion activeKey={activeAccordion}>
                  <Row className="accordion-header">
                    <Col md={6} className="benefit-cell">
                      <Accordion.Button
                        as={Card.Header}
                        eventKey={index}
                        className="acc-button d-flex justify-content-between"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className='trvl-benfit-name'>{group.header}</span>
                      </Accordion.Button>
                    </Col>

                    <>
                      <Col md={3} className="benefit-cell"></Col>
                      <Col md={3} className="benefit-cell"></Col>
                    </>

                  </Row>

                  <Accordion.Collapse eventKey={index}>
                    <>
                      {group.items.map((item, itemIndex) => (
                        <Row key={itemIndex} className="benefit-row">
                          <Col md={6} className={`benefit-cell benefit-cell-first ${itemIndex === 0 ? 'btm-underline-top' : ''}`}>
                            {item}
                          </Col>
                          <Col md={3} className={`benefit-cell text-content ${itemIndex === 0 ? 'btm-underline-top' : ''}`}>
                          {group.plan1[itemIndex] === commonKeywords.Yes ? (
                              <img src={yesIcon} alt={group.plan1[itemIndex]} />
                            ) : group.plan1[itemIndex] === commonKeywords.No ? (
                              <img src={noIcon} alt={group.plan1[itemIndex]} />
                            ) : (
                              group.plan1[itemIndex]
                            )}
                          </Col>
                          <Col md={3} className={`benefit-cell text-content ${itemIndex === 0 ? 'btm-underline-top' : ''}`}>
                          {group.plan2[itemIndex] === commonKeywords.Yes ? (
                              <img src={yesIcon} alt={group.plan2[itemIndex]} />
                            ) : group.plan2[itemIndex] === commonKeywords.No ? (
                              <img src={noIcon} alt={group.plan2[itemIndex]} />
                            ) : (
                              group.plan2[itemIndex]
                            )}
                          </Col>
                        </Row>
                      ))}
                    </>
                  </Accordion.Collapse>
                </Accordion>
              </div>
            );



          }
          else {
            return (<Row key={index} className="benefit-row btm-underline justify-content-center">
              <Col className="benefit-cell benefit-cell-empty-left benefit-cell-first first-col" md={6}></Col>
              <Col className={`benefit-cell benefit-cell-first first-col ${index === 1 ? "last-row" : ""}`} md={3}>{group.plan1[0]}</Col>
              <Col className={`benefit-cell benefit-cell-last first-col ${index === 1 ? "last-row" : ""}`} md={3}>{group.plan2[0]}</Col>

            </Row>);
          }
        })}
      </div>
    </Modal.Body>
  </Modal>);

};

export default CompareBenefitPopup;