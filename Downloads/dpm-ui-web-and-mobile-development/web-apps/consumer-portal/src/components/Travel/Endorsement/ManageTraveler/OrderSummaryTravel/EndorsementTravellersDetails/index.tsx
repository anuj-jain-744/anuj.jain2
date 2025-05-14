import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import "./style.scss";
import { LanguageData } from "types/languageData";

interface IEndorsementTravellerSection {
  languageData: LanguageData | undefined | null;
  sectionName: string;
}

const EndorsementTravellerSection: React.FC<IEndorsementTravellerSection> = ({
  languageData,
  sectionName,
}) => {
  //accordion opened/not state
  const [isOpen, setOpen] = useState<boolean>(false);
  //accordion on body open handler fn
  const clickEnterHandler = () => {
    setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setOpen(false);
  };

  const AddSection = () => {
    return (
        <React.Fragment>
      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="endorsement-refund-section walaa-medium-500">
              {languageData?.refundable_amount_endorsement}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column endorsement-price-section-add endorsement-section-add-header-padding">
             {priceUnit}
          </div>
        </div>
      </div>
      <div className="row endorsement-travel-add-section-details ">
        {languageData?.additional_benefits1}
      </div>
      {/* // This section needs to be handled after passing proper props from endorsement comp */}
      <div className="endorsement-travel-add-benefit endorsement-travel-benefit-bg">
        {languageData?.benfit_covid}
      </div>
      </React.Fragment>
    );
  };

  const RemoveSection = () => {
    return (
      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="endorsement-refund-section walaa-medium-500">
              {languageData?.refundable_amount_endorsement}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column endorsement-price-section">
          {priceUnit}
            </div>
        </div>
      </div>
    );
  };

  const BenefitsSection = () => {
    return (
      <div className="row row-gap-for-pricing">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="endorsement-refund-section walaa-medium-500">
              {languageData?.refundable_amount_endorsement}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column endorsement-price-section">
          {priceUnit}
            </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setOpen(false);
  }, []);

  const priceUnit = languageData?.sar;
  const selectClass =
    sectionName !== "Add"
      ? "endorsement-traveler-travelinfo"
      : "endorsement-traveler-Add-travelinfo";
  const accordianTitle =
    sectionName === "Add"
      ? languageData?.travelers_added
      : sectionName === "Remove"
      ? languageData?.travelers_removed
      : languageData?.travelers_benefits_removed;

  return (
    <React.Fragment>
      <Accordion
        defaultActiveKey="1"
        className={`${
          isOpen ? "accor-open" : "endorsement-accor-close"
        } w-100 ${selectClass} `}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <div className="">{`1 ${accordianTitle}`}</div>
              <div className="px-2 d-flex flex-column">
                <div className={sectionName !== 'Add' ? 'endorsement-price-section-header' : 'endorsement-price-section-add'}>
                {priceUnit}     
                </div>               
              </div>
            </div>
            {sectionName === "Benefits" && (
                  <div className="benefits-section">
                    {languageData?.existing_travelers}
                  </div>
                )}
          </Accordion.Header>
          <Accordion.Body
            onEntered={clickEnterHandler}
            onExiting={clickExitHandler}
            className="p-2"
          >
            {/* row 1 */}
            {sectionName === "Add" && AddSection()}
            {sectionName === "Remove" && RemoveSection()}
            {sectionName === "Benefits" && BenefitsSection()}

            {/* row 2 */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </React.Fragment>
  );
};

export default EndorsementTravellerSection;
