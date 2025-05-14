import React, { useEffect, useState, useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RegisterClaimModalDialog from "../../Components/RegisterClaimModalDialog";
// TODO needed in multiple policy
import SelectPolicyCard from "./SelectPolicyCard/SelectPolicyCard";
import "./index.scss";
import TravelerEstimate from "components/TravelerEstimate";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import ContactDetails from "./ContactDetails";
import CompreTermsAndConditions from "./CompreTermsAndConditions";
import { TRAVEL } from "constant";
import { usePolicyDetails } from "hook/dashboard/usePolicyDetails";
import { useReviewPolicyTravel } from "pages/travel/Policy-services/policyCancellation/hook/useReviewPolicyTravel";
import { formatDateYYYYMMDD } from "utils/formatDate";
import { useLocation } from "react-router-dom";

interface IRegisterClaimLeft {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  isIAgreeSelected: boolean;
  liabilitySelected: number;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateHandler: (value?: string | number) => void;
  changeHandlerFiles: (data: any) => void;
  isMandatoryFileUploaded: (isFileExist: boolean) => void;
  contactDetchangeHandler: (
    name: string,
    isIBAN: boolean,
    value?: string
  ) => void;
  validationData: any;
  mobilenumData: any;
  type: string;
  travelData: any;
  policyNumber: string;
  handlePolicySelect: (policyNumber: string) => void;
  policyHlderName?: string;
  policyDataSel: any;
  handleValueUpdate: any;
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
}
const RegisterClaimLeft = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  isIAgreeSelected,
  changeHandler,
  contactDetchangeHandler,
  validationData,
  mobilenumData,
  type,
  travelData,
  policyNumber,
  handlePolicySelect,
  policyHlderName,
  handleValueUpdate,
  handleLossApi,
  dateOfLoss,
  handleDateOfLoss,
  place,
  handlePlace,
  estimations,
  handleEstimations,
  isValidEstimation,
}: IRegisterClaimLeft) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const showRegistrationModal = () => {
    setShowRegModal(true);
  };

  useEffect(() => {
    showRegistrationModal();
  }, []);

  const [, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyNumber);

  const [, setShowAlertModal] = useState<boolean>(false);
  const [, setviewPolicyDetails] = useState<any>(null);
  const [, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    localStorage.removeItem("selectedPolicyNumber");
    const storedPolicyNumber = localStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }
    const handleBeforeUnload = () => {
      localStorage.removeItem("selectedPolicyNumber");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const location = useLocation();
  const policyNumbers = useMemo(() => location.state.policies ?? [], []);
  const trvlPolicies = policyNumbers.map((item: any) => item?.policyNo);

  // load all the policies on the basis of iqamaId to selectbox
  const iqmaId = sessionStorage.getItem("iqmaId");
  const {
    data: policyData,
    error: policyError,
    isLoading: isPolicyLoading,
  } = usePolicyDetails({
    policyNo: null,
    productCode: null,
    includeEndoVersion: "Y",
    nationalId: iqmaId,
  });

  // TODO this click will be there on the click of slect policy need to include
  const {
    makeApiCall,
    isLoading: isPolicyLoadingreview,
    error: policyErrorReview,
    data,
  } = useReviewPolicyTravel({
    PolicyNo: policyNumber!,
    Product: TRAVEL,
  });

  const policyDataSingle = usePolicyData(data, TRAVEL);
  const calPolicyStartDate = policyDataSingle?.policyDetails?.startDate;
  const calPolicyEndDate = policyDataSingle?.policyDetails?.expiryDate;
  useEffect(() => {
    if (policyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, policyNumber]);

  if (policyErrorReview) {
    return <ErrorComponent />;
  }

  useEffect(() => {
    if (data) {
      setviewPolicyDetails(data);
    }
    if (policyError) {
      setApiErrorMessage({
        title: policyError?.name,
        description: policyError?.messages?.message_en ?? "",
      });
      setShowAlertModal(true);
    }
  }, [isPolicyLoading, policyError, data]);

  const travellersdetails = data?.policyLob
    .map((lob) => lob.policyRisk.map((risk) => risk.travellerNameEnglish))
    .flat();

  const handleDateChange = (
    date: Date | string | null,
    usage: string = "travel"
  ) => {
    if (usage === "loss") {
      handleValueUpdate("dateOfLoss", [
        formatDateYYYYMMDD(date),
        travellersdetails?.length > 0 ? travellersdetails.toString() : "",
      ]);
    } else if (usage === "causeOfLoss") {
      handleValueUpdate("causeOfLoss", date);
    }
  };

  return (
    <>
      <div className="register-claim-left-card-top-message-container">
        <InfoOutlinedIcon className="tooltip-icon" />
        <div className="walaa-regular-400" onClick={showRegistrationModal}>
          {policyHlderName}
          <span
            dangerouslySetInnerHTML={{
              __html: travelData?.register_claim_description,
            }}
          />
        </div>
      </div>
      {type !== "OD" && trvlPolicies?.length > 0 && (
        <SelectPolicyCard
          onPolicySelect={handlePolicySelect}
          selectedPolicy={policyNumber}
          isBankTransferSelected={isBankTransferSelected}
          isDamageRepairSelected={isDamageRepairSelected}
          changeHandler={changeHandler}
          trvlPolicies={trvlPolicies}
        />
      )}
      {policyNumber && (
        <>
          {/* Estimate Component Start  */}
          {travellersdetails && travellersdetails.length > 0 && (
            <TravelerEstimate
              data={travelData}
              options={travellersdetails}
              handleLossApi={handleLossApi}
              handleDateChange={handleDateChange}
              minDate={calPolicyStartDate}
              maxDate={calPolicyEndDate}
              place={place}
              handlePlace={handlePlace}
              dateOfLoss={dateOfLoss}
              handleDateOfLoss={handleDateOfLoss}
              estimations={estimations}
              handleEstimations={handleEstimations}
              isValidEstimation={isValidEstimation}
            />
          )}

          {/* Estimate Component End  */}
          {dateOfLoss && place && (
            <div className="register-new-claim-left-card walaa-regular-400">
              <div className="register-new-claim-header walaa-medium-500">
                <div className="header-body">
                  {travelData?.claimant_details}
                </div>
              </div>
              <div className="header-border"></div>
              <ContactDetails
                isBankTransferSelected={isBankTransferSelected}
                isDamageRepairSelected={isDamageRepairSelected}
                changeHandler={contactDetchangeHandler}
                validationData={validationData}
                // response field values
                mobilenumData={mobilenumData}
                type={type}
                travelData={travelData}
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
          )}
        </>
      )}

      {showRegModal && (
        <RegisterClaimModalDialog
          showRegModal={showRegModal}
          setShowRegModal={setShowRegModal}
        />
      )}
    </>
  );
};

export default RegisterClaimLeft;
