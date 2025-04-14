import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useApiCall, setUpdateContactData, checkPhoneNumberStarts, isValidEmail } from '@dpm/shared-module';
import { myProfile } from "constant";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { LoaderOverlay } from "components/OTPValidation";


interface ProfileEditDialogProps {
    showDialog: boolean;
    setShowDialog: (show: boolean) => void; 
    showOtp : (val:boolean) =>void;
    setCallGenerateOtp: (val:boolean) =>void;
    updateContact: string | undefined; 
    
}

function ProfileEditDialog(props: Readonly<ProfileEditDialogProps>) {
    const dispatch = useDispatch()
    const {languageData:dashboard} = useSelector((state: RootState) => state.dashbaordLanguageData);
    const myProfileData = useSelector((state: RootState) => state.profileData);
    const [title, setTitle] = useState<string>('');
    const [exisitngLabel, setExisitngLabel] = useState<string>('');
    const [label, setLabel] = useState<string>('')
    const [exisitingValue, setExisitingValue] = useState<string>('');
    const [newValue, setNewValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(()=>{
       if(props?.updateContact === myProfile?.email){
        setTitle(dashboard?.update_email_id);
        setExisitngLabel(dashboard?.existing_email_id)
        setExisitingValue(myProfileData?.profileData?.email)
        setLabel(dashboard?.new_email_id)
       }else if(props?.updateContact === myProfile?.mobile){
        setTitle(dashboard?.update_mobile_number);
        setExisitngLabel(dashboard?.existing_mobile_no)
        setExisitingValue(myProfileData?.profileData?.mobileNumber)
        setLabel(dashboard?.new_mobile_no)
       }

    },[props?.updateContact])

    const handleClose = () => props?.setShowDialog(false);

    const handleUpdate = () =>{
        setLoading(true);
        props?.setShowDialog(false);
        props?.showOtp(true);
        props?.setCallGenerateOtp(true);
        let label = {label:props?.updateContact, value: newValue}
        dispatch(setUpdateContactData(label))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setNewValue(value);
        validateInput(value);
    }

    const validateInput = (value:string |number)=>{
        setErrorMessage("");
        if(props?.updateContact === myProfile?.email){
            if (!isValidEmail(value)) {
                setErrorMessage(dashboard?.please_provide_valid_email_id);
                setDisableButton(true);
            }else{
                setDisableButton(false);
            }
        }else if(props?.updateContact === myProfile?.mobile){
            if (!checkPhoneNumberStarts(value)) {
                setErrorMessage(dashboard?.please_provide_valid_mobile_number);
                setDisableButton(true);
            }else{
                setDisableButton(false);
            }
        }
    }


    return (
        <div className="profileEditing">
            {loading && <LoaderOverlay />}
            <Modal
                show={props?.showDialog}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className="profile-edit-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="walaa-medium-500">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column mobile-container">
                        <div className='exisiting-mobile-label'>
                            <span className='label'>{exisitngLabel}</span>
                            <span className='value'>{exisitingValue}</span>
                        </div>
                        <div className='exisiting-mobile-value'>
                            <span className='label'>{label}</span>
                            <ThemeTextbox
                                name="updateContact"
                                onChangehandler={handleInputChange}
                                value={newValue}
                                onBlurHandler = {validateInput}
                                errorMessage = {errorMessage}
                                classes = "updateContact"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="profile-edit-cancel walaa-medium-500"
                        onClick={handleClose}
                    >
                        {dashboard?.cancel}
                    </Button>
                    <Button
                        className="profile-edit-action walaa-medium-500"
                        onClick={handleUpdate}
                        disabled={disableButton}
                    >
                        {dashboard?.update}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProfileEditDialog;
