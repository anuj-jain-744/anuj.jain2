import React, { useEffect, useCallback, useState } from "react";
import "./index.scss";
import { Modal, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { KnowMoreWidget } from "../KnowMoreWidget";
import { VITE_CONTENT_BASE_URI, cmsAPIRoute } from "../../constant";
import { useCommonContext, useFetchData, useApiCall } from "@dpm/shared-module";
import { LoaderOverlay } from "components/Loader";
import { OTPWrapper } from "components/OTPComponent/OtpWrapper"
import { Stepper }  from "./Stepper";
import { Error } from "./Error";
import { ChangeMobileNumber } from "./ChangeMobileNumber";
import { Success } from "./Success";
import { ForgotPasswordAndSignUp } from "./ForgotPasswordAndSignUp";
import { SetPassword } from "./SetPassword";
import { LoginAndSingupProvider } from "./LoginandSignupContext";

interface LoginModalProps {
  showModalStatus: boolean;
  ShowLoginModalStatus: (status: boolean) => void;
  navigateTo?: (url: string) => void;
}

export const Login: React.FC<LoginModalProps> = ({
  showModalStatus,
  ShowLoginModalStatus,
  navigateTo
}) => {
  const { currentLanguage } = useCommonContext();
  const [state, setState] = useState({ loginData: {}, loading: true });
  const [currentStepValue, setCurrentStepValue] = useState<number>(0);
  const [languageData, setLanguageData] = useState<object>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [mobileNumber, setMobileNumber] = useState<number>();
  const [loginApiRefData, setLoginApiRefData] = useState<object>();
  const contextProvider = true;
  const search = location.search; 
  const queryparams = new URLSearchParams(search);
  const refNum = queryparams.get('rn');

  const {makeApiCall, data:configData} = useApiCall(1, "consumerportal-config", "post", "en");
  const {makeApiCall:loginApiCall, data:loginRefData, errors:loginRefError } = useApiCall(14, "/ValidateLoginUrl/"+refNum, "get");

  const makeConfigApicall = async () =>{
    await Promise.all([
      makeApiCall(),
      refNum && loginApiCall(),
    ]);
  }

  useEffect(()=>{
    makeConfigApicall();
  },[]);

  useEffect(() => {
    if(Array.isArray(configData?.config) && configData?.config.length > 0) {
      setLanguageData(configData?.config[0]);
    }
    if(loginRefData){
      setLoginApiRefData(loginRefData);
    }
    if(loginRefError){
      setCurrentStepValue(2);
      setErrorMessage (loginRefError?.messages?.message_en)
    }
  }, [configData, loginRefData, loginRefError]);

  const fetchAllData = useCallback(async () => {
    const [loginData] = await Promise.all([
      useFetchData(
        VITE_CONTENT_BASE_URI,
        cmsAPIRoute["login"],
        currentLanguage
      ),
    ]);
    setState({ loginData, loading: false });
  }, [currentLanguage]);

  const handleSuccessValidation = (val) => {
    switch (val){
      case 'login':
        ShowLoginModalStatus(false);
        navigateTo && navigateTo('dashboard');
        break;
      case 'changeMobileNum' :
        setCurrentStepValue(1);
        break;
      case 'changeMobileNumOTP':
        setCurrentStepValue(4);
        break;
      case 'forgotPassAndSignup':
        setCurrentStepValue(6);
        break;
      default:
        setCurrentStepValue(0);
        break;
    }   
  }

  useEffect(() => {
    if (showModalStatus) {
      fetchAllData();
    }
  }, [showModalStatus, fetchAllData]);

  const { loginData, loading } = state;

  if (loading) {
    return <LoaderOverlay />;
  }

  if (!loginData?.data) {
    return null;
  }  
  
  const getSteps = () => {
    switch (currentStepValue) {
      case 0:   
        return (
          <LoginForm
                data-testid="login-form"
                closeIcon={ShowLoginModalStatus}
                formElementsData={loginData}
                languageData = {languageData}
                setCurrentStepValue ={setCurrentStepValue}
                setMobileNumber = {setMobileNumber}
                contextProvider = {contextProvider}
                refData = {loginApiRefData}
                refNum = { refNum }
              />
        );
      case 1: 
      return(
        <OTPWrapper 
          generateOtpUrl={"/UserLogin/GenerateOtp"} 
          validateOtpUrl={"/UserLogin/ValidateOtp"} 
          languageData={languageData}
          handleSuccessValidation={handleSuccessValidation} 
          payload={{
            mobileNumber: mobileNumber
          }}
          callGenerateOtp = {false}
          closeIcon={ShowLoginModalStatus}
          showModal = {false}
          contextProvider = {contextProvider}
          setCurrentStepValue ={setCurrentStepValue}
        />
      )
      case 2:   
        return(
          <Error 
            setCurrentStepValue ={setCurrentStepValue}
            formElementsData={loginData}
            closeIcon={ShowLoginModalStatus}
            message= {errorMessage}
            refNum = { refNum }
          />
        )
      case 3:
        return(
          <ChangeMobileNumber
            languageData = {languageData}
            setCurrentStepValue ={setCurrentStepValue}
            closeIcon={ShowLoginModalStatus}
            contextProvider = {contextProvider}
            handleSuccessValidation= {handleSuccessValidation}
          />
        )
      case 4:   
        return(
          <Success 
            setCurrentStepValue ={setCurrentStepValue}
            formElementsData={loginData}
            closeIcon={ShowLoginModalStatus}
          />
        )
      case 5:   
        return(
          <ForgotPasswordAndSignUp 
            setCurrentStepValue ={setCurrentStepValue}
            closeIcon={ShowLoginModalStatus}
            formElementsData={loginData}
            languageData = {languageData}
          />
        )
      case 6:   
        return(
          <SetPassword 
            setCurrentStepValue ={setCurrentStepValue}
            closeIcon={ShowLoginModalStatus}
            formElementsData={loginData}
            languageData = {languageData}
          />
        )
      default:
        return <></>;
    }
  };


  return (
    <div data-testid="login-modal" className="login-modal">
      <Modal
        show={showModalStatus}
        onHide={() => ShowLoginModalStatus(false)}
        centered
        size="lg"
        backdrop="static"
        animation
        className="login-modal-popup"
      >
        <Container className="login-container">
          <div className="d-flex">
          <div className="left-content know-more-custom know-more-wrapper">
                <KnowMoreWidget
                  navigateTo={() => {}}
                  content={loginData?.data || {}}
                />
              </div>
            <div className="login-form-col">
              <LoginAndSingupProvider>
                <Stepper
                steps = {()=>getSteps()}
                />
               </LoginAndSingupProvider>
            </div>
          </div>
        </Container>
      </Modal>
    </div>
  );
};
