import React, { FC, useState, useEffect } from "react";
import "./index.scss";
import { Card } from "react-bootstrap";
import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeComponents/ThemeButton";

interface PolicyCardProps {
  selectedPolicy?: string;
  allPolicy?: string[];
  languageData: LanguageData;
  backBtnClickHandler: () => void;
  claimData: any;
  setIsFirstPage: (show: boolean) => void;
}

const HoemClaimDetails: FC<PolicyCardProps> = ({ claimData, languageData, backBtnClickHandler, setIsFirstPage }) => {
  const [dropdownItems, setDropdownItems] = useState<[]>([]);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string>();

  useEffect(() => {
    if (claimData?.policyList && Array.isArray(claimData.policyList)) {
      const items = claimData.policyList?.map((item: { policyNo: string }) => item.policyNo);
      setDropdownItems(items);

      if (items.length  === 1) {
        setSelectedPolicyNumber(items[0]);
      }
    }
  }, [claimData]);

  const onSelectPolicy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPolicyNumber = event.target.value;
    setSelectedPolicyNumber(selectedPolicyNumber);
  }

  useEffect(() => {
    if (setIsFirstPage !== undefined)
      setIsFirstPage(false);
  }, []);

  return (
    <React.Fragment>
      <Card className="home-claim-details select-policy-left-card">
        <div className="select-policy">
          <div className="select-policy-header walaa-medium-500">
            {languageData?.select_policy}
          </div>
          <hr className="horizontal-line" />
          <div className="policy-list">

            <ThemeDropdown
              onChangehandler={onSelectPolicy}
              value={dropdownItems}
              classes={"policy-list"}
              placeholder={languageData?.select_policy}
              selectedValue={selectedPolicyNumber}
            />
            {claimData?.policyList <= 0 &&
              <p className="attach_error">{languageData?.no_policy_found_nationalid}</p>
            }

          </div>
        </div>
      </Card>

      <div className="register-new-claim-container-footer-main">
        <div className="footer">
          <div className="footer-btns walaa-medium-500">
            <ThemeButton
              classes={"back-btn"}
              isDisabled={false}
              title="Back"
              variant="link"
              icon={true}
              iconName="ChevronLeftIcon"
              onClickhandler={backBtnClickHandler}
            />
            <ThemeButton
              isDisabled={false}
              classes={"payment-btn register-disabled"}
              title="Submit"
              variant="link"
              icon={false}
              iconRight={true}
              iconName="ChevronRightIcon"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HoemClaimDetails;