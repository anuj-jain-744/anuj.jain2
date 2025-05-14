import React, { useState } from 'react';
import { Accordion, Card, Row, Col, Button, Modal } from 'react-bootstrap';
import './index.scss';
import CloseIcon from "@mui/icons-material/Close";
import { TRAVEL_PLAN_TYPE, CURRENCY, TRAVELER, coverageTypeIdMap, } from "../../../constant";
import { getAmountWithIcon } from "@app-shell/utils/common";
interface ViewBenefitPopupProps {
  data: any;
  onClose: () => void;
  plan: string;
  coveragetypeselected: string;
}

const ViewBenefitPopup: React.FC<ViewBenefitPopupProps> = ({ data, onClose, plan, coveragetypeselected }) => {

  let benefits = [];
  let plan1 = [];
  let coverage_accordions = [];
  let headers = [];

  const getHearderItems = (searchKey: string, headers: string[]): string[] => {
    const result = headers.length > 0 ? [headers[0]] : [];
    if (searchKey && headers.length > 1) {
      const lowercaseSearchKey = searchKey.toLowerCase();
      const matchinHeader = headers.find(header => header.toLowerCase().includes(lowercaseSearchKey));
      if (matchinHeader && !result.includes(matchinHeader)) {
        result.push(matchinHeader);
      }
    }
    return result;
  }

  if (plan === coverageTypeIdMap.worldwide && TRAVEL_PLAN_TYPE.type_family === coveragetypeselected) {
    benefits = data?.family_benefits[0].benefits;
    plan1 = TRAVEL_PLAN_TYPE.type_family === coveragetypeselected ? data?.family_benefits[0].family : data?.family_benefits[0].family;
    coverage_accordions = data?.family_accordions;
    headers = getHearderItems(coveragetypeselected, data?.family_headers);
  }

  else if (plan === coverageTypeIdMap.worldwide) {
    benefits = data?.worldwide_benefits[0].benefits;
    plan1 = TRAVEL_PLAN_TYPE.type_pearl === coveragetypeselected ? data?.worldwide_benefits[0].pearl : data?.worldwide_benefits[0].traveller;
    coverage_accordions = data?.worldwide_accordions;
    headers = getHearderItems(coveragetypeselected, data?.worldwide_headers);

  } else if (plan === coverageTypeIdMap.worldwide1) {
    benefits = data?.worldwide_except_benefits[0].benefits;
    plan1 = TRAVEL_PLAN_TYPE.type_pearl === coveragetypeselected ? data?.worldwide_except_benefits[0].pearl : data?.worldwide_except_benefits[0].traveller;
    coverage_accordions = data?.worldwide_except_accordians;
    headers = getHearderItems(coveragetypeselected, data?.worldwide_except_headers);
  }
  else if (plan === coverageTypeIdMap.europe) {
    benefits = data?.europe_benefits[0].benefits;
    plan1 = TRAVEL_PLAN_TYPE.type_europe === coveragetypeselected ? data?.europe_benefits[0].europe : data?.europe_benefits[0].schengen;
    coverage_accordions = data?.europe_accordions;
    headers = getHearderItems(coveragetypeselected, data?.europe_headers);
  }


  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  }
  const groupBenefitsUnderAccordions = () => {
    const groupedBenefits = [];
    const staticRows = benefits.slice(0, 1).map((benefit, index) => ({
      header: null,
      items: [benefit],
      plan1: [plan1[index]],
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

        };
        groupedBenefits.push(currentAccordion);
      } else if (currentAccordion) {
        currentAccordion.items.push(benefit);
        currentAccordion.plan1.push(plan1[adjustedIndex]);

      } else {
        groupedBenefits.push({
          header: null,
          items: [benefit],
          plan1: [plan1[adjustedIndex]],

        });
      }
    });

    return groupedBenefits;
  };

  const groupedBenefits = groupBenefitsUnderAccordions();

  return (<Modal
    show={true}
    onHide={onClose}
    centered
    className="compare-modal-custom"
    size="lg"
  >
    <Modal.Header>
      <Modal.Title data-testid="tooltip-title" className="custom_modal_title">{coveragetypeselected == TRAVEL_PLAN_TYPE.type_traveller ? TRAVELER : coveragetypeselected}</Modal.Title>
      <CloseIcon data-testid="img-role" className="compare_modal-close-icon" onClick={onClose} />

    </Modal.Header>

    <Modal.Body>
      <div className="table-view-benefit">
        <Row className="header-row">
          {headers.map((header: string, index: number) => (
            <Col
              key={index}
              className={`header-cell text-center ${index === 0
                  ? "col-bg-one col-md-6 force-white"
                  : index === 1
                    ? `col-md-6 ${header.split(" ")[0] === "Pearl"
                      ? "col-bg-two"
                      : "col-bg-three"
                    } col-bg-rounded msplit-text`
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
                        word === CURRENCY ? (
                          <span key={i} className="small-text"></span>
                        ) : (
                          <span key={i}>{getAmountWithIcon(word)} </span>
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
              <div key={index} className="accordion-section-benefit-popup">
                <Accordion activeKey={activeAccordion}>
                  <Row className="accordion-header">
                    <Col md={6} className="benefit-cell">

                      <Accordion.Button as={Card.Header} eventKey={index} className="acc-button d-flex justify-content-between" onClick={() => toggleAccordion(index)}>
                        <span className='trvel-benefit-blod'>{group.header}</span>
                      </Accordion.Button>

                    </Col>
                    <>
                      <Col md={6} className="benefit-cell"></Col>

                    </>
                  </Row>
                  <Accordion.Collapse eventKey={index}>

                    <>
                      {group.items.map((item, itemIndex) => (
                        <Row key={itemIndex} className="benefit-row">
                          <Col md={6} className={`benefit-cell browcol-one benefit-cell-first ${itemIndex == 0 ? 'btm-underline-top' : ''}`}>
                            {item}
                          </Col>

                          <Col md={6} className={`benefit-cell browcol-two ${itemIndex == 0 ? 'btm-underline-top' : ''}`}>
                            {group.plan1[itemIndex]}
                          </Col>

                        </Row>
                      ))}
                    </>
                  </Accordion.Collapse>


                </Accordion>
              </div>
            );
          } else {
            return (<Row key={index} className="benefit-row btm-underline justify-content-center">
              <Col className="benefit-cell benefit-cell-empty-left benefit-cell-first first-col txt-align" md={6}>{group.items[0] === '-' ? '' : group.items[0]}</Col>
              <Col className="benefit-cell benefit-cell-first first-col txt-align" md={6}>{group.plan1[0]}</Col>
            </Row>);
          }
        })}
      </div>
    </Modal.Body>
  </Modal>);

};

export default ViewBenefitPopup;