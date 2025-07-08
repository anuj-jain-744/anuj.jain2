import React, { useEffect, useState, useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RegisterClaimModalDialog from "../../Components/RegisterClaimModalDialog";
// TODO needed in multiple policy
import SelectPolicyCard from "./SelectPolicyCard/SelectPolicyCard";
import TravelerEstimate from "components/TravelerEstimate";
import ContactDetails from "Motor/Claims/Comprehensive/RegisterClaim/RegisterClaimLeft/ContactDetails/index.tsx";
import TermsAndCon from "../../../../../../claims/register/compensation/TermsAndCon";
import { DataContext } from "DataContext";
import { toCamelCase } from "utils/quoteAndBuyTravel";
import { TRAVEL } from "constant";
import "./index.scss";
import "../../index.scss";
import { LanguageData } from "types/languageData";

interface PropTypes {
  contactDetchangeHandler: (
    name: string,
    isIBAN: boolean,
    value?: string
  ) => void;
  validationData: any;
  mobilenumData: any;
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  profileData: Record<string, string>;
  policies: Array<{ policyNo: string }>;
  policyNumber: string;
  handlePolicySelect: (policyNumber: string) => void;
  travelerNames: Array<string>;
  policyData: object;
  handleLossApi?: any;
  dateOfLoss: string;
  handleDateOfLoss: React.Dispatch<React.SetStateAction<string>>;
  place: string;
  handlePlace: React.Dispatch<React.SetStateAction<string>>;
  estimations: Travel.ClaimEstimations;
  handleEstimations: React.Dispatch<
    React.SetStateAction<Travel.ClaimEstimations>
  >;
  isValidEstimation: boolean;
  handleIbanDetails: (value: Travel.IBANDetails) => void;
  isTermsChecked: boolean;
  handleTerms: (value: boolean) => void;
  coverageInfoList: Travel.ClaimCoverageValues;
  showCards: boolean;
}
const RegisterClaimLeft = ({
  contactDetchangeHandler,
  validationData,
  mobilenumData,
  langData,
  profileData,
  policies,
  policyNumber,
  travelerNames,
  policyData,
  handlePolicySelect,
  handleLossApi,
  dateOfLoss,
  handleDateOfLoss,
  place,
  handlePlace,
  estimations,
  handleEstimations,
  isValidEstimation,
  handleIbanDetails,
  isTermsChecked,
  handleTerms,
  coverageInfoList,
  showCards,
}: PropTypes) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const showRegistrationModal = () => {
    setShowRegModal(true);
  };
  useEffect(() => {
    showRegistrationModal();
  }, []);

  const policyNumbers = useMemo(
    () => policies.map((item) => item.policyNo),
    []
  );

  const selectedPolicy = useMemo(
    () => policies.find((item) => item.policyNo === policyNumber),
    [policyNumber, policies]
  );

  const topInformationText = useMemo(() => {
    return (
      langData.product.register_claim_description?.replace(
        "<<Name>>",
        toCamelCase(profileData.userName)
      ) ?? ""
    );
  }, [langData.product, profileData]);

  return (
    <>
      <div className="register-claim-left-card-top-message-container">
        <InfoOutlinedIcon className="tooltip-icon" />
        <div className="walaa-regular-400" onClick={showRegistrationModal}>
          {topInformationText}
        </div>
      </div>
      {policyNumbers.length > 1 && showCards && (
        <SelectPolicyCard
          onPolicySelect={handlePolicySelect}
          selectedPolicy={policyNumber}
          trvlPolicies={policyNumbers}
          allPolicy={policies}
          langData={langData}
        />
      )}
      {policyNumber && !showCards && (
        <>
          {/* Estimate Component Start  */}
          <TravelerEstimate
            langData={langData.product}
            travelerNames={travelerNames}
            policyData={policyData}
            handleLossApi={handleLossApi}
            place={place}
            handlePlace={handlePlace}
            dateOfLoss={dateOfLoss}
            handleDateOfLoss={handleDateOfLoss}
            estimations={estimations}
            handleEstimations={handleEstimations}
            isValidEstimation={isValidEstimation}
            coverageInfoList={coverageInfoList}
          />

          {/* Estimate Component End  */}
          {dateOfLoss && place && (
            <div className="register-new-claim-left-card walaa-regular-400">
              <div className="register-new-claim-header walaa-medium-500">
                <div className="header-body">
                  {langData.product?.claimant_details}
                </div>
              </div>
              <div className="header-border"></div>
              <DataContext.Provider value={langData.consumer}>
                <ContactDetails
                  type={TRAVEL}
                  claimsInfo={{
                    ownerId: selectedPolicy?.nationalID,
                  }}
                  changeHandler={contactDetchangeHandler}
                  validationData={validationData}
                  mobilenumData={mobilenumData}
                  handleIbanDetails={handleIbanDetails}
                />
              </DataContext.Provider>
              <div className="header-border"></div>
              <div className="row px-4 mx-2">
                <div className="col px-0">
                  <TermsAndCon
                    languageData={langData.consumer}
                    isChecked={isTermsChecked}
                    setIsChecked={handleTerms}
                    productcode={TRAVEL}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showRegModal && (
        <RegisterClaimModalDialog
          langData={langData}
          showRegModal={showRegModal}
          setShowRegModal={setShowRegModal}
        />
      )}
    </>
  );
};

export default RegisterClaimLeft;
