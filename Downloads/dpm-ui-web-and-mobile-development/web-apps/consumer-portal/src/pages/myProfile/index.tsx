import React, { useEffect } from 'react';
import "./index.scss";
import { useSelector, useDispatch } from 'react-redux';
import checkCircleIcon from "assets/CommonSVG/checkCircle.svg";
import { Bounce, toast } from "react-toastify";
import {
    RootState,
    capitalizeNameFirstLetter,
    setProfileData, 
    setProfileDataLoading, 
    setProfileDataError,
    useApiCall,
    slices
} from "@dpm/shared-module";
import { formatDateMMYYYY } from 'utils/formatDate';
import { PersonalIcon, ArrowRight, UserIcon, EditIcon, AddressLoading,EditWith500 } from 'assets/ProfileDetails';
import ProfileEditDialog from 'pages/myProfile/ProfileEditDialog';
import { OTPWrapper } from 'components/OTPValidation/OtpWrapper';
import { LoaderOverlay } from "components/OTPValidation";
import { myProfile } from 'constant';
import { showNotification } from 'components/ThemeAlertNotification/ThemeAlertNotification';
import { createMaskString } from 'utils/MaskStringFormat';
import ProfileEditBankDialog from './ProfileEditBankDialog';


const MyProfile = () => {
    const dispatch = useDispatch();
    const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
    const myProfileData = useSelector((state: RootState) => state.profileData);
    const {auth} = useSelector((state: RootState) => state);
    const { setAuth} = slices.auth;
    
    const [callGenerateOtp, setCallGenerateOtp] = React.useState<boolean>(true);
    const [modal, setModal] = React.useState<boolean>(false);
    const [showOtp, setShowOtp] = React.useState<boolean>(false);
    const [generateOTPPayload, setGenerateOTPPayload] = React.useState<object>({});
    const [contact, setContact] = React.useState<string>();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [addLoading, setAddLoading] = React.useState<boolean>();
    const [address, setAddress] = React.useState<string>('');
    const { makeApiCall: makeApiCallUserProfile, 
        data:userProfileData, 
        error: userProfileError, 
        isLoading:userProfileLoading 
    }  
    = useApiCall(13, `/GetUserProfile`, "post");
    
    const [isUserAuthenticated, setUserAuthenticated] = React.useState<boolean>(false);
    const [userData, setUserData] = React.useState<any>(null);
    useEffect(() => {
    const userDetails = sessionStorage.getItem("userDetails");
        if(userDetails){
            setUserAuthenticated(true);
            const userProfileDetails = JSON.parse(userDetails).userProfileData;
            setUserData(userProfileDetails);
            makeApiCallUserProfile({userId: userProfileDetails?.userId, mobileNumber:userProfileDetails?.mobileNumber});
        }
    },[isUserAuthenticated]);

    useEffect(() => {
        dispatch(setProfileDataLoading(userProfileLoading));
        setLoading(userProfileLoading);
        if (userProfileData) {
            dispatch(setProfileData(userProfileData));
            setAddress(userProfileData.address);
        }    
        if (userProfileError) {
            dispatch(setProfileDataError((userProfileError as Error).message || 'An error occurred'));
            toast.error((userProfileError as Error).message);
        }
    }, [userProfileData, userProfileError, userProfileLoading ]);

    const { makeApiCall, isLoading, errors, data : updateAddress } = useApiCall(16, `UpdateNationalAddress/${userProfileData?.userId}`, "get");
    
    useEffect(() => {
        if(updateAddress) {
            setAddress(updateAddress.updatedAddress);
        }else if(errors) {
            toast.error(errors?.messages?.message_en);
        }
        setAddLoading(isLoading);    
    }, [isLoading, errors, updateAddress]);

    const { 
        makeApiCall: makeApiUpdateContact, 
        isLoading: loadingUpdatedContact, 
        errors:errorUpdatedContact, 
        data : dataUpdatedContact
    } = useApiCall(13, "/ChangeMobileNumber", "post");        

    const handleModal = (type: string) => () => {
        setModal(true);
        setContact(type);
        if(contact === myProfile.email){               
            setGenerateOTPPayload ({
                "emailID" : myProfileData?.updateContactData?.value
            });    
        }else if(contact === myProfile.mobile){
            setGenerateOTPPayload ({
                "mobileNumber" : myProfileData?.updateContactData?.value,
            });
        }
    }

    const handleAddressSync = () => () => {
        setAddLoading(true);
        makeApiCall();
    }

    useEffect(()=>{
        if(dataUpdatedContact && !loadingUpdatedContact && userProfileData){
            sessionStorage.setItem("userDetails", JSON.stringify({userProfileData}));
            dispatch(setAuth({...auth,userInfo:userProfileData}));
        }
        
    },[loadingUpdatedContact,dataUpdatedContact, userProfileData])

    const handleSuccessValidation = () => {
        let payload = {}
        if(contact === myProfile.email){               
            payload ={
                "updatedEmailId" : myProfileData?.updateContactData?.value,
                "userId": myProfileData?.profileData.userId
            }    
        }else if(contact === myProfile.mobile){
            payload ={
                "updatedMobileNo" : myProfileData?.updateContactData?.value,
                "userId": myProfileData?.profileData.userId
            }
        }
        makeApiUpdateContact(payload);        
    }

    useEffect(() => {
        if(errors) {   
            toast.error(errors?.messages?.message_en);         
        } else if(dataUpdatedContact) {
            const message = contact ===  myProfile.mobile ? languageData?.mobile_update_success_message : languageData?.email_update_success_message;  
    
            const [title, description] = message.split('<br>');

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
            const mobileNumber = contact === myProfile.mobile ? myProfileData?.updateContactData?.value : userData?.mobileNumber;
            makeApiCallUserProfile({userId: userData?.userId, mobileNo:mobileNumber}); 
        }
    }, [loadingUpdatedContact, errorUpdatedContact, dataUpdatedContact]);

    return (
        <div className="my-profile-details" data-testid="my-profile-details">
            {loading && <LoaderOverlay />}
            {modal && (contact==='mobile' || contact==="email") && (
                <ProfileEditDialog
                    showDialog={modal}
                    setShowDialog={setModal}
                    updateContact={contact}
                    showOtp = {setShowOtp}
                    setCallGenerateOtp = {setCallGenerateOtp}
                />
            )}
             {modal && contact==='bank' && (
                <ProfileEditBankDialog
                    showDialog={modal}
                    setShowDialog={setModal}
                    updateContact={contact}
                    showOtp = {setShowOtp}
                    setCallGenerateOtp = {setCallGenerateOtp}
                />
            )}
            {showOtp && (
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
                    payload={generateOTPPayload}
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
                            <img src={UserIcon} alt="profile-icon" />
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
                                <div className='mobile-edit' onClick={handleModal('mobile')}>
                                    <img src={EditIcon} alt="edit-mobile"/>
                                    <span>{languageData?.edit}</span>    
                                </div>
                            </div>
                            <div className='contact-email'>
                                <div className='email'>
                                    <span className='label'>{languageData?.email_id}</span>
                                    <span className='value'>{userProfileData?.email}</span>
                                </div>
                                <div className='email-edit' onClick={handleModal('email')}>
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
                                    <span className='value'></span>
                                </div>
                                <div className='bank-number'>
                                    <span className='label'>{languageData?.bank_name}</span>
                                    <span className='value'></span>
                                </div>
                                <div className='bank-edit' onClick={handleModal('bank')}>
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