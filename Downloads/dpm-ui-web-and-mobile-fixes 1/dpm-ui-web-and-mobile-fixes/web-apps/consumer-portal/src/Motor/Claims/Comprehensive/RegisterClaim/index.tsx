import React, { useEffect, useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RegisterClaimLeft from "./RegisterClaimLeft";
import RegisterClaimRight from "./RegisterClaimRight";
import { callAPI } from "@dpm/shared-module";
import { Bounce, toast } from "react-toastify";
import ClaimsDetails from "./SuccessClaim";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import RegisterClaimModalDialog from "../Components/RegisterClaimModalDialog";
import { WORKSHOP, CITY, SELECTED, comprehensiveOD, comprehensiveTP } from "../../../../constant";
import { useSelector } from 'react-redux';
import { RootState, } from "@dpm/shared-module";

type ClaimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  type: typeof comprehensiveOD | typeof comprehensiveTP;
      
};

interface IRegisterClaim {
  type: string;
  module: string;
  validationData?: any;
  claimCheckData: any;
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
}

const { VITE_BACKEND_BASE_URL } = import.meta.env;

const RegisterClaim = ({
  type,
  module,
  validationData,
  claimCheckData,
  claimsInfo,
  backBtnClickHandler
}: IRegisterClaim) => {
  //isAuthenticate store 
  const isAuthenticated= useSelector((state: RootState) => state.auth?.isAuthenticated);
 
  //compensation Type
  //bank transfer radio
  const [isBankTransferSelected, setBankTransferSelected] =
    useState<boolean>(false);

  // Adding this hard-coding values as per discussion with @Shamim/@Binoy/@Salman, later this value will come from API need to remove this piece!!!
  // default Estimated Amount by Claims - Category
  const EstimatedAmountOD: number = 8000;
  const EstimatedAmountTP: number = 15000;
  //estimated amount data
  const [isEstimatedAmountData, setEstimatedAmountData] = useState<
    string | number | null | undefined
  >(
    validationData?.estimatedAmount === null
      ? type === comprehensiveOD && EstimatedAmountOD
      : validationData?.estimatedAmount
  );
  //estimated amount data valid/not check
  const [isEstimatedAmountDataValid, setEstimatedAmountDataValid] =
    useState<boolean>(
      validationData?.estimatedAmount !== null ||
        (validationData?.liability !== null &&
          validationData?.liability?.length > 0) ||
        (isAuthenticated && claimCheckData?.estimatedAmount !== null) ||
        (isAuthenticated &&
          claimCheckData?.liability !== null &&
          isAuthenticated &&
          claimCheckData?.liability?.length > 0)
        ? true
        : false
    );

  //iscity selected
  const [isCitySelected, setCitySelected] = useState<null | string>(null);
  //isgarage selected
  const [isGarageSelected, setGarageSelected] = useState<
    null | { id: number; name: string }[]
  >(null);
  //no of garage selected data count check
  const [isGarageSelectedCount, setGarageSelectedCount] = useState<number>(0);

  //damage repair radio
  const [isDamageRepairSelected, setDamageRepairSelected] =
    useState<boolean>(false);

  //contact details data
  const [isIbanValid, setIbanValid] = useState<boolean>(
    type === comprehensiveOD ? true : false
  );
  const [isIbanNumData, setIbannumData] = useState<string | undefined>("");
  const [isMobNumValid, setMobNumValid] = useState<boolean>(
    validationData?.mobile ? true : false
  );
  const [mobilenumData, setMobilenumData] = useState<string | undefined>(
    validationData?.mobile
  );
  const [isEmailValid, setEmailValid] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<string | undefined>(
    validationData?.email
  );
  const [isIAgree, setIAgree] = useState(false);

  //Liability select
  const [liabilitySelected, setLiabilitySelected] = useState<number>(
    1
  );
  //isLiability document uploaded
  const [isLiabilityDocUploaded, setLiabilityDocUploaded] = useState<boolean>(
    true
  );

  // special case for NAJM claims
  const [isNajmCase , setNajmCase] = useState<boolean>(false);

  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; fileName: string; fileExtension: string; size: number; base64: string; docFile: string }[]
  >([]);
  //is mandatory file uploaded
  const [isFileUploaded, setFileUploaded] = useState<boolean>(
    validationData?.estimatedAmount !== null ||
      validationData?.liability?.length !== 0 ||
      claimCheckData?.estimatedAmount !== null ||
      claimCheckData?.liability?.length !== 0
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
       type === comprehensiveOD && setIbanValid(true);
        if (fileData && fileData[0]?.fileName?.length > 0) {
          setFileUploaded(true);
        } else if (liabilitySelected === 1) {
          setFileUploaded(true);
        } else {
          setFileUploaded(false);
        }
        break;

      case "Bank Transfer":
        setDamageRepairSelected(false);
        setBankTransferSelected(true);
        if (fileData && fileData[0]?.fileName?.length > 0) {
          setFileUploaded(true);
        } else if (
          liabilitySelected === 1 &&
          (validationData?.estimatedAmount !== null ||
            (validationData?.liability !== null &&
              validationData?.liability?.length > 0) ||
            (isAuthenticated && claimCheckData?.estimatedAmount !== null) ||
            (isAuthenticated &&
              claimCheckData?.liability !== null &&
              isAuthenticated &&
              claimCheckData?.liability?.length > 0))
        ) {
          setFileUploaded(true);
        } else {
          setFileUploaded(false);
        }
        setIbanValid(false);
        setCitySelected(null);
        setGarageSelected(null);
        break;

      case "1":
        setLiabilitySelected(1);
        setEstimatedAmountDataValid(true);
        setFileUploaded(true);
        break;

      case "2":
        setLiabilitySelected(2);
        setFileUploaded(false);
        setEstimatedAmountDataValid(!!(fileData && fileData[0]?.fileName?.length > 0));
        break;
      
      case "LiabilityFileUpload":
        setLiabilityDocUploaded(true);
        setEstimatedAmountDataValid(true);
        break;
      
      case "LiabilityFileMandatoryRemoved":
        setLiabilityDocUploaded(false);
        setFileUploaded(false);
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
    if (type === comprehensiveOD) {
      if (EstAmount !== EstimatedAmountOD) {
        setEstimatedAmountDataValid(false);
      } else {
        setEstimatedAmountDataValid(true);
      }
    }
    //third-party
    else {
      let estAmoutNumber: number = Number(value);
      setEstimatedAmountDataValid(!!(estAmoutNumber && estAmoutNumber > 0));
    }
  };

  // workshop repair update handler return accept fn
  const onUpdateHandlerWorkshop = (
    value?: string | null | [] | { id: number; name: string }[],
    name?: string
  ) => {
    switch (name) {
      case CITY:
        if (value === SELECTED) setCitySelected(null);
        else setCitySelected(value as string);
        // when city is changed, then garage will be reset
        setGarageSelected(null);
        setGarageSelectedCount(isGarageSelected?.length ?? 0);
        break;
      case WORKSHOP:
        setGarageSelected(value as { id: number; name: string }[]);
        setGarageSelectedCount(isGarageSelected?.length ?? 0);
        break;
    }
  };

  //ContactDetails - compo change handler fn
  const contactDetchangeHandler = (
    name: string,
    isIBAN: boolean,
    value?: string,
    fileData?: {
      docType: string;
      fileName: string;
      fileExtension: string;
      docFile: string;
    }[]
  ) => {
    switch (name) {
      case "iBAN":
        isIBAN && setIbannumData(value);
        fileData &&
          setFileData(
            fileData as unknown as {
              name: string;
              fileName: string;
              fileExtension: string;
              size: number;
              base64: string;
              docFile: string;
            }[]
          );
        (isBankTransferSelected || isDamageRepairSelected) && setIbanValid(isIBAN);
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
    //check if mandatory file uploded or not
    if(Filesdata[0] !== null) {
      setFileUploaded(true);
    }else{
     liabilitySelected ===2 && setFileUploaded(false);
     (claimsInfo?.type === comprehensiveOD && isNajmCase && Filesdata[0] === null) && setFileUploaded(false);
     isDamageRepairSelected ||
        (claimsInfo?.type === comprehensiveOD && liabilitySelected === 2) ||
        (claimsInfo?.type === comprehensiveOD &&
          (validationData?.liability?.length === 0 ||
            (isAuthenticated && claimCheckData?.liability?.length === 0)) &&
          Filesdata[0] === null &&
          setFileUploaded(false));
    }
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
      sourceType: claimsInfo?.SourceType || null, 
      claimRequestType: type,
      caseReportId: claimsInfo?.refNo || null,
      sequenceNo: validationData?.sequenceNo || null,
      ownerId: claimsInfo?.ownerId || null,
      // @Md Shamim - as per him added this default value for now, later this value will come from API need to remove this piece!!!
      estimateValue: isEstimatedAmountData as unknown as boolean == false ? '0' : isEstimatedAmountData,
      vehicleOwnerDOB: validationData?.vehicleOwnerDob || null,
      vehicleOwnerDOBArabicH: validationData?.vehicleOwnerDobArabicH || null,
      mobileNo: mobilenumData || null,
      email: emailData || null,
      authorizationNumber: "012345678",
      compensationType: isBankTransferSelected ? "Bank" : "Damage",
      ibanNo: isIbanNumData,
      bankName: "45",
      documents: fileData ? fileData?.map((item: { name: string; base64: string; fileName: string; fileExtension: string; size: number; docFile: string }) => {
        return {
          fileName: item?.fileName ?? null,
          fileExtension: item?.fileExtension ?? null,
          docType: 521,
          docFile: item?.docFile ?? null,
        };
      }) : []
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

  useEffect(() => {
      const areFirstTwoCharactersAlphabets = (input: string): boolean => {
        // Regular expression to check if the first two characters are alphabets
        const regex = /^[A-Za-z]{2}/;
        return regex.test(input);
      };
      setNajmCase(areFirstTwoCharactersAlphabets(claimsInfo?.refNo?.substring(0, 2)));
      areFirstTwoCharactersAlphabets && type === comprehensiveOD && setFileUploaded(!areFirstTwoCharactersAlphabets(claimsInfo?.refNo?.substring(0, 2)));
      }, []);

  return (
    // Layout
    <React.Fragment>
      <RegisterClaimModalDialog />
      {isSuccessClaim ? (
        <ClaimsDetails
          claimResponse={successClaimData}
          validationData={validationData}
          claimsInfo={claimsInfo}
        />
      ) : (
        <React.Fragment>
          <div
            className="register-new-claim-container-main p-0"
            data-testid="registerclaim-test"
          >
            {/* left content */}
            <RegisterClaimLeft
              isBankTransferSelected={isBankTransferSelected}
              isDamageRepairSelected={isDamageRepairSelected}
              liabilitySelected={liabilitySelected}
              isIAgreeSelected={isIAgree}
              changeHandler={onChangeHandler}
              updateHandler={onUpdateHandler}
              // workshop repair update handler
              updateHandlerWorkshop={onUpdateHandlerWorkshop}
              changeHandlerFiles={onchangeHandlerFiles}
              isMandatoryFileUploaded={isMandatoryFileUploaded}
              contactDetchangeHandler={contactDetchangeHandler}
              validationData={validationData}
              claimCheckData={claimCheckData}
              claimsInfo={claimsInfo}
              type={type}
              // response field values
              mobilenumData={mobilenumData}
              // estimated amount data
              isEstimatedAmountData={isEstimatedAmountData}
            />
            {/* right content */}
            <RegisterClaimRight
              claimsInfo={claimsInfo}
              validationData={validationData}
              claimCheckData={claimCheckData}
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
                      isFileUploaded &&
                      (isDamageRepairSelected || type === comprehensiveOD
                        ? isCitySelected &&
                          isCitySelected.length > 0 &&
                          isGarageSelectedCount > 0
                        : true)
                        ? "payment-btn register-enabled"
                        : "payment-btn register-disabled"
                    }
                    isDisabled={
                      isIbanValid &&
                      isMobNumValid &&
                      mobilenumData &&
                      isFileUploaded &&
                      isIAgree &&
                      isEstimatedAmountDataValid &&
                      (isDamageRepairSelected || type === comprehensiveOD
                        ? isCitySelected &&
                          isCitySelected.length > 0 &&
                          isGarageSelectedCount > 0
                        : true)
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