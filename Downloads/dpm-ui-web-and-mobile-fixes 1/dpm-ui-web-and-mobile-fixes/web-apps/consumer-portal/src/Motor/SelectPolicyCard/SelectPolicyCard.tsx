import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import React from "react";
import { Card } from "react-bootstrap";
import useLanguageData from "./../Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import "./SelectPolicyCard.scss";

interface SelectPolicyCardProps {
    onPolicySelect: (policyNumber: string) => void
    selectedPolicy?: string
    allPolicy?: string[]
  }
  
  const SelectPolicyCard: React.FC<SelectPolicyCardProps> = ({ onPolicySelect, selectedPolicy, allPolicy }) => {
    const { languageData } = useLanguageData()
  
    const onSelectPolicy = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedPolicyNumber = event.target.value
      onPolicySelect(selectedPolicyNumber)
    }
  
    const dropdownItems = Array.isArray(allPolicy) && allPolicy.length > 0? allPolicy : []; // TODO need to get from API when available

  return (
    <Card className="select-policy-left-card">
      <div className="select-policy">
        <div className="select-policy-header walaa-medium-500">
          {languageData?.select_policy}
        </div>
        <hr className="horizontal-line"/>
        <div className="policy-list">
            <ThemeDropdown
                onChangehandler={onSelectPolicy}
                value={dropdownItems}
                classes={"policy-list"}
                placeholder={'Select Policy'}
                selectedValue={selectedPolicy}
            />
        </div>
      </div>
    </Card>
  );
};

export default SelectPolicyCard;