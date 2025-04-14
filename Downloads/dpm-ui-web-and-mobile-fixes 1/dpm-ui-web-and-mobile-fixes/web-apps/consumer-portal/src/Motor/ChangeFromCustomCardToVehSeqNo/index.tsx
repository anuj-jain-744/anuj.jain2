import React, { useEffect, useState } from "react";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import CustomCardLeft from "./CustomCardLeft";
import CustomCardRight from "./CustomCardRight";
import "./ChangeFromCustomCardToVehSeqNo.scss";
import SuccessVehSeqNo from "./SuccessVehSeqNo";
import { DataContext } from "../../DataContext";
import { callAPI } from "@dpm/shared-module";
import data from "./Mock/data.json";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const { VITE_BACKEND_ENDORSEMENT_BASE_URL, VITE_CONTENT_BASE_URI } = import.meta
  .env;

const ChangeFromCustomCardToVehSeqNo = () => {
  //validate sequence button enable/disable state
  const [isValidateSeqBtnDisable, setValidateSeqBtnDisable] =
    useState<boolean>(true);
  //customcard number value
  const [customCardValue, setcustomCardValue] = useState<null | string>(null);
  //validateseq number value
  const [validateSeqValue, setValidateSeqValue] = useState<null | string>(null);
  //validate sequence response success enable success page
  const [isValidateSeqSuccess, setValidateSeqSuccess] = useState(false);
  //validate sequence response Data success page
  const [validateSuccessData, setvalidateSuccessData] = useState<null | Object>(
    null
  );
  // cms content state
  const [languageData, setLanguageData] = useState();

  //change handler return accept fn
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target;
    setValidateSeqBtnDisable(value?.length > 0 ? false : true);
    setValidateSeqValue(value?.length > 0 ? value : null);
  };

  //final data receive handler accept fn
  const fullDataHandler = (customID: string) => {
    setcustomCardValue(customID);
    {
      (customID !== null || customID !== undefined) &&
        submitCustomCardtoVehSeq(customID);
    }
  };

  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response?.config[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //data destructuring for Right content
  const { policyNumber, effectiveDate, expiryDate, idv } =
    data?.data?.policyBasic;

  // Submit Custom Card to Vehicle Sequence No Data
  const submitCustomCardtoVehSeq = async (customID: string) => {
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_ENDORSEMENT_BASE_URL + `/Motor/Endorsement/V1/DirectIssue`,
        {
          createdBy: "10327",
          apiSource: "Portal",
          financialEndoInd: "N",
          sign: -1,
          endoType: "11",
          endoSubType: "114",
          interestUpdateReason: "2",
          mainBenefitCal: "N",
          smeProduct: false,
          policyNo: policyNumber,
          loginUser: {
            userId: "10327",
            isBrokerUser: "N",
          },
          endoRequestReferenceNo: "EECRN-24-012",
          endoEffectiveDate: "2024-09-10", //
          vehicles: [
            {
              sequenceNo: validateSeqValue,
              customId: customID,
              benefits: [],
              vehicleInfoCorrection: {
                customID: customID,
                sequenceNo: validateSeqValue,
              },
            },
          ],
          docFiles: [],
        }
      );
      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.data?.result?.toUpperCase() === "MATCH"
      ) {
        setValidateSeqSuccess(true);
        setvalidateSuccessData(response?.data[0]);
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
        "Change from Custom Card to Vehicle Sequence Submit failed with error",
        error
      );
      toast.error(
        "Change from Custom Card to Vehicle Sequence Submit failed with error",
        {
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
        }
      );
    } finally {
    }
  };

  return (
    <div
      className="changecustvehcontainer"
      data-testid="changefromcustomcardtovehseq-test"
    >
      <div className="register-new-claim-comprehensive">
        <DataContext.Provider value={languageData}>
          <div className="container-fluid">
            {isValidateSeqSuccess ? (
              <SuccessVehSeqNo
                policyNumber={policyNumber}
                customCardValue={customCardValue}
                validateSeqValue={validateSeqValue}
                effectiveDate={effectiveDate}
              />
            ) : (
              <React.Fragment>
                <div className="register-new-claim-container-main p-0">
                  {/* left content */}
                  <CustomCardLeft
                    isValidateSeqBtnDisable={isValidateSeqBtnDisable}
                    changeHandler={onChangeHandler}
                    fullDataHandler={fullDataHandler}
                    customCardData={data?.data?.policyLob[0]?.policyRisk}
                  />
                  {/* right content */}
                  <CustomCardRight
                    policyNumber={policyNumber}
                    effectiveDate={effectiveDate}
                    expiryDate={expiryDate}
                    idv={idv}
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
                        />
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </DataContext.Provider>
      </div>
    </div>
  );
};

export default ChangeFromCustomCardToVehSeqNo;
