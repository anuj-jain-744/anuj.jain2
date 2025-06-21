import { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  RootState,
  validateIBAN,
} from "@dpm/shared-module";
import IbanInputField from "components/IbanInputField";
import {updatedBankDetailsProps} from './index'

interface ProfileEditBankDialogType {
   showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  updateBankDetails?: (value:updatedBankDetailsProps | undefined)=>void
}

const ProfileEditBankDialog: React.FC<ProfileEditBankDialogType> = ({
 showDialog,
  setShowDialog,
  updateBankDetails
}) => {
  const { languageData: dashboard } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );
   const { userInfo } = useSelector(
    (state: RootState) => state.auth
  );
  const [newIbanValue, setNewIbanValue] = useState<string>("");
  const [newBankValue, setNewBankValue] = useState<{bankName:string}>({bankName:""});
  const [disableButton, setDisableButton] = useState<boolean>(true); 

  const handleClose = () => setShowDialog(false);

  const handleUpdate = () => {
    const bankDetails={
      nationalID: userInfo?.userId,
      primaryAccount: {bankName: newBankValue?.bankName, ibanNo:newIbanValue}
  }
    updateBankDetails(bankDetails)
    setShowDialog(false);
  };

  const getBankDetails=(bankDetails: {bankName: string},iban:string)=>{
    setNewBankValue(bankDetails)
    setNewIbanValue(iban)
  }
  const checkDisabled=(value:boolean)=>{
    setDisableButton(value)
  }

  return (
    <div className="profileEditing">
      <Modal
        show={showDialog}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={"profile-edit-modal-bank"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="walaa-medium-500">{dashboard?.update_bank_details}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column mobile-container">
            <div className="existing-bank-label">
              <div className="label-content">
                <span className="label">{dashboard?.existing_iban_no}</span>
                <span className="value">{userInfo?.ibanNo}</span>
              </div>
              <div className="label-content">
                <span className="label">{dashboard?.existing_bank_name}</span>
                <span className="value">{userInfo?.bankName}</span>
              </div>
            </div>
            <div className="exisiting-mobile-value">
              <IbanInputField languageData={dashboard} userId={userInfo?.userId} getBankDetails={getBankDetails} checkDisabled={checkDisabled}/>
             {validateIBAN(newIbanValue) && <>
               <span className="label">{dashboard?.bank_name}</span>
              <div>{newBankValue?.bankName?? ""}</div>
              </>}
             
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
            className={`profile-edit-action ${
              disableButton ? "disabled" : ""
            } walaa-medium-500`}
            onClick={handleUpdate}
            disabled={disableButton}
          >
            {dashboard?.update}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileEditBankDialog;
