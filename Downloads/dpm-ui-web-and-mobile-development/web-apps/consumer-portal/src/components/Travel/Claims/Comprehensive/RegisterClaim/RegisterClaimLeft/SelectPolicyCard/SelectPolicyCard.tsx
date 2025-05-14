import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import React from "react";
import { Card } from "react-bootstrap";
import useLanguageData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import "./SelectPolicyCard.scss";
import { RootState } from "@dpm/shared-module";
import { useSelector } from 'react-redux';


interface SelectPolicyCardProps {
    onPolicySelect: (policyNumber: string) => void
    selectedPolicy?: string
    allPolicy?: string[]
    trvlPolicies?: string[]
  }
  
  const SelectPolicyCard: React.FC<SelectPolicyCardProps> = ({ onPolicySelect, selectedPolicy, allPolicy , trvlPolicies }) => {
    const { languageData } = useLanguageData()
  
    const onSelectPolicy = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedPolicyNumber = event.target.value
      onPolicySelect(selectedPolicyNumber)
    }

    // check is isAuthenticated
    const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
    
  
    // TODO need to get from API when available
    const dropdownItems = Array.isArray(trvlPolicies) && trvlPolicies.length > 0? trvlPolicies : [ ...allPolicy!]; 

  // When only multiple policy numbers are there it should display th dripdown 
  if (dropdownItems.length <= 1) {
    return null;
  }


  return (
    <Card className="select-policy-left-card">
      <div className="select-policy-card">
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
