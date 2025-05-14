import { Card } from "react-bootstrap";
import Compensation from "../register/compensation";
import ThemeButton from "../components/ThemeButton";
import { useContext, useState } from "react";
import { DataContext } from "../../DataContext";
import GreenSuccess from "../../assets/Claims/GreenSuccess.svg";
import React from "react";
import { callAPI } from "@dpm/shared-module";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ClaimsDetails from "../register/ClaimsDetails";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

function BodyTP(props) {
  const [isCompensatePage, setCompensatePage] = useState(true);
  const [isContactPage, setContactPage] = useState(false);
  const [isSuccessClaim, setSuccessclaim] = useState(false);
  const [isIAgree, setIAgree] = useState(false);
  const [isMobilenum, setMobilenum] = useState(false);
  const [mobilenumData, setMobilenumData] = useState<string | undefined>(
    props?.validationData?.mobile
  );
  const [emailData, setEmailData] = useState<string | undefined>(
    props?.validationData?.email
  );

  // default compensate type setter
  const [compensationType, setCompensationtype] = useState<string>("Bank");
  // compensation type Page1 all required fields filled
  const [isCompensationType, setCompensationTypePage1] = useState(false);
  // compensation type Page2 all required fields filled
  const [isCompensationContactType, setCompensationContactTypePage2] =
    useState(false);
  // claim register successfull data response
  const [successClaimData, setSucessClaimData] = useState<any>();

  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; size: number; base64: string }[]
  >([]);

  //files upload final data files
  const onChangeFileDatahandler = (Filesdata: any) => {
    setFileData(Filesdata);
  };
  //Compensation - compo change handler fn
  const Onchangehandler = (name: string, isIBAN: boolean, value?: string) => {
    // const { value } = event?.target as HTMLInputElement;
    if (name === "iBAN") setCompensationTypePage1(isIBAN);
    if (name === "IAgree") {
      setIAgree(isIBAN);
    }
    if (name === "mobilenum") {
      setMobilenum(isIBAN);
      setMobilenumData(value);
    }
    if (name === "emailId") {
      setEmailData(value);
    }
    if (name === "Transfer" || name === "Repair") {
      setCompensationtype(name);
    }
  };

  //continue button click handler return accept fn
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { title } = event?.target as HTMLInputElement;
    // this means current page is Compensation Page1 ie
    if (title === "Continue") {
      if (isCompensatePage === true) {
        setCompensatePage(false);
        if (isContactPage === true) {
          setContactPage(false);
        } else setContactPage(true);
      }
    } else {
      submitRegisterClaim("SA65500000007964200");
    }
  };

  // Submit Register New Claim Data
  const submitRegisterClaim = async (iBAN: String) => {
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/RegisterClaim`,
        {
          referenceNo: "1720945410603",
          sourceType: "1",
          claimRequestType: "TPL",
          caseReportId: props?.validationData?.caseReportId || null,
          sequenceNo: props?.validationData?.sequenceNo || null,
          ownerId: props?.validationData?.ownerId || null,
          estimateValue: props?.validationData?.estimateValue || null,
          vehicleOwnerDOB: props?.validationData?.vehicleOwnerDob || null,
          vehicleOwnerDOBArabicH:
            props?.validationData?.vehicleOwnerDobArabicH || null,
          mobileNo: mobilenumData || null,
          email: emailData || null,
          authorizationNumber: "012345678",
          compensationType: compensationType,
          ibanNo: iBAN,
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
        }
      );

      if (
        response?.message.toUpperCase() == "SUCCESS" &&
        response.data.result == "MATCH"
      ) {
        setCompensatePage(false);
        setContactPage(false);
        setSuccessclaim(true);
        setSucessClaimData(response?.data[0]);
      } else if (
        response?.message == "ERROR" ||
        response?.message == "INTERNAL_SERVER_ERROR"
      ) {
        toast.error(response?.error?.message, {
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
      console.log(
        "Register New Claim Register Submit failed with error",
        error
      );
    } finally {
    }
  };

  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="container-fluid">
      {isSuccessClaim && (
        <ClaimsDetails
          claimResponse={successClaimData}
          validationData={props?.validationData}
        />
      )}
      {/* card */}
      <Card className={isSuccessClaim ? "d-none" : "register-card"}>
        {!isSuccessClaim && (
          <Card.Header className="register-card-header">
            <div className="title-colored">
              <div className="walaa-medium-500 title">
                {Data?.register_new_claim}
              </div>
              <div className="register-row-spacing-bottom"></div>
            </div>
          </Card.Header>
        )}
        <Card.Body className="register-card-body">
          <Compensation
            claimCheckData={props?.claimCheckData}
            validationData={props?.validationData}
            resetHeader={props?.resetHeaderHandler}
            changeHandler={Onchangehandler}
            compensationType={compensationType}
            isCompensatePage={isCompensatePage}
            isContactPage={isContactPage}
            isSuccessClaim={isSuccessClaim}
            SuccessData={successClaimData}
            changeHandlerFiles={onChangeFileDatahandler}
            mobilenumData={mobilenumData}
            emailData={emailData}
          />
        </Card.Body>
        <Card.Footer className="register-card-footer">
          <div className="d-flex align-items-center justify-content-between register-row-spacing-top">
            <div>
              {!isSuccessClaim && (
                <ThemeButton
                  classes="walaa-medium-500"
                  isDisabled={false}
                  title={Data?.back}
                  variant="link"
                  icon={true}
                  iconName="ChevronLeftIcon"
                />
              )}
            </div>
            <div>
              {!isSuccessClaim ? (
                isCompensatePage ? (
                  <ThemeButton
                    classes="register-call2action walaa-medium-500"
                    title="Continue"
                    isDisabled={!isCompensationType}
                    onClickhandler={clickHandler}
                  />
                ) : (
                  <ThemeButton
                    classes="register-call2action walaa-medium-500"
                    title={Data?.submit}
                    isDisabled={!(isIAgree && isMobilenum)}
                    onClickhandler={clickHandler}
                  />
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </Card.Footer>
      </Card>
      {/* card */}
    </div>
  );
}

export default BodyTP;
