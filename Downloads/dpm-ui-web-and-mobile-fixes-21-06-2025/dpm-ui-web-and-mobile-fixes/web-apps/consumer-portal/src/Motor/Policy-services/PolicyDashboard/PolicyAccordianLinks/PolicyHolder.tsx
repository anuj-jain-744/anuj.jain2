import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import { HolderDetails } from "types/policyDetails";
import {LICENSE_TYPE,INSURANCE_NAME, DRIVER_NAME} from 'constant';
import {NOT_APPLICABLE} from '@dpm/shared-module'

interface Props {
    languageData: LanguageData | undefined
    holderDetails: HolderDetails
    address: string
}
export const renderValue=(key:string,value:string | number | undefined)=>{
  switch (key) {
    case LICENSE_TYPE:
      return (value!==" " && value)?value:NOT_APPLICABLE
    case INSURANCE_NAME:
      return value==(value!==" " && value)?<div dangerouslySetInnerHTML={{__html:value}}></div>: value
    case DRIVER_NAME:
      return value==(value!==" " && value)?<div dangerouslySetInnerHTML={{__html:value}}></div>: value
    default:
      return value
  }

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
                       {renderValue(key,value)}
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