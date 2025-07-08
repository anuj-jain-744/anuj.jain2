import TermsAndConditionLink from "components/TermsAndConditions/TermsAndConditionLink";
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";

interface Props {
  languageData: LanguageData | undefined;
  productCode?: string;
  coverageName?: string;
}

const TermsAndConditions: React.FC<Props> = ({ languageData, productCode, coverageName }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <Accordion.Item className="policyacc-accordion-item" eventKey="5">
      <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
        {languageData?.terms_conditions}
      </Accordion.Header>
      <Accordion.Body>
        <p className="terms-condition">
          {languageData?.click_here_to_view_policy}
          <h4 data-testid="term-con-id" onClick={handleModal}>
            <TermsAndConditionLink
              languageData={languageData}
              coverageName={coverageName}
              productCode={productCode}
            />
            </h4>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default TermsAndConditions;
