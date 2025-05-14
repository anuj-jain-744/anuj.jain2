import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import { HolderDetails } from "types/policyDetails";

interface Props {
    languageData: LanguageData | undefined
    holderDetails: HolderDetails
    address: string
}

const PolicyHolder: React.FC<Props> = ({ languageData, holderDetails, address }) => {
  return (
      <Accordion.Item className="policyacc-accordion-item" eventKey="0">
          <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
            {languageData?.policy_holder_details}
          </Accordion.Header>
          <Accordion.Body className="policyacc-cardContainer">
            <div className="policyacc-bodyContainer">
              <div className="policyacc-partOne">
                {Object.entries(holderDetails).map(([key, value], index) => (
                  <React.Fragment key={`${key}-${index}`}>
                    <div className="policyacc-item">
                      <li className="walaa-regular-400 policyacc-itemname">
                        {key}
                      </li>
                      <li className="policyacc-itemvalue walaa-medium-500">
                        {(value!==" " && value) ? value  : "NA"}
                      </li>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <hr className="policyacc-vector" />
              <div className="policyacc-parTwo">
                <span>{languageData?.addresses}</span>
                <span className="walaa-medium-500">{address}</span>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
  )
}

export default PolicyHolder