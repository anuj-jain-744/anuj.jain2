import React, { useState,useEffect } from "react";
import { IconsSet } from "utils/icons";
import ThemeButton from "components/ThemeButton/ThemeButton";
import closeIcon from 'assets/AlertIcon/closeIcon.svg';
import alertIcon from 'assets/AlertIcon/alertIcon.svg';
import closeAlertIcon from 'assets/AlertIcon/closeAlertIcon.svg';
import { useSelector,useDispatch } from "react-redux";
import { AddEmailPopup } from "components/AddEmailPopup/EmailPopup";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { showNotification } from "components/ThemeAlertNotification/ThemeAlertNotification";
import checkCircleIcon from "assets/CommonSVG/checkCircle.svg";
import { Bounce } from "react-toastify";
import "./AlertPopUp.scss";
import { RootState, useApiCall, slices } from "@dpm/shared-module";


interface AlertPopUpProps {
  varaint: string;
  title:string;
  message:string;
  buttonName:string;
  handleCloseAlert?: () => void; // Optional prop to handle close action
  navTo:string;
  onClose?: () => void; // Callback for close action
  onButtonClick?: () => void; // Callback for button click
  icon?: string; 
  showNavButton?: boolean; 
  className?: string; 
}

const AlertPopUp: React.FC<AlertPopUpProps> = (
  { 
    varaint = 'success',
    title = '',
    message = '',
    buttonName = '',
    handleCloseAlert = () => {},
    navTo,
    showNavButton = true,
    className = '',
    onClose,
    onButtonClick,
    icon,
  }
) => {
  const [closeComponent, setCloseComponent] = useState(false);
  const [newEmail, setNewEmail] = React.useState<string>("");
  const dispatch = useDispatch();
  const [callGenerateOtp, setCallGenerateOtp] = React.useState<boolean>(true);
  const [showOtp, setShowOtp] = React.useState<boolean>(false);
  const [openEmailPopup, setOpenEmailPopup] = useState(false);

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const auth = useSelector((state: RootState) => state.auth);
  const { setAuth} = slices.auth;
  const userInfo=auth?.userInfo;

  const { 
    makeApiCall: makeApiAddEmail, 
    isLoading: loadingEmailUpdate, 
    errors:errorEmailUpdate, 
    data : emailUpdateData
  } = useApiCall(13, "/ChangeMobileNumber", "post");   
  
  const { makeApiCall: makeApiCallUserProfile, 
    data:userProfileData, 
    error: userProfileError, 
    isLoading:userProfileLoading 
  }  
  = useApiCall(13, `/GetUserProfile`, "post");

  const closeAlert = () => {
    setCloseComponent(true)
  };
  const onAddEmail=(email:string)=>{
    setNewEmail(email)
    
 }
 const handleCloseAddEmailPopup = () => {
   setOpenEmailPopup(false)
 }
 const readyForAddEmail = () => {
   makeApiAddEmail({userId: userInfo?.userId, updatedEmailId:newEmail})
 }
 const fetchUserProfile=async()=>{
   const userDetails = await sessionStorage.getItem("userDetails");
   if(userDetails){
       const userProfileDetails = await JSON.parse(userDetails).userProfileData;
       makeApiCallUserProfile({userId: userProfileDetails?.userId, mobileNumber:userProfileDetails?.mobileNumber});
   }
}

const getAlertIcon = (className: string, variant: string): string => {
  if (className === "payment-comp-toast") {
    return alertIcon;
  }
  return IconsSet[variant];
};

const getCloseIcon = (className: string): string => {
  return className === "payment-comp-toast" ? closeAlertIcon : closeIcon;
};

 useEffect(() => { 
   if(newEmail !== "") {
     handleCloseAddEmailPopup()
     setShowOtp(true)
     setCallGenerateOtp(true);
   }
 },[newEmail]);
 useEffect(() => {
   if(emailUpdateData) {
      handleCloseAlert();
      showNotification({
       title: "Success",
       description: emailUpdateData?.response,
       type: 'success',
       icon: checkCircleIcon,
       duration: 3000,
       position: 'top-center',
       transition: Bounce,
       contentClassName: 'success-content',
       titleClassName: 'success-title',
       descriptionClassName: 'success-description'
     });
   }else if(errorEmailUpdate) {
    showNotification({
      title: "Error",
      description: errorEmailUpdate?.messages?.message_en      ,
      type: 'error',
      duration: 3000,
      position: 'top-center',
      transition: Bounce,
    });
      setShowOtp(false);
     setNewEmail("");
     setCallGenerateOtp(true);
     fetchUserProfile();
   }
 }, [emailUpdateData,errorEmailUpdate]);

 useEffect(() => {
   if(userProfileData) {
     sessionStorage.setItem("userDetails", JSON.stringify({userProfileData}));
     dispatch(setAuth({...auth,userInfo:userProfileData}));
   }
 },[userProfileData])


  return (
  <div  className={`alert-popup-container ${varaint} ${closeComponent ? 'd-none' : ''} ${className}`} role="alert">
    <div  className="alert-container">
      <div className="alert-left-panel">
        <div className="content-icon">
        <img src={getAlertIcon(className, varaint)} alt={varaint} />
        </div>
      </div>
      <div className="alert-right-panel">
      <div className="content-title walaa-medium-500">{title}</div>
      <div className="content-message walaa-regular-400">{message}</div>
        {showNavButton && (
        <div className="nav-button">
          <ThemeButton
            icon={true}
            variant={'addEmail'}
            iconName="ArrowRightRed"
            iconPosition="right"
            title={buttonName}
            classes="walaa-medium-500"
            onClickhandler={()=>setOpenEmailPopup(true)}
          />
        </div>
        )}
      </div>
      </div>
      <img
        src={getCloseIcon(className)}
        alt="Close"
        className={className === "payment-comp-toast" ? "close-email-box-icon-alert" : "close-email-box-icon"}
        onClick={closeAlert}
      />
      <AddEmailPopup languageData={languageData} showEmailModal={openEmailPopup} handleClose={handleCloseAddEmailPopup} handleAddEmail={onAddEmail}/>
        {showOtp && newEmail!=="" && (
                <OTPWrapper 
                    generateOtpUrl={"GenerateOtp"} 
                    validateOtpUrl={"ValidateOtp"} 
                    languageData={{
                    enter_otp_code: languageData?.enter_otp_code,
                    your_otp_will_expire: languageData?.your_otp_will_expire,
                    confirm_otp: languageData?.otp_verification,
                    resend_otp: languageData?.resend_otp,
                    }}
                    handleSuccessValidation={readyForAddEmail} 
                    payload={{emailID: newEmail}}
                    callGenerateOtp={callGenerateOtp}
                    setCallGenerateOtp={setCallGenerateOtp}
                />
            )}
    </div>
  );
};

export default AlertPopUp;