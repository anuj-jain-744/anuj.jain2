import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { useLocation } from "react-router-dom";
import { renderValue } from "./PolicyHolder";
import { DriverProps } from "types/driver";

interface Props {
    languageData: LanguageData | undefined
    driverList: DriverProps[]
    address: string[];
    navigateTo?: (url: string, data?: any) => void;
}

const DriverDetails: React.FC<Props> = ({ languageData, driverList, address,navigateTo }) => {
    const location=useLocation();

    const handleAddDetails = () => {
        navigateTo('/PolicyService/Endorsement',location.state)
      };
    return (
        <Accordion.Item className="policyacc-accordion-item" eventKey="1">
            <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
                {languageData?.driver_details}
            </Accordion.Header>
            <Accordion.Body className="policyacc-cardContainer">
                {driverList?.map((driverDetails,driverIndex)=>(
                <div key={`${driverDetails.driverID}${driverIndex}`} className="policyacc-bodyContainer">
                    <div className="policyacc-partOne">
                        {Object.entries(driverDetails).map(([key, value], index) => (
                            <React.Fragment key={`${key}-${index}`}>
                                <div className="policyacc-item">
                                    <span className="walaa-regular-400 policyacc-itemname">
                                        {key}
                                    </span>
                                    <span className="policyacc-itemvalue walaa-medium-500">
                                    {renderValue(key,value)}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <hr className="policyacc-vector" />
                    <div className="policyacc-parTwo">
                        <span>{languageData?.addresses}</span>
                        <span className="walaa-medium-500">{address[driverIndex]}</span>
                    </div>
                </div>
                ))}
               
                <ThemeButton
                    icon={true}
                    iconName="ManageAccounts"
                    variant="outline"
                    isDisabled={false}
                    title={languageData?.manage_drivers}
                    classes={"walaa-medium-500 add-btn"}
                    onClickhandler={handleAddDetails}

                />
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default DriverDetails