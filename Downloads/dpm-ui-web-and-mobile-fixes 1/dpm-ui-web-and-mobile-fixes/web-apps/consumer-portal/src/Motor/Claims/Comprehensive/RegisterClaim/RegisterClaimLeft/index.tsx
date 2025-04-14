import React, { useContext, useState } from "react";
import CompensationType from "./CompensationType";
import ClaimDetails from "./ClaimDetails";
import ContactDetails from "./ContactDetails";
import CompreTermsAndConditions from "./CompreTermsAndConditions";
import { DataContext } from "../../../../../DataContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RegisterClaimModalDialog from "../../Components/RegisterClaimModalDialog";
import { dummyUser } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";
import { comprehensiveOD } from "constant";
interface IRegisterClaimLeft {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  isIAgreeSelected: boolean;
  liabilitySelected: number;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateHandler: (value?: string | number) => void;
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
  isEstimatedAmountData
}: IRegisterClaimLeft) => {
  //cms content
  const Data = useContext(DataContext);
  const [showRegModal, setShowRegModal] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const userName = useSelector((state: RootState) => state.auth?.userInfo?.name);
  const user = isAuthenticated ? userName : validationData.ownerName;
  const showRegistrationModal = () => {
    setShowRegModal(true);
  }
  return (
    <div className="register-new-claim-left-card-main d-flex flex-column">
      <div className="register-claim-left-card-top-message-container">
        <InfoOutlinedIcon className="tooltip-icon" />
        <p data-testid="registration-modelid" className="walaa-regular-400" onClick={showRegistrationModal}>
          <p dangerouslySetInnerHTML={{ __html: user + Data?.register_claim_top_message }} />
        </p>
      </div>
      {type !== comprehensiveOD && (
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

      {(isBankTransferSelected || isDamageRepairSelected || type === comprehensiveOD) && (
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
              claimsInfo={claimsInfo}
              // estimated amount data
              isEstimatedAmountData={isEstimatedAmountData}
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
            />
            <div className="header-border"></div>
            <div className="row px-4 mx-2">
              <div className="col px-0">
                <CompreTermsAndConditions
                  isChecked={isIAgreeSelected}
                  changeHandler={contactDetchangeHandler}
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