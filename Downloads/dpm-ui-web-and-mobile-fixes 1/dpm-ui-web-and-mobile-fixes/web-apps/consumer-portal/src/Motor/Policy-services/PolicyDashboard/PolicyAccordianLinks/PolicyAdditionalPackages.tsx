import React from "react";
import { Accordion } from "react-bootstrap";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";

interface Props {
  languageData: LanguageData | undefined;
  navigateTo?: (url: string, data?: any) => void;
  policyInfo: { policyNo: string, endorsementNo: string, productCode: string };
}

const packageTitle = `You do not have any additional packages linked to this policy.`;
const packageContent = `To include additional packages in the policy, click “Add  Details”.`;

const PolicyAdditionalPackages: React.FC<Props> = ({
  languageData,
  navigateTo,
  policyInfo,
}) => {
  const handleAddDetails = () => {
    navigateTo &&
      navigateTo("/Motor/Claim/Endorsement", {
        data: policyInfo
      });
  };

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
          <div>{packageTitle}</div>
          <div>{packageContent}</div>
        </div>

        <ThemeButton
          icon={true}
          iconName="Plus"
          variant="outline"
          isDisabled={false}
          title={languageData?.add_details}
          classes={"walaa-medium-500"}
          onClickhandler={handleAddDetails}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default PolicyAdditionalPackages;
