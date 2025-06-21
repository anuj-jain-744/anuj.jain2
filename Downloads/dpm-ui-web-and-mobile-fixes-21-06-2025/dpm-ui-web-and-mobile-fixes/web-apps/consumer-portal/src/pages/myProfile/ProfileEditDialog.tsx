import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  // useApiCall,
  // setUpdateContactData,
  checkPhoneNumberStarts,
  isValidEmail,
} from "@dpm/shared-module";
import { myProfile } from "constant";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { InfoIcon } from "assets/ProfileDetails";
import { createMaskString } from "utils/MaskStringFormat";

interface ProfileEditDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  updateContact: string | undefined;
  setUpdatedDetails?: ({label,value}:{label:string,value:string})=>void
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  showDialog,
  setShowDialog,
  updateContact,
  setUpdatedDetails
}) => {
  const { languageData: dashboard } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState<string>("");
  const [exisitngLabel, setExisitngLabel] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [exisitingValue, setExisitingValue] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    if (updateContact === myProfile?.email) {
      setTitle(dashboard?.update_email_id);
      setExisitngLabel(dashboard?.existing_email_id);
      setExisitingValue(userInfo?.email);
      setLabel(dashboard?.new_email_id);
    } else if (updateContact === myProfile?.mobile) {
      setTitle(dashboard?.update_mobile_number);
      setExisitngLabel(dashboard?.existing_mobile_no);
      setExisitingValue(userInfo?.mobileNumber);
      setLabel(dashboard?.new_mobile_no);
    }
  }, [updateContact]);

  const handleClose = () => setShowDialog(false);

  const handleUpdate = async() => {
    const label = { label: updateContact, value: newValue };
    setUpdatedDetails(label);
    
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewValue(value);
    validateInput(value);
  };

  const validateInput = (value: string | number) => {
    setErrorMessage("");
    if (updateContact === myProfile?.email) {
      if (!isValidEmail(value)) {
        setErrorMessage(dashboard?.please_provide_valid_email_id);
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    } else if (updateContact === myProfile?.mobile) {
      if (!checkPhoneNumberStarts(value)) {
        setErrorMessage(dashboard?.please_provide_valid_mobile_number);
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
  };
  const getMaskString = (str: string) => {
    if (updateContact === myProfile?.mobile) {
      return createMaskString({
        stringToBeMask: exisitingValue,
        start: 3,
        end: 5,
      });
    } else if (updateContact === myProfile?.email) {
      return createMaskString({
        stringToBeMask: exisitingValue,
        start: 2,
        end: str?.indexOf("@") - 1,
      });
    }

    return str;
  };

  return (
    <div className="profileEditing">
      <Modal
        show={showDialog}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={"profile-edit-modal"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="walaa-medium-500">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column mobile-container">
            <div className="exisiting-mobile-label">
              <span className="label">{exisitngLabel}</span>
              <span className="value">{getMaskString(exisitingValue)}</span>
            </div>
            <div className="exisiting-mobile-value">
              <span className="label">{label}</span>
              <ThemeTextbox
                name="updateContact"
                onChangehandler={handleInputChange}
                value={newValue}
                onBlurHandler={validateInput}
                errorMessage={errorMessage}
                classes="update-contact"
                
              />
              {updateContact === myProfile?.mobile && (
                <div className="mobile-info">
                  <img src={InfoIcon} alt="info-icon" />
                  <p>{dashboard?.use_your_absher_mobile}</p>
                </div>
              )}
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

export default ProfileEditDialog;
