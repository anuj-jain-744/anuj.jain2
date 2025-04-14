import { DataContext } from "DataContext";
import React, { useContext, useState } from "react";
import { Card, Form, InputGroup, Spinner } from "react-bootstrap";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { callAPI } from "@dpm/shared-module";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import Iban from "components/Iban/iban";
import mockData from "./mockData.json";
import { SA } from "constant";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}

interface ICompensationObjFactory {
  isIBan: string;
  isMobilenum: string;
  isEmailId: string;
}

interface IContactDetails {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  validationData: any;
  claimsInfo: any;
  changeHandler: (name: string, isIBAN: boolean, value?: string) => void;
  mobilenumData: any;
  type: string;
  travelData: any;
}
const ContactDetails = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  validationData,
  claimsInfo,
  changeHandler,
  mobilenumData,
  type,
  travelData,
}: IContactDetails) => {
  //error state handler
  const [compensateError, setCompensateError] = useState({
    iBan: "",
    mobilenum: "",
    emailId: "",
  });

  // CompensateData
  const [compensateData, setCompensateData] = useState<ICompensationObjFactory>(
    {
      isIBan: "",
      isMobilenum: validationData?.mobile ? validationData?.mobile : "",
      isEmailId: "",
    }
  );

  // IBAN verification icon state
  const [showSuccessIcon, setSuccessIconhandler] = useState<boolean>(false);
  const [showErrorIcon, setErrorIconhandler] = useState<boolean>(false);
  const [showLoaderIcon, setLoaderIconhandler] = useState<boolean>(false);
  const [isValidIban, setIsValidIban] = useState(false);

  const [fileData, setFileData] = useState<(FileData | null)[]>([
    null,
    null,
    null,
  ]);
  const [reEnteredIban, setReEnteredIban] = useState("");
  const [bankName, setBankName] = useState("");

  //change handler return accept fn
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { defaultValue, checked, name, value } =
      event.target as HTMLInputElement;
    if (value.startsWith(SA)) {
      setIsValidIban(false);
    } else setIsValidIban(true);
    if (name === "IBan") {
      // validation for IBan value
      setCompensateData({ ...compensateData, isIBan: value });
      // set IBAN to default
      setSuccessIconhandler(false);
      setLoaderIconhandler(false);
      setErrorIconhandler(false);
      changeHandler("iBAN", false);
      if (/^[SA0-9]{0,2}\d{0,22}$/.test(value) || value === "") {
        setCompensateError({ ...compensateError, iBan: "" });
        if (value.length === 24) {          
          validateIBAN(value);          
          changeHandler("iBAN", true);
        }
      } else {
        setCompensateError({
          ...compensateError,
          iBan: travelData?.iban_error,
        });
        changeHandler("iBAN", false);
      }
    }
  };

  // validateiban Api call function
  const validateIBAN = async (iBAN: string) => {
    setLoaderIconhandler(true);
    try {
      const payload = {
        iban: iBAN,
        idType: "NATIONAL_ID",
        // will need to removed if BA team asks for bring hard-coded for demo
        idValue: "1106972886",
        // idValue: claimsInfo?.ownerId,
        channel: "NonMotorClaim",
        userId: "WALAA_ONLINE",
      };
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateIban`,
        payload
      );
      if (
        response?.message.toUpperCase() === "SUCCESS" &&
        response?.data.result === "MATCH"
      ) {
        setLoaderIconhandler(false);
        setErrorIconhandler(false);
        setSuccessIconhandler(true);
        changeHandler("iBAN", true, iBAN);
      } else if (
        response?.message.toUpperCase() === "ERROR" ||
        response?.message === "INTERNAL_SERVER_ERROR"
      ) {
        changeHandler("iBAN", false);
        setLoaderIconhandler(false);
        setErrorIconhandler(true);
        setSuccessIconhandler(false);
        toast.error(response?.data?.result, {
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
        changeHandler("iBAN", false);
        setLoaderIconhandler(false);
        setErrorIconhandler(true);
        setSuccessIconhandler(false);
        toast.error(response?.message, {
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
      }
    } catch (error) {
      changeHandler("iBAN", false);
      setLoaderIconhandler(false);
      setErrorIconhandler(true);
      setSuccessIconhandler(false);
    } finally {
      /* empty */
    }
  };

  //cms content

  const languageData = useContext(DataContext);

  return (
    <div className="px-4 mx-2" data-testid="registerclaimcontact-test">
      <Card className="right-card-register">
        {
          <React.Fragment>
            <hr className="vehicleseq-splitter align-self-stretch my-0" />

            <div className="header">
              <div className="header-content">
                <div className="content">
                  <div className="walaa-medium-500 policy-number">
                    {travelData?.bank_details}
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-self-stretch">
              <div>
                <div className="d-flex flex-row flex-wrap justify-content-between">
                  <div className="iban-textbox">
                    <div className="col walaa-regular-400">
                      <TypographyAndIcon
                        text={travelData?.iban_no}
                        required={true}
                      />
                    </div>
                    <div className="col pt-2">
                      <InputGroup onChange={(e) => updatedValue(e)}>
                        <Form.Control
                          disabled={showLoaderIcon}
                          placeholder={languageData?.placeholder_enter_iban_num}
                          aria-label="iban"
                          aria-describedby="basic-addon1"
                          className="register-input border-end-0"
                          name="IBan"
                        />
                        <InputGroup.Text
                          id="basic-addon1"
                          className="register-input border-start-0"
                        >
                          {showSuccessIcon && (
                            <span className="m-2">
                              <CheckCircleIcon sx={{ color: "green" }} />
                            </span>
                          )}
                          {showErrorIcon && (
                            <span className="m-2">
                              <CancelIcon sx={{ color: "red" }} />
                            </span>
                          )}
                          {showLoaderIcon && (
                            <span className="m-2">
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  {languageData?.loading}
                                </span>
                              </Spinner>
                            </span>
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Text className="validationText">
                        {compensateError.iBan}
                      </Form.Text>
                    </div>
                  </div>

                  {isValidIban && (
                    <>
                      <div className="iban-textbox">
                        <div className="col walaa-regular-400">
                          <TypographyAndIcon
                            text={travelData?.enter_iban_no}
                            required={true}
                          />
                        </div>
                        <div>
                          <ThemeTextbox
                            type={"text"}
                            name="reEnteredIban"
                            placeholder={
                              languageData?.placeholder_enter_iban_num
                            }
                            value={reEnteredIban}
                            onChangehandler={(e) =>
                              setReEnteredIban(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="iban-textbox">
                        <div className="col walaa-regular-400">
                          <TypographyAndIcon
                            text={travelData?.bank_name}
                            required={true}
                          />
                        </div>
                        <div>
                          <ThemeTextbox
                            type={"text"}
                            name="bankName"
                            placeholder={languageData?.enter_bank_name}
                            value={bankName}
                            onChangehandler={(e) => setBankName(e.target.value)}
                          />
                        </div>
                      </div>{" "}
                    </>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </Card>

      {isValidIban && (
        <Iban
          fileData={fileData}
          setFileData={setFileData}
          languageData={languageData || {}}
        />
      )}
    </div>
  );
};

export default ContactDetails;
