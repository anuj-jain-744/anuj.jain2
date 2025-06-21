import React from "react";
import { Accordion } from "react-bootstrap";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";
import { useLocation } from "react-router-dom";
import RoadIcon from 'assets/Dashboard/Road.svg'
import Personal_InjuryIcon from 'assets/Dashboard/Personal_Injury.svg';
import Car_Icon from "assets/Endorsement/Car_Icon.svg";
import Driver_Icon from "assets/Endorsement/driver.svg";
import Location_Icon from "assets/Endorsement/Location.svg";
import { MRAS, MPAD, MRCR, MGAE_Bahrain, MGAE_GCC, motorCoverageTypes } from "constant";

interface Props {
  languageData: LanguageData | undefined;
  navigateTo?: (url: string, data?: any) => void;
  benefitsList?: { benefitCode: string, benefitName: string }[];
}

const PolicyAdditionalPackages: React.FC<Props> = ({
  languageData,
  navigateTo,
  benefitsList
}) => {
  const location = useLocation();

  const handleAddDetails = () => {
    navigateTo && navigateTo('/PolicyService/Endorsement', location.state);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case MRAS:
        return <img src={RoadIcon} />
      case MPAD:
        return <img src={Personal_InjuryIcon} />
      case MRCR:
        return <img src={Car_Icon} />
      case MGAE_Bahrain:
        return <img src={Location_Icon} />
      case MGAE_GCC:
        return <img src={Location_Icon} />
      default:
        return <img src={Car_Icon} />
    }
  }

  const renderBenefit = (benefit, index) => {
    return (<div className="benefit-card" key={index}>
      <div className="benefit-row">
        <span className="benefit-icon">{renderIcon(benefit.benefitCode)}</span><p className="benefit-heading"> {benefit.benefitName}</p>
      </div>
      <p className="benefit-content">{languageData?.emergency_support_for}</p>
    </div>)

  }


  return (
    <Accordion.Item
      className="policyacc-accordion-item walaa-regular-400"
      eventKey="4"
    >
      <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
        {languageData?.policy_additional_packages}
      </Accordion.Header>
      <Accordion.Body className="policyacc-package-container">
        <div className="policyacc-package-details">
          {benefitsList
            ?.filter((benefit) => benefit.benefitName !== motorCoverageTypes.comp)
            .map((benefit, index) => renderBenefit(benefit, index))
            }
        </div>

        <ThemeButton
          icon={true}
          iconName="Plus"
          variant="outline"
          isDisabled={false}
          title={languageData?.manage_add_benefit}
          classes={"walaa-medium-500 add-btn"}
          onClickhandler={handleAddDetails}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default PolicyAdditionalPackages;
