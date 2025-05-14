import React, { useEffect, useMemo, useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RegisterClaimLeft from "./RegisterClaimLeft";
import RegisterClaimRight from "./RegisterClaimRight";
import { callAPI } from "@dpm/shared-module";
import { toast } from "react-toastify";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import RegisterClaimModalDialog from "../Components/RegisterClaimModalDialog";
import usePolicyData from "pages/travel/Policy-services/policyCancellation/hook/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import { toCamelCase } from "utils/quoteAndBuyTravel";
import ClaimsDetails from "./SuccessClaim";
import { downloadPDF } from "utils/CancelPolicyDownload";
import { mockDataForRegisterClaim } from "./mockForRegisterClaim";
import { formatDateYYYYMMDD, formatTravelDate } from "utils/formatDate";
import { useLocation } from "react-router-dom";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import { TRAVEL } from "constant";

interface PropTypes {
  type: string;
  backBtnClickHandler: () => void;
  travelData?: any;
  policyNumber?: string;
}

const { VITE_BACKEND_UTILITY_URL } = import.meta.env;

const RegisterClaim = ({
  type,
  backBtnClickHandler,
  travelData,
  policyNumber,
}: PropTypes) => {
  const [place, setPlace] = useState<string>("");
  const [dateOfLoss, setDateOfLoss] = useState<string>("");
  const [estimations, setEstimations] = useState<Array<Travel.ClaimEstimation>>(
    []
  );
  const location = useLocation();

  const policyNumbers = useMemo(() => {
    let result: Array<string> = [];
    const { policies, data } = location.state;
    if (Array.isArray(policies))
      result = policies.map(({ policyNo }) => policyNo);
    else if (data instanceof Object) {
      if (data.policyNo) result = [data.policyNo];
      else if (data.policies instanceof Object && data.policies.policyNo)
        result = [data.policies.policyNo];
    }
    return result;
  }, []);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string>(
    policyNumbers.length === 1 ? policyNumbers[0] : ""
  );
  // get data of the selected policy
  const {
    makeApiCall: getPolicyData,
    error: policyError,
    data: policyRes,
  } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber,
    Product: TRAVEL,
  });
  // get the validation result of estimations
  const isValidEstimation: boolean = useMemo(
    () =>
      estimations.length > 0 &&
      estimations.every(
        (item) =>
          item.codeId &&
          item.amount &&
          item.desc &&
          item.names.length > 0 &&
          item.files.length > 0 // &&
        // item.files.every((val) => val.size)
      ),
    [estimations]
  );
  // get formatted data
  const policyData = usePolicyData(policyRes);
  useEffect(() => {
    if (selectedPolicyNumber) getPolicyData(selectedPolicyNumber);
  }, [selectedPolicyNumber]);

  const [isBankTransferSelected, setBankTransferSelected] =
    useState<boolean>(false);

  //damage repair radio
  const [isDamageRepairSelected, setDamageRepairSelected] =
    useState<boolean>(false);

  //contact details data
  const [isIbanValid, setIbanValid] = useState<boolean>(
    type === "OD" ? true : false
  );
  const [isIAgree, setIAgree] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Set the modal to visible on page load
  // useEffect(() => {
  //   setIsModalVisible(true);
  // }, []);
  useEffect(() => {
    const isModalShown = sessionStorage.getItem("isModalShown");

    if (!isModalShown) {
      setIsModalVisible(true);
      sessionStorage.setItem("isModalShown", "true");
    }
  }, []);

  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; size: number; base64: string }[]
  >([]);
  //is mandatory file uploaded
  const [isFileUploaded, setFileUploaded] = useState<boolean>(false);

  //successful claim api data & handler
  const [isSuccessClaim, setSuccessclaim] = useState(false);

  // claim register successfull data response
  const [successClaimData, setSucessClaimData] = useState<any>();

  // TODO :  needed in  case of multiple policy selection
  //change handler return accept fn
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    switch (value) {
      case "Damage Repair":
        setBankTransferSelected(false);
        setDamageRepairSelected(true);
        setIbanValid(true);
        break;

      case "Bank Transfer":
        setDamageRepairSelected(false);
        setBankTransferSelected(true);
        setIbanValid(false);
        break;
    }
  };

  //change handler return for fileList
  const onchangeHandlerFiles = (Filesdata: any) => {
    setFileData(Filesdata);
  };

  //change handler fn that checks if mandatory file uploded or not
  const isMandatoryFileUploaded = (isFileExist: boolean) => {
    //mandatory file uploded state update
    setFileUploaded(isFileExist);
  };
  const [nonMotorFnolResponse, setNonMotoFnolResponse] = useState({});
  const [isAddEstimateClicked, setIsAddEstimateClicked] = useState(false);

  // Adding one state for updating few payload details

  const initialPayloadState = {
    dateOfLoss: formatDateYYYYMMDD(new Date()),
    accidentAddress: "",
    damagePersons: "",
    causeOfLoss: "", // Add this into array to accept multiple values
  };

  const [prepPayload, setPrepPayload] = useState(initialPayloadState);

  const handleValueUpdate = (itemToUpdate: string, value: any) => {
    let dup = { ...prepPayload };
    if (itemToUpdate.toUpperCase() === "DATEOFLOSS") {
      dup = { ...dup, dateOfLoss: value[0], damagePersons: value[1] };
    } else if (itemToUpdate.toUpperCase() === "ACCIDENTADDRESS") {
      dup = { ...dup, accidentAddress: value };
    } else if (itemToUpdate.toUpperCase() === "CAUSEOFLOSS") {
      dup = { ...dup, causeOfLoss: value };
    }
    setPrepPayload({ ...dup });
  };

  //ContactDetails - compo change handler fn
  const contactDetchangeHandler = (
    name: string,
    isIBAN: boolean,
    value?: string
  ) => {
    switch (name) {
      case "iBAN":
        setIbanValid(isIBAN);
        break;
      case "IAgree":
        setIAgree(isIBAN);
        break;
    }
  };

  const policyHlderName = toCamelCase(
    policyData?.policyDetails?.travelerName ?? ""
  );
  // Submit Register New Claim Data
  const submitRegisterClaim = async () => {
    const claimsData = {
      ...nonMotorFnolResponse?.claimInfo,
      dateOfLoss: formatTravelDate(dateOfLoss),
      accidentAddress: place,
      policyHolderId: policyData?.policyHolderDetails?.idNumer,
      policyHolderName: policyData?.policyDetails?.travelerName,
      policyNumber: selectedPolicyNumber,
      contactTelephone: policyData?.policyCard?.mobileNo,
      // Values which we get from FNOL response
    };
    const travelerNames =
      policyRes?.policyLob
        ?.map(
          (item) =>
            item?.policyRisk?.map((risk) => risk.travellerNameEnglish) ?? []
        )
        ?.flat() || [];
        const coverageInfoList = nonMotorFnolResponse?.subClaimInfo?.coverageInfoList ?? [];
    const subClaimInfo = {
      ...nonMotorFnolResponse?.subClaimInfo,
      damageObject: travelerNames.join(","),
      nationalId: policyData?.policyCard?.nationalId,
      coverageInfoList: estimations.map(item => {
        const coverage = coverageInfoList.find(val => item.codeId === val.coverageCode);
        if (coverage) return {
          ...coverage,
          initialReserve: parseFloat(item.amount),
          isSelect: "1",
        }
        else return null;
      }).filter (item => item),
      iBAN: "SA0230825947458020058295",
      documents: estimations
        .map((item) =>
          item.files.map((val) => ({ docFile: val.base64, fileName: val.name }))
        )
        .flat(),
    };

    const payload = {
      claimInfo: { ...claimsData },
      subClaimInfo: { ...subClaimInfo },
    };

    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_UTILITY_URL + `NonMotor/FNOL/nonMotorRegistration`,
        payload
      );
      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.data?.result?.toUpperCase() === "MATCH"
      ) {
        setSuccessclaim(true);
        setSucessClaimData(response?.data);
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
        });
      }
    } catch (error) {
      console.error(
        "Register New Claim Register Submit failed with error",
        error
      );
      toast.error("Register New Claim Register Submit failed with error", {
        icon: <WarningAmberOutlinedIcon />,
      });
    }
  };

  if (policyError) {
    return <ErrorComponent />;
  }
  // view policy api ends

  const handleClaimDownload = () => {
    downloadPDF(mockDataForRegisterClaim);
  };

  // calling API FNOL/NonMotorFNOL

  const handleLossApi = async () => {
    try {
      const payloadNew = {
        dateOfLoss: formatTravelDate(dateOfLoss),
        policyNumber: selectedPolicyNumber,
      };

      const response = await callAPI(
        "post",
        VITE_BACKEND_UTILITY_URL + `NonMotor/FNOL/NonMotorFNOL`,
        payloadNew
      );
      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.data?.result?.toUpperCase() === "MATCH"
      ) {
        setNonMotoFnolResponse(response?.data);
        setIsAddEstimateClicked(!isAddEstimateClicked);
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
        });
      }
    } catch (error) {
      console.error(
        "Register New Claim Register Submit failed with error",
        error
      );
      toast.error("Register New Claim Register Submit failed with error", {
        icon: <WarningAmberOutlinedIcon />,
      });
    }
  };

  return (
    // Layout
    <React.Fragment>
      {isModalVisible && <RegisterClaimModalDialog />}
      {isSuccessClaim ? (
        <ClaimsDetails
          claimResponse={successClaimData}
          travelData={travelData}
          handleClaimDownload={handleClaimDownload}
          //Adding policy number
          policyNo={selectedPolicyNumber}
        />
      ) : (
        <React.Fragment>
          <div
            className="register-new-claim-container-main p-0 select-policy"
            data-testid="registerclaim-test"
          >
            <div className="register-new-claim-left-card-main d-flex flex-column max-height">
              <RegisterClaimLeft
                handlePolicySelect={setSelectedPolicyNumber}
                policyNumber={selectedPolicyNumber || policyNumber}
                travelData={travelData}
                isBankTransferSelected={isBankTransferSelected}
                isDamageRepairSelected={isDamageRepairSelected}
                isIAgreeSelected={isIAgree}
                changeHandler={onChangeHandler}
                changeHandlerFiles={onchangeHandlerFiles}
                isMandatoryFileUploaded={isMandatoryFileUploaded}
                type={type}
                policyHlderName={policyHlderName}
                policyDataSel={policyData}
                // Adding this to get few values from this comp
                handleValueUpdate={handleValueUpdate}
                // Adding this for calling API call FNOL/NonMotorFNOL
                handleLossApi={handleLossApi}
                place={place}
                handlePlace={setPlace}
                dateOfLoss={dateOfLoss}
                handleDateOfLoss={setDateOfLoss}
                contactDetchangeHandler={contactDetchangeHandler}
                estimations={estimations}
                handleEstimations={setEstimations}
                isValidEstimation={isValidEstimation}
              />
            </div>
            {/* right content */}
            <RegisterClaimRight
              policyNumber={selectedPolicyNumber || policyNumber}
            />
          </div>
          <div className="register-new-claim-container-footer-main">
            <div className="footer">
              <div className="footer-btns walaa-medium-500">
                <div>
                  <ThemeButton
                    classes={"back-btn"}
                    isDisabled={false}
                    title="Back"
                    variant="link"
                    icon={true}
                    iconName="ChevronLeftIcon"
                    onClickhandler={backBtnClickHandler}
                  />
                </div>
                <div>
                  <ThemeButton
                    classes={
                      isIbanValid && isIAgree && isValidEstimation
                        ? "payment-btn register-enabled"
                        : "payment-btn register-disabled"
                    }
                    isDisabled={
                      !(isIbanValid && isIAgree && isValidEstimation)
                    }
                    title="Submit"
                    variant="link"
                    icon={false}
                    iconRight={true}
                    iconName="ChevronRightIcon"
                    onClickhandler={submitRegisterClaim}
                  />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default RegisterClaim;
