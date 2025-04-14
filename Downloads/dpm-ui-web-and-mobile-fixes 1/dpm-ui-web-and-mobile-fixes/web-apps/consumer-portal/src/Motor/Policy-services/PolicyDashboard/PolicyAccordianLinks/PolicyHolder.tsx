import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
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
                      <span className="walaa-regular-400 policyacc-itemname">
                        {key}
                      </span>
                      <span className="policyacc-itemvalue walaa-medium-500">
                        {value}
                      </span>
                    </div>
                    {index < Object.entries(holderDetails).length - 1 && (
                      <span className="line"></span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <hr className="policyacc-vector" />
              <div className="policyacc-parTwo">
                <span>{languageData?.addresses}</span>
                <span className="walaa-medium-500">{address}</span>
              </div>
            </div>
            <ThemeButton
              icon={true}
              iconName="AccountCircle"
              variant="outline"
              isDisabled={false}
              title={languageData?.view_profile}
              classes={"walaa-medium-500"}
            />
          </Accordion.Body>
        </Accordion.Item>
  )
}

export default PolicyHolder