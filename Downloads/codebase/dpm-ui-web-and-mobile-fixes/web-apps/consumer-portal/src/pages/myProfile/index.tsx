import React, { useEffect } from 'react';
import "./index.scss";
import { useSelector, useDispatch } from 'react-redux';
import checkCircleIcon from "assets/CommonSVG/checkCircle.svg";
import { Bounce } from "react-toastify";
import {
    RootState,
    capitalizeNameFirstLetter,
    useApiCall,
    slices
} from "@dpm/shared-module";
import { formatDateMMYYYY } from 'utils/formatDate';
import { PersonalIcon, ArrowRight, UserProfileFemale, UserProfileMale, EditIcon, AddressLoading,EditWith500 } from 'assets/ProfileDetails';
import ProfileEditDialog from './ProfileEditDialog';
import { OTPWrapper } from 'components/OTPValidation/OtpWrapper';
import { LoaderOverlay } from "components/OTPValidation";
import { myProfile } from 'constant';
import { showNotification } from 'components/ThemeAlertNotification/ThemeAlertNotification';
import { createMaskString } from 'utils/MaskStringFormat';
import ProfileEditBankDialog from './ProfileEditBankDialog';

 interface BankType {
  bankName?: string;
  ibanNo: string;
}
export interface updatedBankDetailsProps{
    nationalID: string;
    primaryAccount: BankType;
}


 interface BankType {
  bankName?: string;
  ibanNo: string;
}
export interface updatedBankDetailsProps{
    nationalID: string;
    primaryAccount: BankType;
}


const MyProfile = () => {
    const dispatch = useDispatch();
    const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
    const {auth} = useSelector((state: RootState) => state);
    const { setAuth} = slices.auth;
    const userInfo=auth?.userInfo;
    
    const [callGenerateOtp, setCallGenerateOtp] = React.useState<boolean>(true);
    const [modal, setModal] = React.useState<boolean>(false);
    const [showOtp, setShowOtp] = React.useState<boolean>(false);
    const [contact, setContact] = React.useState<string>();
    const [address, setAddress] = React.useState<string>('');
    const [addLoading, setAddLoading] = React.useState<boolean>();
    const [updatedDetails, setUpdatedDetails] = React.useState<{label:string,value:string}>(null);
    const [updatedBankDetails, setUpdatedBankDetails] = React.useState<updatedBankDetailsProps>(null);

    const { makeApiCall: makeApiCallUserProfile, 
        data:userProfileData, 
        error: userProfileError, 
        isLoading:userProfileLoading 
    }  
    = useApiCall(13, `/GetUserProfile`, "post");
    const { makeApiCall: makeUpdateBankDetails, 
        data:bankUpdateData, 
        errors: bankUpdateError, 
        isLoading:bankUpdateLoading 
    }  
    = useApiCall(5, `UpdateCustomerInfo`, "post");

    const { makeApiCall, isAddressLoading, errors, data : updateAddress } = useApiCall(16, `UpdateNationalAddress/${userProfileData?.userId}`, "get");
    
    const fetchUserProfile=async()=>{
        const userDetails = await sessionStorage.getItem("userDetails");
        if(userDetails){
            const userProfileDetails = await JSON.parse(userDetails).userProfileData;
            setAuth({...auth,userInfo:userProfileDetails});
            setAddress(userProfileDetails?.address);
            makeApiCallUserProfile({userId: userProfileDetails?.userId, mobileNumber:userProfileDetails?.mobileNumber});
        }
    }
    
    useEffect(() => {
    fetchUserProfile();
    },[]);
    
    useEffect(() => {
       
        if(updateAddress) {
            setAddress(updateAddress.updatedAddress);
        }else if(errors) {
            showNotification({
                title: "Errror",
                description: errors?.messages?.message_en,
                type: 'error',
                icon: checkCircleIcon,
                duration: 5000,
                position: 'top-center',
                transition: Bounce,
              });
            
        }
        setAddLoading(isAddressLoading)
    }, [isAddressLoading, errors, updateAddress]);

    const { 
        makeApiCall: makeApiUpdateContact, 
        isLoading: loadingUpdatedContact, 
        errors:errorUpdatedContact, 
        data : dataUpdatedContact
    } = useApiCall(13, "/ChangeMobileNumber", "post");        

    const handleModal = (type: string) => () => {
        setModal(true);
        setContact(type);
    }
    const handleAddressSync = () => () => {
        setAddLoading(true)
        makeApiCall();
    }

    useEffect(()=>{
        if( userProfileData){
            sessionStorage.setItem("userDetails", JSON.stringify({userProfileData}));
            dispatch(setAuth({...auth,userInfo:userProfileData}));
        }
        
    },[userProfileData])

    const handleSuccessValidation = () => {
        if(contact === myProfile.email && updatedDetails){               
            const payload ={
                updatedEmailId : updatedDetails?.value,
                userId: userProfileData?.userId
            } 
            makeApiUpdateContact(payload);       
        }else if(contact === myProfile.mobile && updatedDetails){
            const payload ={
                updatedMobileNo : updatedDetails?.value,
                userId: userProfileData?.userId
            }
            makeApiUpdateContact(payload);    
        }
        else if(contact===myProfile.bank && updatedBankDetails){
           makeUpdateBankDetails(updatedBankDetails);    
        }
            
    }

    useEffect(()=>{
        if(bankUpdateError?.messages?.message_en){
            showNotification({
                title: "Errror",
                description: bankUpdateError?.messages?.message_en,
                type: 'error',
                icon: checkCircleIcon,
                duration: 5000,
                position: 'top-center',
                transition: Bounce,
              });

        }
        else if(bankUpdateData && !bankUpdateLoading){
            showNotification({
                title: "Success",
                description: bankUpdateData?.message,
                type: 'success',
                icon: checkCircleIcon,
                duration: 5000,
                position: 'top-center',
                transition: Bounce,
                contentClassName: 'success-content',
                titleClassName: 'success-title',
                descriptionClassName: 'success-description',
              });
            makeApiCallUserProfile({userId: userInfo?.userId, mobileNo:userInfo?.mobileNumber}); 
        }
       
        setUpdatedBankDetails(null)
        setContact(null);
        setModal(false);
    },[bankUpdateData,bankUpdateError])

    useEffect(() => {
        if(errorUpdatedContact) {   
            showNotification({
                title: "Success",
                description: errorUpdatedContact?.messages?.message_en,
                type: 'success',
                icon: checkCircleIcon,
                duration: 5000,
                position: 'top-center',
                transition: Bounce,
                contentClassName: 'success-content',
                titleClassName: 'success-title',
                descriptionClassName: 'success-description',
              }); 
            setUpdatedDetails(null)
            setContact(null);
            setModal(false);      
        } else if(dataUpdatedContact) {
            const message = contact ===  myProfile.mobile ? languageData?.mobile_update_success_message : languageData?.email_update_success_message;  
    
            const [title, description] = typeof message === 'string' && message.includes('<br>') 
                ? message.split('<br>') 
                : ['', ''];

            showNotification({
                title: title,
                description: description,
                type: 'success',
                icon: checkCircleIcon,
                duration: false,
                position: 'top-center',
                transition: Bounce,
                contentClassName: 'success-content',
                titleClassName: 'success-title',
                descriptionClassName: 'success-description'
              });
            const mobileNumber = contact === myProfile.mobile ? updatedDetails?.value : userProfileData?.mobileNumber;
            makeApiCallUserProfile({userId: userInfo?.userId, mobileNo:mobileNumber}); 
            setUpdatedDetails(null)
            setContact(null);
            setModal(false);
        }
    }, [errorUpdatedContact,dataUpdatedContact]); 

    useEffect(() => {

        if(updatedDetails || updatedBankDetails){
            setModal(false)
            setShowOtp(true);
            setCallGenerateOtp(true);
        }
     
    }, [updatedDetails,updatedBankDetails])

    const getPayload=()=>{
        switch (contact) {
            case myProfile.email:
               return userProfileData?.email? { "emailID" : userProfileData?.email}    : { "mobileNumber" : userProfileData?.mobileNumber}
            case myProfile.mobile:
               return { "mobileNumber" : userProfileData?.mobileNumber}    
            case myProfile.bank:
                return { "mobileNumber" : userProfileData?.mobileNumber}
            default:
                return null;
        }

    }
    const onUpdateBankDetails=(bankDetails:updatedBankDetailsProps)=>{
        if(bankDetails){
            setUpdatedBankDetails(bankDetails)
        }

    }

    return (
        <div className="my-profile-details" data-testid="my-profile-details">
            {userProfileLoading && <LoaderOverlay />}
            {modal && (contact==='mobile' || contact==="email") && (
                <ProfileEditDialog
                    showDialog={modal}
                    updateContact={contact}
                    setUpdatedDetails={setUpdatedDetails}
                    setShowDialog={setModal}
                />
            )}
             {modal && contact==='bank' && (
                <ProfileEditBankDialog
                    showDialog={modal}
                    updateBankDetails={onUpdateBankDetails}
                    setShowDialog={setModal}
                />
            )}
            {showOtp && getPayload() && (
                <OTPWrapper 
                    generateOtpUrl={"GenerateOtp"} 
                    validateOtpUrl={"ValidateOtp"} 
                    languageData={{
                    enter_otp_code: languageData?.enter_otp_code,
                    your_otp_will_expire: languageData?.your_otp_will_expire,
                    confirm_otp: languageData?.otp_verification,
                    resend_otp: languageData?.resend_otp,
                    please_enter_the_mobile_verification_code: languageData?.please_enter_the_mobile_verification_code,
                    please_enter_the_email_verification_code: languageData?.please_enter_the_email_verification_code
                    }}
                    handleSuccessValidation={handleSuccessValidation} 
                    payload={getPayload()}
                    callGenerateOtp={callGenerateOtp}
                    module = {myProfile.profile}
                    setCallGenerateOtp={setCallGenerateOtp}
                />
            )} 
            <div className="my-profile-container" data-testid="my-profile-container">
                <div className="leftPanel">
                    <div className='personal-navlink'>
                        <div className='navlink'>
                            <img src={PersonalIcon} alt="profile-icon" />
                            <span>{languageData?.personal_details}</span>
                        </div>
                        <div className='arrow-right'>
                            <img className="arrow-right" src={ArrowRight} alt="profile-arrow"></img>
                        </div>
                        
                    </div>
                </div>
                <div className="rightPanel">
                    <div className='header-content'>
                        {languageData?.personal_details}
                    </div>
                    <div className='user-content'>
                        <div className='profile-image'>
                            <img src={userProfileData?.gender === "M" ? UserProfileMale : UserProfileFemale} alt="profile-icon" />
                        </div>
                        <div className='user-details'>
                            <div className='user-name'>{capitalizeNameFirstLetter(userProfileData?.name ?? "")}</div>
                            <div className='user-national-id'>
                                <span className='label'>{languageData?.national_id}: </span>
                                <span className='value'>{userProfileData?.userId && createMaskString({stringToBeMask:userProfileData?.userId,start:0,end:7})}</span>
                            </div>
                            <div className='user-dob'>
                                <span className='label'>{languageData?.dob} </span>
                                <span className='value'>{userProfileData?.ownerDobG && formatDateMMYYYY(userProfileData?.ownerDobG)}</span>
                            </div>
                        </div>
                    </div>  
                    <div className='contact-details-header'>
                        <div className='contact-title'>
                            <div className='contact-details'>
                                {languageData?.contact_details}
                            </div>
                            <div className='last-update'>
                                {languageData?.last_updated_on} <span>{userProfileData?.lastUpdatedOn}</span>
                            </div>
                        </div>
                    </div>
                    <div className='contact-details-content'>
                        <div className='contact-content'>
                            <div className='contact-mobile'>
                                <div className='mobile-number'>
                                    <span className='label'>{languageData?.mobile_no}</span>
                                    <span className='value'>{userProfileData?.mobileNumber}</span>
                                </div>
                                <div data-testid="edit-mobileid" className='mobile-edit' onClick={handleModal(myProfile.mobile)} role="button" tabIndex={0} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleModal(myProfile.mobile);
                                    }
                                }}>
                                    <img src={EditIcon} alt="edit-mobile"/>
                                    <span>{languageData?.edit}</span>    
                                </div>
                            </div>
                            <div className='contact-email'>
                                <div className='email'>
                                    <span className='label'>{languageData?.email_id}</span>
                                    <span className='value'>{userProfileData?.email}</span>
                                </div>
                                <div data-testid="edit-emailid" className='email-edit' onClick={handleModal(myProfile.email)} role="button" tabIndex={0} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleModal(myProfile.email);
                                    }
                                }}>
                                    <img src={EditWith500} alt="edit-email"/>
                                    <span>{languageData?.edit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='address-header'>
                        <div className='address-title'>
                            <div className='address'>
                                {languageData?.address}
                            </div>
                            <div className='last-update'>
                            {languageData?.last_updated_on} <span>{userProfileData?.lastUpdatedOn}</span>
                            </div>
                        </div>
                    </div>
                    <div className='address-details-content'>
                        {!addLoading && 
                            <div className='address-details'>
                                <span className='label'>{languageData?.address}</span>
                                <span className='value'>{address}</span>
                            </div>
                        }
                        {addLoading && 
                            <div className='address-loading' >
                                <img src={AddressLoading} alt='Address Loading Image' />
                            </div>
                        }
                        
                        <button className={
                            !addLoading ? 'sync-button' : 'sync-button disabled' 
                        } onClick={handleAddressSync()}>
                            <span>{languageData?.sync }</span>    
                        </button>
                    </div>
                    <div className='contact-details-header'>
                        <div className='contact-title'>
                            <div className='contact-details'>
                                {languageData?.bank_details}
                            </div>
                            <div className='last-update'>
                                {languageData?.last_updated_on} <span>{userProfileData?.lastUpdatedOn}</span>
                            </div>
                        </div>
                    </div>
                    <div className='contact-details-content'>
                        <div className='contact-content'>
                            <div className='contact-bank'>
                                <div className='bank-number'>
                                    <span className='label'>{languageData?.iban_no}</span>
                                    <span className='value'>{userProfileData?.ibanNo}</span>
                                </div>
                                <div className='bank-number'>
                                    <span className='label'>{languageData?.bank_name}</span>
                                    <span className='value'>{userProfileData?.bankName}</span>
                                </div>
                                <div data-testid="edit-bankid" className='bank-edit' onClick={handleModal('bank')} role="button" tabIndex={0} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleModal('bank');
                                    }
                                }}>
                                    <img color='red' src={EditWith500} alt="edit-bank"/>
                                    <span>{languageData?.edit}</span>    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
        
    );
}

export default MyProfile;