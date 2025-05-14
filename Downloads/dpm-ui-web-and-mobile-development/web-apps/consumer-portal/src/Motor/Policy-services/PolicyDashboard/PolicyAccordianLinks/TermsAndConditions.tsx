import TermsAndConditionDialog from "claims/register/compensation/TermsAndConditionDialog";
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LanguageData } from "types/languageData";

interface Props {
  languageData: LanguageData | undefined;
}

const dummyContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const TermsAndConditions: React.FC<Props> = ({ languageData }) => {
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
          <h4 data-testid="term-con-id" onClick={handleModal}>{`  ${languageData?.terms_conditions}`}</h4>
        </p>
        <TermsAndConditionDialog
          showDialog={openModal}
          setShowDialog={handleModal}
          languageData={{
            title_for_terms_conditions: languageData?.terms_conditions,
            content_terms_conditions: dummyContent,
            ok: "OK",
          }}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default TermsAndConditions;