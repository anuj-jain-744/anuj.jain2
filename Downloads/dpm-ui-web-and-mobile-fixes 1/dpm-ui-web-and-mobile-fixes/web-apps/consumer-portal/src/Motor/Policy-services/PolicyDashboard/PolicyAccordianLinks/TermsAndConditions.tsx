import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";

interface Props {
    languageData: LanguageData | undefined
}

const dummyContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.`

const TermsAndConditions: React.FC<Props> = ({ languageData }) => {
    return (
        <Accordion.Item className=" walaa-regular-400" eventKey="5">
            <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
                {languageData?.terms_conditions}
            </Accordion.Header>
            <Accordion.Body className="policyacc-TC-container">
                {dummyContent}
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default TermsAndConditions