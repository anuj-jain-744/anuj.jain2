import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { HolderDetails } from "types/policyDetails";
import { useLocation } from "react-router-dom";

interface Props {
    languageData: LanguageData | undefined
    holderDetails: HolderDetails
    address: string;
    navigateTo?: (url: string, data?: any) => void;
}

const DriverDetails: React.FC<Props> = ({ languageData, holderDetails, address,navigateTo }) => {
    const location=useLocation();

    const handleAddDetails = () => {
        navigateTo('/Motor/Claim/Endorsement',location.state)
      };
    return (
        <Accordion.Item className="policyacc-accordion-item" eventKey="1">
            <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
                {languageData?.driver_details}
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
                                    {(value!==" " && value) ? value  : "NA"}
                                    </span>
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