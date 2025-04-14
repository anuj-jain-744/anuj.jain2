import React, { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RegisterClaimModalDialog from "../../Components/RegisterClaimModalDialog"; 
// TODO needed in multiple policy
import SelectPolicyCard from "./SelectPolicyCard/SelectPolicyCard"; 
import { Col, Row } from "react-bootstrap";
import { FullCalender } from "components/Calendar/fullcalender";
import "./index.scss";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox"; 
import TravelerEstimate from "components/TravelerEstimate"; 
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import { Travel } from "pages/travel";
import ContactDetails from "./ContactDetails";
import CompreTermsAndConditions from "./CompreTermsAndConditions";

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
  claimsInfo: any;
  mobilenumData: any;
  type: string;
  travelData: any;
  policyNumber: string;
}
const RegisterClaimLeft = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  isIAgreeSelected,
  liabilitySelected,
  changeHandler,
  updateHandler,
  changeHandlerFiles,
  isMandatoryFileUploaded,
  contactDetchangeHandler,
  validationData,
  claimsInfo,
  mobilenumData,
  type,
  travelData,
  policyNumber,
}: IRegisterClaimLeft) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const showRegistrationModal = () => {
    setShowRegModal(true);
  };

  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyNumber);

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


  // TODO :  needed in  case of multiple policy selection
  const handlePolicySelect = (policyNumber: string) => {
    setSelectedPolicyNumber(policyNumber);
    localStorage.setItem("selectedPolicyNumber", policyNumber);
  };

  // Claim details state
  interface InitialValueProps {
    [key: string]: string;
  }
  const [reEnteredIban, setReEnteredIban] = useState("");
  const [isOn, setIsOn] = useState<boolean>(false);
  const [inputError, setInputError] = useState<InitialValueProps | null>(null);
  const [travelStartDate, setTravelStartDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null) => {
    setTravelStartDate(date);
  };


  // view policy api call
  const {
    makeApiCall,
    isLoading: isPolicyLoading,
    error: policyError,
    data,
  } = useReviewPolicy({ PolicyNo: selectedPolicyNumber! });

  const policyData = usePolicyData(data);

  useEffect(() => {
    if (selectedPolicyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, selectedPolicyNumber]);

  if (policyError ) {
    return <ErrorComponent />;
  }

  console.log("policyData register left side", policyData);

  return (
    <div className="register-new-claim-left-card-main d-flex flex-column max-height">
      <div className="register-claim-left-card-top-message-container">
        <InfoOutlinedIcon className="tooltip-icon" />
        <div className="walaa-regular-400" onClick={showRegistrationModal}>
          {travelData?.claim_details?.name}
          <p
            dangerouslySetInnerHTML={{
              __html: travelData?.register_claim_description,
            }}
          />
        </div>
      </div>
      {type !== "OD" && (
        <SelectPolicyCard
          onPolicySelect={handlePolicySelect}
          selectedPolicy={selectedPolicyNumber}
          isBankTransferSelected={isBankTransferSelected}
          isDamageRepairSelected={isDamageRepairSelected}
          changeHandler={changeHandler}
        />
      )}

      {/* TODO: uncomment the code when policynumber and othervalues are availbale by mock or by API */}

      {/* {(isBankTransferSelected || isDamageRepairSelected || type === "OD") && (
        <React.Fragment> */}
      {/* claim details */}
      <div className="register-new-claim-left-card walaa-regular-400">
        <div className="register-new-claim-header walaa-medium-500">
          <div className="header-body">{travelData?.claim_details}</div>
        </div>
        <div className="header-border"></div>
        <div className="fieldsbody">
          <Row className="row-3-travel travel-fields">
            <Col className="travel-form-group col-6">
              <label className="form-check-label">
                {travelData?.date_of_travel}{" "}
                <span className="mandate_star">*</span>
              </label>
              <FullCalender
                value={travelStartDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                setValue={setTravelStartDate}
                isOn={isOn}
                setIsOn={setIsOn}
              />
              {inputError?.travelStartDate && (
                <p className="input-error">{inputError.travelStartDate}</p>
              )}
            </Col>
            <Col className="travel-form-group col-6">
              <label className="form-check-label">
                {travelData?.country_placeof_incident}{" "}
                <span className="mandate_star">*</span>
              </label>
              <ThemeTextbox
                type={"text"}
                name="reEnteredIban"
                placeholder={travelData?.country_placeof_incident}
                value={reEnteredIban}
                onChangehandler={(e) => setReEnteredIban(e.target.value)}
              />
              {inputError?.selectedPeriod && (
                <p className="input-error">{inputError.selectedPeriod}</p>
              )}
            </Col>
          </Row>
        </div>

        {/* TODO: uncomment the code when policynumber and othervalues are availbale by mock or by API */}
        
      </div>

      {/* </React.Fragment>
     )}   */}
     
    {/* Estimate Component Start  */}
    <TravelerEstimate data={travelData} />
    
     {/* Estimate Component End  */}     

      {/* claimant details */}
      <div className="register-new-claim-left-card walaa-regular-400">
        <div className="register-new-claim-header walaa-medium-500">
          <div className="header-body">{travelData?.claimant_details}</div>
        </div>
        <div className="header-border"></div>
        <ContactDetails
          isBankTransferSelected={isBankTransferSelected}
          isDamageRepairSelected={isDamageRepairSelected}
          changeHandler={contactDetchangeHandler}
          validationData={validationData}
          claimsInfo={claimsInfo}
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

      {showRegModal && (
        <RegisterClaimModalDialog
          showRegModal={showRegModal}
          setShowRegModal={setShowRegModal}
        />
      )}
    </div>
  );
};

export default RegisterClaimLeft;
