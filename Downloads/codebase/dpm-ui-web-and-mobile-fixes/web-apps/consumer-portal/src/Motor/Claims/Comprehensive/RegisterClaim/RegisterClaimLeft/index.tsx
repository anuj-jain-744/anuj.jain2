import React, { useContext, useState } from "react";
import CompensationType from "./CompensationType";
import ClaimDetails from "./ClaimDetails";
import ContactDetails from "./ContactDetails";
import CompreTermsAndConditions from "./CompreTermsAndConditions";
import { DataContext } from "../../../../../DataContext";
import RegisterClaimModalDialog from "../../Components/RegisterClaimModalDialog";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";
import { comprehensiveOD, OTHERS_CASE_SOURCE_TYPE, productIDs } from "constant";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";
import  InfoIcon from "../../../../../../../consumer-portal/src/assets/Claims/Claim-Info.svg";

interface IRegisterClaimLeft {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  isIAgreeSelected: boolean;
  liabilitySelected: number;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateHandler: (value?: string | number, name?: string) => void;
  updateHandlerWorkshop: (value?: string | null | [] | {id: number,name:string}[], name?: string) => void;
  changeHandlerFiles: (data: any) => void;
  isMandatoryFileUploaded: (isFileExist: boolean) => void;
  contactDetchangeHandler: (
    name: string,
    isIBAN: boolean,
    value?: string
  ) => void;
  validationData: any;
  claimCheckData: any;
  claimsInfo: any;
  mobilenumData: any;
  type: string;
  isEstimatedAmountData: string | number | null | undefined;
  lossDescription?: string;
  othersClaimInfo?: OthersClaimInfo;
}
const RegisterClaimLeft = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  isIAgreeSelected,
  liabilitySelected,
  changeHandler,
  updateHandler,
  updateHandlerWorkshop,
  changeHandlerFiles,
  isMandatoryFileUploaded,
  contactDetchangeHandler,
  validationData,
  claimCheckData,
  claimsInfo,
  mobilenumData,
  type,
  isEstimatedAmountData,
  lossDescription,
  othersClaimInfo,
}: IRegisterClaimLeft) => {
  //cms content
  const Data = useContext(DataContext);
  const [showRegModal, setShowRegModal] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const userName = useSelector((state: RootState) => state.auth?.userInfo?.name);
  const user = isAuthenticated ? userName : validationData?.ownerName || '';
  const showRegistrationModal = () => {
    setShowRegModal(true);
  }
  return (
    <div className="register-new-claim-left-card-main d-flex flex-column">
        <div className="register-claim-left-card-top-message-container">
        <img src={InfoIcon} alt="Info Icon" className="Claim-infoIcon" />
          <p data-testid="registration-modelid" className="walaa-regular-400">
          {claimsInfo?.SourceType !== OTHERS_CASE_SOURCE_TYPE ? (
            <React.Fragment>
              {user}, {Data?.we_have_verified_your_case_number}
              <br />
              {Data?.please_read_the}{" "}
              <span onClick={showRegistrationModal} role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  showRegistrationModal();
                }
              }}>
                {Data?.registration_details}
              </span>{" "}
              {Data?.that_will_help_you_to_file_your_claim_suitably}
            </React.Fragment>
          ) : (
            <React.Fragment>
                {Data?.we_could_not_able_to_verify}
                <br />
                <b>{Data?.please_fill_the_below_details}</b>
                <br />
                {Data?.please_read_the}{" "}
                <span onClick={showRegistrationModal} role="button" tabIndex={0} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    showRegistrationModal();
                  }
                }}>
                  {Data?.registration_details}
                </span>{" "}
                {Data?.that_will_help_you_to_file_your_claim_suitably}
              </React.Fragment>
          )}
          </p>
      </div>
      {((type !== comprehensiveOD  && claimsInfo?.SourceType !== OTHERS_CASE_SOURCE_TYPE) ||
      ((type !== comprehensiveOD  && claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE) && (othersClaimInfo?.isSequenceNo && othersClaimInfo?.SequenceNo && othersClaimInfo?.SequenceNo?.length > 0))) && (
        <div className="register-new-claim-left-card walaa-regular-400">
          <div data-testid="registerclaim-testid" className="register-new-claim-header walaa-medium-500">
            <div className="header-body">{Data?.compensation_type}</div>
          </div>
          <div data-testid="radio-checkid" className="header-border"></div>
          <CompensationType
            isBankTransferSelected={isBankTransferSelected}
            isDamageRepairSelected={isDamageRepairSelected}
            changeHandler={changeHandler}
          />
        </div>
      )}
      {(isBankTransferSelected || isDamageRepairSelected || type === comprehensiveOD || 
        ( claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE && (isBankTransferSelected || isDamageRepairSelected) ) ||
        ( claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE && (type !== comprehensiveOD && othersClaimInfo?.lossType ) && (!othersClaimInfo?.isSequenceNo) )
        ) && (
        <React.Fragment>
          {/* claim details */}
          <div className="register-new-claim-left-card walaa-regular-400">
            <div className="register-new-claim-header walaa-medium-500">
              <div className="header-body">{Data?.claim_details}</div>
            </div>
            <div className="header-border"></div>
            <ClaimDetails
              isBankTransferSelected={isBankTransferSelected}
              isDamageRepairSelected={isDamageRepairSelected}
              liabilitySelected={liabilitySelected}
              changeHandler={changeHandler}
              updateHandler={updateHandler}
              updateHandlerWorkshop={updateHandlerWorkshop}
              changeHandlerFiles={changeHandlerFiles}
              isMandatoryFileUploaded={isMandatoryFileUploaded}
              validationData={validationData}
              claimCheckData={claimCheckData}
              type={type}
              isOthersCase={claimsInfo?.SourceType}
              lossDescription={lossDescription}
              claimsInfo={claimsInfo}
              // estimated amount data
              isEstimatedAmountData={isEstimatedAmountData}
              othersClaimInfo={othersClaimInfo}
            />
          </div>

          {/* claimant details */}
          <div className="register-new-claim-left-card walaa-regular-400">
            <div className="register-new-claim-header walaa-medium-500">
              <div className="header-body">{Data?.claimant_details}</div>
            </div>
            <div data-testid="upload-docstest" className="header-border"></div>
            <ContactDetails
              isBankTransferSelected={isBankTransferSelected}
              isDamageRepairSelected={isDamageRepairSelected}
              changeHandler={contactDetchangeHandler}
              validationData={validationData}
              claimsInfo={claimsInfo}
              // response field values
              mobilenumData={mobilenumData}
              type={type}
              isOthersCase={claimsInfo?.SourceType}
              othersClaimInfo={othersClaimInfo}
            />
            <div className="header-border"></div>
            <div className="row px-4 mx-2">
              <div className="col px-0">
                <CompreTermsAndConditions
                  isChecked={isIAgreeSelected}
                  changeHandler={contactDetchangeHandler}
                  productName={productIDs.motor}
                  coverageType={type}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
      {showRegModal &&
        <RegisterClaimModalDialog 
          showRegModal = {showRegModal}
          setShowRegModal = {setShowRegModal}
        />
      }
    </div>
  );
};

export default RegisterClaimLeft;