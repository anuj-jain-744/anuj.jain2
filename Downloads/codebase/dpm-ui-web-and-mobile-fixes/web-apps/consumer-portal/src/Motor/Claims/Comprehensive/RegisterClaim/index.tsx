import React, { useEffect, useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RegisterClaimLeft from "./RegisterClaimLeft";
import RegisterClaimRight from "./RegisterClaimRight";
import { callAPI, RootState, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { Bounce, toast } from "react-toastify";
import ClaimsDetails from "./SuccessClaim";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import RegisterClaimModalDialog from "../Components/RegisterClaimModalDialog";
import {
  WORKSHOP,
  OTHERS_TITL,
  CITY,
  SELECTED,
  comprehensiveOD,
  comprehensiveTP,
  BankNumDefault,
  Additional_Remarks,
  taqderr,
  lossDate,
  lossType,
  OTHERS_CASE_SOURCE_TYPE,
  lossDescription,
  estAmountOthers,
  OTHERS_CASE_BANK,
  OTHERS_LIABILITY_PER,
  submit,
  Damage,
  Bank,
  CLAIM_CASES,
} from "../../../../constant";
import { useSelector } from "react-redux";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";
import RightPanelResp from "components/RightPanelResp"; 
import { useMatchDocument } from "Motor/ClaimHooks/useMatchDocument";

type ClaimsInfo = {
  refNo: string;
  ownerId: string;
  SourceType: number;
  type: typeof comprehensiveOD | typeof comprehensiveTP;
};

interface IRegisterClaim {
  languageData: {[key:string]: string}
  type: string;
  module: string;
  validationData?: any;
  claimCheckData: any;
  claimsInfo: ClaimsInfo;
  backBtnClickHandler: () => void;
  othersClaimInfo?: OthersClaimInfo;
}

const { VITE_BACKEND_BASE_URL } = import.meta.env;

const RegisterClaim = ({
  languageData,
  type,
  module,
  validationData,
  claimCheckData,
  claimsInfo,
  backBtnClickHandler,
  othersClaimInfo,
}: IRegisterClaim) => {
  //isAuthenticate store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  //compensation Type
  //bank transfer radio
  const [isBankTransferSelected, setBankTransferSelected] = useState<boolean>(false);
 
  // Adding this hard-coding values as per discussion with @Shamim/@Binoy/@Salman, later this value will come from API need to remove this piece!!!
  // default Estimated Amount by Claims - Category
  const EstimatedAmountOD: number = 8000;
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
  const [isIbanBankName, setIbanBankName] = useState<string | undefined>(
    BankNumDefault
  );
  const [isMobNumValid, setMobNumValid] = useState<boolean>(
    validationData?.mobile ? true : false
  );
  const [mobilenumData, setMobilenumData] = useState<string | undefined>(
    validationData?.mobileNo
  );
  const [emailData, setEmailData] = useState<string | undefined>(
    validationData?.email
  );
  const [isIAgree, setIAgree] = useState(false);

  //Liability select
  const [liabilitySelected, setLiabilitySelected] = useState<number>(1);

  // special case for NAJM claims
  const [isNajmCase, setNajmCase] = useState<boolean>(false);

  //uploaded files data
  const [fileData, setFileData] = useState<
    {
      name: string;
      fileName: string;
      fileExtension: string;
      size: number;
      base64: string;
      docFile: string;
    }[]
  >([]);
  //liability file data
  const [liabilityFileData, setLiabilityFileData] = useState<
    {
      name: string;
      fileName: string;
      fileExtension: string;
      size: number;
      base64: string;
      docFile: string;
    }[]
  >([]);
  //ibandocuments files data
  const [iBanFileData, setIBanFileData] = useState<
    {
      name: string;
      fileName: string;
      fileExtension: string;
      size: number;
      base64: string;
      docFile: string;
    }[]
  >([]);
  //is mandatory file uploaded
  const [isFileUploaded, setFileUploaded] = useState<boolean>(
    (validationData?.estimatedAmount !== null ||
      validationData?.liability?.length !== 0 ||
      claimCheckData?.estimatedAmount !== null ||
      claimCheckData?.liability?.length !== 0) &&
      fileData.length > 0
  );

  //successful claim api data & handler
  const [isSuccessClaim, setSuccessclaim] = useState(false);
  // claim register successfull data response
  const [successClaimData, setSucessClaimData] = useState<any>();

  // additional remarks
  const [additionalRemarks, setAdditionalRemarks] = useState<string>("");

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const isValidFileData =
    fileData &&
    fileData[0]?.fileName?.length > 0 &&
    fileData[0] !== null &&
    isIbanValid;

  const hasValidationData =
    validationData?.estimatedAmount !== null ||
    (validationData?.liability !== null &&
      validationData?.liability?.length > 0);

  const isAuthenticatedData =
    (isAuthenticated && claimCheckData?.estimatedAmount !== null) ||
    (isAuthenticated &&
      claimCheckData?.liability !== null &&
      isAuthenticated &&
      claimCheckData?.liability?.length > 0);

  const validClaimSourceValid =
    claimsInfo?.SourceType !== OTHERS_CASE_SOURCE_TYPE;

  const validFileLiabilitySelected =
    liabilitySelected === 1 &&
    (hasValidationData || isAuthenticatedData) &&
    isIbanValid;

  //change handler return accept fn
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    switch (value) {
      case "Damage Repair":
        setBankTransferSelected(false);
        setDamageRepairSelected(true);
        type === comprehensiveOD && setIbanValid(true);
        if (isValidFileData) {
          setFileUploaded(true);
        } else if (
          liabilitySelected === 1 &&
          fileData[0] !== null &&
          isIbanValid
        ) {
          setFileUploaded(true);
        } else {
          setFileUploaded(false);
        }
        break;

      case "Bank Transfer":
        setDamageRepairSelected(false);
        setBankTransferSelected(true);
        if (isValidFileData) {
          setFileUploaded(true);
        } else if (validFileLiabilitySelected) {
          validClaimSourceValid && setFileUploaded(true);
        } else {
          setFileUploaded(false);
        }
        setIbanValid(isIbanValid);
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
        setEstimatedAmountDataValid(
          !!(fileData && fileData[0]?.fileName?.length > 0)
        );
        break;

      case "LiabilityFileUpload":
        validClaimSourceValid &&
          claimCheckData?.estimatedAmount !== null &&
          setEstimatedAmountDataValid(true);
        setFileUploaded(true); // latest change
        break;

      case "LiabilityFileMandatoryRemoved":
        setFileUploaded(false);
        break;
    }
  };

  //others case
  //for taqdeer
  const [taqdeerValue, setTaqdeerValue] = useState<string>("");
  //for Date of loss
  const [dateOfLoss, setDateOfLoss] = useState<string>("");
  //for Loss Type
  const [lossTypeIs, setLossType] = useState<string>(
    othersClaimInfo?.lossType ? othersClaimInfo?.lossType : ""
  );
  //for description of loss
  const [descriptionOfLoss, setDescriptionOfLoss] = useState<string>("");
  //for liability percentage
  const [liabilityPercentage, setLiabilityPercentage] = useState<string>("");

  const updateHandlerWithName = (
    name: string | undefined,
    value: string | number | undefined
  ) => {
    switch (name) {
      // for taqdeer value
      case taqderr:
        setTaqdeerValue(value as string);
        break;
      // for Date of Loss
      case lossDate:
        setDateOfLoss(value as string);
        break;
      // for Loss Type
      case lossType:
        setLossType(value as string);
        break;
      // for description of loss
      case lossDescription:
        setDescriptionOfLoss(value as string);
        break;
      // for estimated amount Others
      case estAmountOthers:
        setEstimatedAmountDataValid(
          typeof value === "string" && value.length > 0
        );
        setEstimatedAmountData(value);
        break;
      // for liability percentage
      case OTHERS_LIABILITY_PER:
        const liabilityPercentageValue =
          value || !isNaN(Number(value)) ? value : "";
        setLiabilityPercentage(liabilityPercentageValue as string);
        break;
    }
  };
  //update handler return accept fn
  const onUpdateHandler = (value?: string | number, name?: string) => {
    // for others case
    if (name) {
      updateHandlerWithName(name, value);
    }
    // for estimateamount
    else {
      setEstimatedAmountDataValid(true);
      setEstimatedAmountData(value);
      // validation for estimatedAmount
      const EstAmount: number = Number(value);
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
        const estAmoutNumber: number = Number(value);
        setEstimatedAmountDataValid(!!(estAmoutNumber && estAmoutNumber > 0));
      }
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
        setGarageSelectedCount(value?.length ?? 0);
        break;
    }
  };

  //ContactDetails - compo change handler fn
  const contactDetchangeHandler = (
    name: string,
    isIBAN: boolean,
    value?: string,
    bankName?: string,
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
        bankName && setIbanBankName(bankName?.length > 0 ? bankName : BankNumDefault);
        if(isIBAN && bankName && bankName?.length > 0 && fileData?.length > 0) {
            setFileUploaded(true);
        }
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
        // updating to iBanFileData
        fileData &&
          setIBanFileData(
            fileData as unknown as {
              name: string;
              fileName: string;
              fileExtension: string;
              size: number;
              base64: string;
              docFile: string;
            }[]
          );
        (isBankTransferSelected ||
          isDamageRepairSelected ||
          claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE) &&
          setIbanValid(isIBAN);
        break;
      case "mobilenum":
        setMobNumValid(isIBAN);
        setMobilenumData(value);
        break;
      case "emailId":
        setEmailData(value);
        break;
      case "IAgree":
        setIAgree(isIBAN);
        break;
      case Additional_Remarks:
        setAdditionalRemarks(value as string);
        break;
    }
  };

  const  getCompensationType = ():string => {
    let compensationType:string = "";
    if(claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE){
      compensationType = type === comprehensiveOD ? Damage : ( isBankTransferSelected ? OTHERS_CASE_BANK : Damage);
    }else if(isBankTransferSelected) {
      compensationType = Bank;
    }else {
      compensationType = Damage;
    }
    return compensationType;
  }

  //Submit button Click handler fn
  const submitClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    submitRegisterClaim();
  };

  //change handler return for fileList
  const onchangeHandlerFiles = (Filesdata: any) => {
    //check if mandatory file uploded or not
    if (Filesdata[0] !== null && isIbanValid) {
      setFileUploaded(true);
    } else {
      liabilitySelected === 2 && setFileUploaded(false);
      claimsInfo?.type === comprehensiveOD &&
        isNajmCase &&
        Filesdata[0] === null &&
        setFileUploaded(false);
      /* if claim type is ThirdParty and and fileData is null the make setFileloaded false*/
      claimsInfo?.type === comprehensiveTP &&
        Filesdata[0] === null &&
        setFileUploaded(false);
      comprehensiveTP;
      isDamageRepairSelected ||
        (claimsInfo?.type === comprehensiveOD && liabilitySelected === 2) ||
        (claimsInfo?.type === comprehensiveOD &&
          (validationData?.liability?.length === 0 ||
            (isAuthenticated && claimCheckData?.liability?.length === 0)) &&
          Filesdata[0] === null &&
          setFileUploaded(false));
    }
    setFileData(Filesdata);
    // setting to liabilityFileData
    setLiabilityFileData(Filesdata);
  };
  //change handler fn that checks if mandatory file uploded or not
  const isMandatoryFileUploaded = (isFileExist: boolean) => {
    //mandatory file uploded state update
    setFileUploaded(isFileExist);
  };

  // Submit Register New Claim Data
  const submitRegisterClaim = async () => {
    setSubmitLoading(true);
    const payload = {
      referenceNo:
        validationData?.referenceNo ||
        (claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE &&
          claimCheckData?.referenceNo) ||
        null,
      sourceType: claimsInfo?.SourceType || null,
      claimRequestType: type,
      caseReportId: claimsInfo?.refNo || null,
      sequenceNo:
        validationData?.sequenceNo ||
        (othersClaimInfo?.isSequenceNo && othersClaimInfo?.SequenceNo) ||
        null,
      ownerId: claimsInfo?.ownerId || null,
      // @Md Shamim - as per him added this default value for now, later this value will come from API need to remove this piece!!!
      estimateValue:
        (isEstimatedAmountData as unknown as boolean) == false
          ? "0"
          : isEstimatedAmountData,
      vehicleOwnerDOB: validationData?.vehicleOwnerDob || null,
      vehicleOwnerDOBArabicH: validationData?.vehicleOwnerDobArabicH || null,
      mobileNo: mobilenumData || null,
      additionalRemarks: additionalRemarks || null,
      email: emailData || null,
      authorizationNumber: validationData?.referenceNo || null,
      compensationType: getCompensationType(),
      ibanNo: isIbanNumData && isIbanNumData?.length > 0 ? isIbanNumData : undefined,
      bankName: isIbanBankName === BankNumDefault ? undefined : isIbanBankName,
      // @Md shamim - once these changes are done, need to remove this piece!!! and bring above line
      //bankName: "21",
      dateOfLoss: dateOfLoss || null,
      tadeerNo: taqdeerValue || null,
      lossType: lossTypeIs || null,
      liabilityPercentage:
        liabilityPercentage?.length > 0 ? liabilityPercentage : undefined,
      descriptionOfLoss: descriptionOfLoss || null,
      claimSystem:
        validationData?.claimSystem ||
        (claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE && OTHERS_TITL) ||
        null,
      // @Md shamim - once these changes are done, need to remove this piece!!! and bring above line
      //claimSystem: validationData?.claimSystem !== 'IVOX' ? 'EBAO' : validationData?.claimSystem,
      documents: [
        ...(iBanFileData ?? []).map(
          (item: {
            name: string;
            base64: string;
            fileName: string;
            fileExtension: string;
            size: number;
            docFile: string;
          }) => ({
            fileName: item?.fileName ?? null,
            docFile: item?.docFile ?? null,
          })
        ),
        ...(liabilityFileData ?? []).map(
          (item: {
            name: string;
            base64: string;
            fileName: string;
            fileExtension: string;
            size: number;
            docFile: string;
          }) => ({
            fileName: item?.fileName ?? null,
            docFile: item?.docFile ?? null,
          })
        ),
      ],
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
        setSubmitLoading(false);
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        setSubmitLoading(false);
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
          className: "error-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error(
        "Register New Claim Register Submit failed with error",
        error
      );
      toast.error("Register New Claim Register Submit failed with error", {
        icon: <WarningAmberOutlinedIcon />,
        className: "error-cust",
        position: "top-right",
        autoClose: TOAST_AUTOCLOSE_TIMER || false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const areFirstTwoCharactersAlphabets = (input: string): boolean => {
      // Regular expression to check if the first two characters are alphabets
      const regex = /^[A-Za-z]{2}/;
      return regex.test(input);
    };
    setNajmCase(
      areFirstTwoCharactersAlphabets(claimsInfo?.refNo?.substring(0, 2))
    );

    // specific to others case
    if (claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE) {
      setEstimatedAmountDataValid(false);
      setIbanValid(false);
      setMobNumValid(false);
      setMobilenumData("");
      type === comprehensiveTP && setFileUploaded(false);
    }

    // setting iban specific to comprehensiveOD - others case - when sequence number is present
    if (claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE && 
      type === comprehensiveOD && othersClaimInfo?.isSequenceNo && 
      othersClaimInfo?.SequenceNo && othersClaimInfo?.SequenceNo.length > 0) {
      setIbanValid(true);
    }
    if(type === comprehensiveOD  && !isNajmCase && liabilitySelected === 1){
      setFileUploaded(true);
    }
  }, []);

  // converting mobile number 966 to 05 format
  useEffect(() => {
    if (
      validationData?.mobileNo &&
      validationData?.mobileNo?.toString()?.length > 0
    ) {
      const mobileNumber: string = validationData?.mobileNo
        ? validationData?.mobileNo?.toString()
        : "";
      //as per the FSD in next pages we are setting the mobile number starts with 0 instead starts with 966(country code)
      if (mobileNumber?.length === 12) {
        const firstTwoDigits = mobileNumber.substring(0, 3);
        const remainingDigits = mobileNumber.substring(3);
        const regex = /^966/;
        if (regex.test(firstTwoDigits)) {
          setMobilenumData("0" + remainingDigits);
        } else {
          setMobilenumData(mobileNumber);
        }
      }
    }
  }, [validationData]);

  useEffect(() => {
    if (isNajmCase && validationData?.estimatedAmount === null) {
      type === comprehensiveOD && setEstimatedAmountDataValid(true);
    }
  }, [isNajmCase, validationData?.estimatedAmount]);
  /*
    this effect is used to check if the document is available or not for upload after match with cms
    it will be used to show the upload file button or not
    */
    const caseReportedType =  isNajmCase
    ? CLAIM_CASES?.NAJM_CASE?.toLocaleLowerCase()
    : CLAIM_CASES?.POLICE_CASE?.toLocaleLowerCase();
    const Data = languageData;
    const  getDocumentList   =  useMatchDocument({
    type,
    validationData,
    caseReportedType,
    Data,
    });
    //if no document fetched from cms allow user to still submit the claim
   useEffect(()=>{
    if(getDocumentList?.length === 0){
      setFileUploaded(true);
    }else if(!(type === comprehensiveOD  && !isNajmCase && liabilitySelected === 1)){
      setFileUploaded(false);
    }
   },[getDocumentList?.length])


  const isButtonEnabled =
    (isIbanValid &&
      isMobNumValid &&
      mobilenumData &&
      isIAgree &&
      isEstimatedAmountDataValid &&
      isFileUploaded &&
      ((isDamageRepairSelected || type === comprehensiveOD
        ? isCitySelected &&
          isCitySelected.length > 0 &&
          isGarageSelectedCount > 0
        : true) ||
        (claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE &&
          dateOfLoss?.length > 0 &&
          lossTypeIs?.length > 0) ||
        (isBankTransferSelected && claimsInfo?.type === comprehensiveTP) ||
        (isDamageRepairSelected &&
          claimsInfo?.type === comprehensiveTP &&
          isCitySelected &&
          isCitySelected.length > 0 &&
          isGarageSelectedCount > 0))) ||
    (claimsInfo?.type === comprehensiveOD &&
      isFileUploaded &&
      isMobNumValid &&
      mobilenumData &&
      isIAgree &&
      isCitySelected &&
      isCitySelected.length > 0 &&
      isGarageSelectedCount > 0);

  const buttonClasses = isButtonEnabled
    ? "payment-btn register-enabled"
    : "payment-btn register-disabled";



  return (
    // Layout
    <React.Fragment>
      {submitLoading && <LoaderOverlay />}
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
            className="register-new-claim-container-main"
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
              // description of loss others case
              lossDescription={descriptionOfLoss}
              othersClaimInfo={othersClaimInfo}
            />


             
            <RightPanelResp
              rightClassName="rightSidePanel" 
              sumaryTitle = {languageData?.summary_details}
            > 
                <RegisterClaimRight
                  claimsInfo={claimsInfo}
                  validationData={validationData}
                  claimCheckData={claimCheckData}
                  othersClaimInfo={othersClaimInfo}
                />
            </RightPanelResp>
       

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
                  {claimsInfo?.SourceType === OTHERS_CASE_SOURCE_TYPE &&
                  othersClaimInfo?.isSequenceNo &&
                  othersClaimInfo?.SequenceNo &&
                  othersClaimInfo?.SequenceNo.length > 0 ? (
                    <ThemeButton
                      classes={
                        (claimsInfo?.type === comprehensiveOD &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isCitySelected &&
                        isCitySelected.length > 0 &&
                        isGarageSelectedCount > 0 &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false) ||
                        (claimsInfo?.type === comprehensiveTP &&
                        isBankTransferSelected &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false) ||
                        (claimsInfo?.type === comprehensiveTP &&
                        isDamageRepairSelected &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isCitySelected &&
                        isCitySelected.length > 0 &&
                        isGarageSelectedCount > 0 &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false)
                          ? "payment-btn register-enabled"
                          : "payment-btn register-disabled"
                      }
                      isDisabled={
                        (claimsInfo?.type === comprehensiveOD &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isCitySelected &&
                        isCitySelected.length > 0 &&
                        isGarageSelectedCount > 0 &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false) ||
                        (claimsInfo?.type === comprehensiveTP &&
                        isBankTransferSelected &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false) ||
                        (claimsInfo?.type === comprehensiveTP &&
                        isDamageRepairSelected &&
                        isEstimatedAmountData &&
                        liabilityPercentage?.length > 0 &&
                        isFileUploaded &&
                        isCitySelected &&
                        isCitySelected.length > 0 &&
                        isGarageSelectedCount > 0 &&
                        isMobNumValid &&
                        mobilenumData &&
                        isIbanValid &&
                        isIAgree
                          ? true
                          : false)
                          ? false
                          : true
                      }
                      title={submit}
                      variant="link"
                      icon={false}
                      iconRight={true}
                      iconName="ChevronRightIcon"
                      onClickhandler={submitClickHandler}
                    />
                  ) : (
                    <ThemeButton
                      classes={buttonClasses}
                      isDisabled={!isButtonEnabled}
                      title="Submit"
                      variant="link"
                      icon={false}
                      iconRight={true}
                      iconName="ChevronRightIcon"
                      onClickhandler={submitClickHandler}
                    />
                  )}
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
