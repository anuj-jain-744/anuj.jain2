import React, { useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RegisterClaimLeft from "./RegisterClaimLeft";
import RegisterClaimRight from "./RegisterClaimRight";
import { callAPI } from "@dpm/shared-module";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import RegisterClaimModalDialog from "../Components/RegisterClaimModalDialog";


type ClaimsInfo = {
  refNo: String;
  ownerId: String;
  SourceType: Number;
};

interface IRegisterClaim {
  type: string;
  module: string;
  validationData?: any;
  claimCheckData: any;
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
  travelData?: any;
}

const { VITE_BACKEND_BASE_URL } = import.meta.env;

const RegisterClaim = ({
  type,
  module,
  validationData,
  claimCheckData,
  claimsInfo,
  backBtnClickHandler,
  travelData,
}: IRegisterClaim) => {
  const [isBankTransferSelected, setBankTransferSelected] = useState<boolean>(false);

  // Adding this hard-coding values as per discussion with @Shamim/@Binoy/@Salman, later this value will come from API need to remove this piece!!!
  
  // default Estimated Amount by Claims - Category
  const EstimatedAmountOD: number = 8000;
  const EstimatedAmountTP: number = 15000;

  //estimated amount data
  const [isEstimatedAmountData, setEstimatedAmountData] = useState<string | number | null | undefined
  >(validationData?.estimatedAmount === null ? type === "OD" && EstimatedAmountOD : validationData?.estimatedAmount);
  
  //estimated amount data valid/not check
  const [isEstimatedAmountDataValid, setEstimatedAmountDataValid] =
    useState<boolean>(
      validationData?.estimatedAmount === null
        ? type === "OD"
          ? true
          : false
        : true
    );

  //damage repair radio
  const [isDamageRepairSelected, setDamageRepairSelected] =useState<boolean>(false);

  //contact details data
  const [isIbanValid, setIbanValid] = useState<boolean>(type === "OD" ? true : false);
  const [isIbanNumData, setIbannumData] = useState<string | undefined>("");
  const [isMobNumValid, setMobNumValid] = useState<boolean>(validationData?.mobile ? true : false);
  const [mobilenumData, setMobilenumData] = useState<string | undefined>(validationData?.mobile);
  const [isEmailValid, setEmailValid] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<string | undefined>(validationData?.email);
  const [isIAgree, setIAgree] = useState(false);

  //Liability select
  const [liabilitySelected, setLiabilitySelected] = useState<number>(
    validationData?.estimatedAmount !== null ? 1 : 2
  );

  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; size: number; base64: string }[]
  >([]);
  //is mandatory file uploaded
  const [isFileUploaded, setFileUploaded] = useState<boolean>(
    validationData?.estimatedAmount !== null
  );

  //successful claim api data & handler
  const [isSuccessClaim, setSuccessclaim] = useState(false);

  // claim register successfull data response
  const [successClaimData, setSucessClaimData] = useState<any>();

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

      case "1":
        setLiabilitySelected(1);
        setFileUploaded(true);
        break;

      case "2":
        setLiabilitySelected(2);
        break;
    }
  };

  //update handler return accept fn
  const onUpdateHandler = (value?: string | number) => {
    setEstimatedAmountDataValid(true);
    setEstimatedAmountData(value);

    // validation for estimatedAmount
    let EstAmount: number = Number(value);
    //comprehensive
    if (type === "OD") {
      if (EstAmount !== EstimatedAmountOD) {
        setEstimatedAmountDataValid(false);
      } else {
        setEstimatedAmountDataValid(true);
      }
    }
    //third-party
    else {
      if (EstAmount > 0 && EstAmount > EstimatedAmountTP) {
        setEstimatedAmountDataValid(false);
      } else {
        setEstimatedAmountDataValid(true);
      }
    }
  };

  //ContactDetails - compo change handler fn
  const contactDetchangeHandler = (
    name: string,
    isIBAN: boolean,
    value?: string
  ) => {
    switch (name) {
      case "iBAN":
        isIBAN && setIbannumData(value);
        setIbanValid(isIBAN);
        break;
      case "mobilenum":
        setMobNumValid(isIBAN);
        setMobilenumData(value);
        break;
      case "emailId":
        setEmailValid(isIBAN);
        setEmailData(value);
        break;
      case "IAgree":
        setIAgree(isIBAN);
        break;
    }
  };

  //Submit button Click handler fn
  const submitClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    submitRegisterClaim();
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

  // Submit Register New Claim Data
  const submitRegisterClaim = async () => {
    const payload = {
      referenceNo: validationData?.referenceNo || null,
      sourceType: "1",
      claimRequestType: type,
      caseReportId: claimsInfo?.refNo || null,
      sequenceNo: validationData?.sequenceNo || null,
      ownerId: claimsInfo?.ownerId || null,
      estimateValue: isEstimatedAmountData,
      vehicleOwnerDOB: validationData?.vehicleOwnerDob || null,
      vehicleOwnerDOBArabicH: validationData?.vehicleOwnerDobArabicH || null,
      mobileNo: mobilenumData || null,
      email: emailData || null,
      authorizationNumber: "012345678",
      compensationType: isBankTransferSelected ? "Bank" : "Damage",
      ibanNo: isIbanNumData,
      bankName: "45",
      documents: fileData?.map((item: { name: string; base64: any }) => {
        const fileParts = item?.name?.split(".");
        return {
          fileName: fileParts?.slice(0, -1).join("."),
          fileExtension: fileParts?.slice(-1)[0],
          docType: 521,
          docFile: item.base64,
        };
      }),
    };
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/RegisterClaim`,
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
          className: "error-cust",
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
      }
    } catch (error) {
      console.error(
        "Register New Claim Register Submit failed with error",
        error
      );
      toast.error("Register New Claim Register Submit failed with error", {
        icon: <WarningAmberOutlinedIcon />,
        className: "error-cust",
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
    }
  };

  return (
    // Layout
    <React.Fragment>
      {/* Toaster  */}
      <ToastContainer />
      <RegisterClaimModalDialog />
      {isSuccessClaim ? (
        <> success claim details</>
      ) : (
      // TODO : need to be remove after complete implimentation it has prop which can be used  
        // <ClaimsDetails
        //   claimResponse={successClaimData}
        //   validationData={validationData}
        //   claimsInfo={claimsInfo}
        // />
        <React.Fragment>
          <div
            className="register-new-claim-container-main p-0"
            data-testid="registerclaim-test"
          >
            {/* left content */}
            <RegisterClaimLeft
              policyNumber={validationData?.policyNumber}
              travelData={travelData}
              isBankTransferSelected={isBankTransferSelected}
              isDamageRepairSelected={isDamageRepairSelected}
              liabilitySelected={liabilitySelected}
              isIAgreeSelected={isIAgree}
              changeHandler={onChangeHandler}
              updateHandler={onUpdateHandler}
              changeHandlerFiles={onchangeHandlerFiles}
              isMandatoryFileUploaded={isMandatoryFileUploaded}
              contactDetchangeHandler={contactDetchangeHandler}
              validationData={validationData}
              claimsInfo={claimsInfo}
              type={type} 
              mobilenumData={mobilenumData}
            />
            {/* right content */}
            <RegisterClaimRight
              claimsInfo={claimsInfo}
              validationData={validationData}
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
                      isIbanValid &&
                      isMobNumValid &&
                      mobilenumData &&
                      isIAgree &&
                      isEstimatedAmountDataValid &&
                      isFileUploaded
                        ? "payment-btn register-enabled"
                        : "payment-btn register-disabled"
                    }
                    isDisabled={
                      isIbanValid &&
                      isMobNumValid &&
                      mobilenumData &&
                      isFileUploaded &&
                      isIAgree &&
                      isEstimatedAmountDataValid
                        ? false
                        : true
                    }
                    title="Submit"
                    variant="link"
                    icon={false}
                    iconRight={true}
                    iconName="ChevronRightIcon"
                    onClickhandler={submitClickHandler}
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
