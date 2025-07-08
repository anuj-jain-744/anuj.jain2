import React, { FC, useState, useEffect } from "react";
import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import { Modal } from "react-bootstrap";
import { useCommonContext, sanitizeHtml } from "@dpm/shared-module";
import { HOME, commonKeywords } from "constant";
import Button from "react-bootstrap/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { LanguageData } from "types/languageData";
import TermsAndCon from "claims/register/compensation/TermsAndCon";
import DataLoss from "./DateLoss";
import { ViewPolicy } from "types/endorsement";
import { Value } from "react-multi-date-picker";
import "./index.scss"
import { ContactDetailsProps } from "../RegsiterClaimLeft/ClaimantDetails/types"
import ContactDetails from "./ClaimantDetails/ContactDetails";

interface PolicyCardProps {
  languageData: LanguageData;
  claimData: { policyList: [] };
  policyClaim: {
    selectedPolicyNumber: string | null;
    viewPolicy: ViewPolicy | null;
    isTermCondition: boolean;
    causeOfLossOptions: { id: number | string; description: string; siLimit: number }[];
  };
  handleSelectPolicyNumber: (value: string) => void;
  setIsTermCondition: (value: boolean) => void;
  handleRequestClaims: (value: Value) => void;
  contactDetialschangeHandler: ContactDetailsProps;
  addEstimateValues: (value: string) => void;
  isPolicyCardSelected: boolean;
  policies: { policyNo: string };
  claimFNOLError: string;
  nonMotorFNOL: { claimInfo: { policyNumber: string } } | null;
}



const RegisterClaimLeft: FC<PolicyCardProps> = ({
  claimData,
  policyClaim,
  languageData,
  handleSelectPolicyNumber, setIsTermCondition,
  handleRequestClaims,
  contactDetialschangeHandler,
  addEstimateValues,
  isPolicyCardSelected,
  policies,
  claimFNOLError,
  nonMotorFNOL
}) => {
  const { selectedPolicyNumber, viewPolicy, isTermCondition, estimatedValues } = policyClaim;
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const [dropdownItems, setDropdownItems] = useState<[]>([]);
  const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
  const [policycustomer, setPoicyCustomer] = useState<{ [key: string]: string } | null>({});
  useEffect(() => {
    if (claimData?.policyList && Array.isArray(claimData.policyList)) {
      const items = claimData.policyList?.map((item: { policyNo: string }) => item.policyNo);
      setDropdownItems(items);
      // selected the policy number based on policy card selected from dashboard or only one policy available for user
      if (items?.length === 1 || (isPolicyCardSelected && policies)) {
        const policyNumber: string = isPolicyCardSelected ? policies?.policyNo : items[0];
        handleSelectPolicyNumber(policyNumber);
      }
    }
  }, [claimData]);
  useEffect(() => {
    if (viewPolicy?.policyCustomer && Array.isArray(viewPolicy?.policyCustomer)) {
      setPoicyCustomer(viewPolicy?.policyCustomer[0])
    }
  }, [viewPolicy])

  const handleRefNoClose = () => setRefNoShow(false);
  const handleRefNoShow = () => setRefNoShow(true);

  const onSelectPolicy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPolicyNumber = event.target.value;
    handleSelectPolicyNumber(selectedPolicyNumber);
  }

  const policyInfo = languageData?.['we_have_retrieved_all_your_policy_related_information.'] ?? "";
  const policyInfoData = policyInfo?.split("{{INFORMATION}}");
  const policyCustomer = viewPolicy?.policyCustomer[0];
  let name = '';
  if (policyCustomer?.customerNameArabic || policyCustomer?.customerNameEnglish) {
    name = (ar === currentLanguage ? policyCustomer?.customerNameArabic?.trim() : policyCustomer?.customerNameEnglish?.trim());
    name = name ? `${name}, ` : '';
  }
  return (
    <div className="policy-claim-left-card">
      <Modal
        size="lg"
        show={isRefNoModal}
        centered
        onHide={handleRefNoClose}
        className='home-claims-dialog-box'
      >
        <Modal.Header closeButton>{languageData?.claim_registration_details}</Modal.Header>
        <Modal.Body>
          <div className='home-claims-container'>
            <div className="walaa-medium-500">{languageData?.please_note_the_following}</div>
            <div className="pt-3">
              <span
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(languageData?.please_note_content),
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="register-call2action walaa-medium-500"
            onClick={handleRefNoClose}
          >
            {languageData?.ok}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="home-claim-content">
        {viewPolicy ?
          <>
            <button onClick={handleRefNoShow}><InfoOutlinedIcon /></button>
            {name + policyInfoData[0]}
            <button className="link-content" onClick={handleRefNoShow}>{languageData?.claim_registration_details}</button>
            {policyInfoData[1]?.trim()}
          </>
          : ""}
      </div>
      <div className="policy-claim-container">
        <div className="select-policy-header walaa-medium-500">
          {languageData?.select_policy}
        </div>
        <hr className="horizontal-line" />
        <div className="policy-list">
          {dropdownItems?.length <= 0 ?
            <p className="attach_error no_policy">{languageData?.no_policy_found_nationalid}</p>
            :
            (
              dropdownItems?.length === 1 || (isPolicyCardSelected && policies) ?
                selectedPolicyNumber :
                <ThemeDropdown
                  onChangehandler={onSelectPolicy}
                  value={dropdownItems}
                  classes={"policy-list"}
                  placeholder={languageData?.select_policy}
                  selectedValue={selectedPolicyNumber}
                />
            )}
        </div>
      </div>
      {viewPolicy && <DataLoss viewPolicy={viewPolicy}
        languageData={languageData}
        causeOfLossOptions={policyClaim.causeOfLossOptions}
        handleRequestClaims={handleRequestClaims}
        addEstimateValues={addEstimateValues}
        nonMotorFNOL={nonMotorFNOL}
        claimFNOLError={claimFNOLError}
      />}
      {/** Contact details Start here */}
      {viewPolicy && nonMotorFNOL && !claimFNOLError && estimatedValues.length > 0 && <div className="policy-claim-container">
        <div className="select-policy-header walaa-medium-500">
          {languageData?.claimant_details}
        </div>
        <hr className="horizontal-line" />

        <div className="loss-details-box-container">
          <ContactDetails
            languageData={languageData}
            mobilenumData={policycustomer?.mobile ?? ''}
            changeHandler={contactDetialschangeHandler}
          />
        </div>
      </div>}
      {/** Contact details End Changes End */}
      {viewPolicy && nonMotorFNOL && !claimFNOLError && estimatedValues.length > 0 &&
        <TermsAndCon
          languageData={languageData}
          isChecked={isTermCondition}
          productcode={HOME}
          setIsChecked={setIsTermCondition} />
      }
    </div>
  );
};

export default RegisterClaimLeft;