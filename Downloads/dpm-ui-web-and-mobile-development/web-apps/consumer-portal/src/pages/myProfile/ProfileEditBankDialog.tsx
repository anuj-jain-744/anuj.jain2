import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  useApiCall,
  setUpdateContactData,
  validateIBAN,
} from "@dpm/shared-module";
import { myProfile } from "constant";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { LoaderOverlay } from "components/OTPValidation";
import ThemeSelect from "@dpm/corporate-portal/src/components/FormInput/ThemeSelect";

interface ProfileEditBankDialogType {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  showOtp: (val: boolean) => void;
  setCallGenerateOtp: (val: boolean) => void;
  updateContact: string | undefined;
}

const ProfileEditBankDialog: React.FC<ProfileEditBankDialogType> = ({
  showDialog,
  setShowDialog,
  showOtp,
  setCallGenerateOtp,
  updateContact,
}) => {
  const dispatch = useDispatch();
  const { languageData: dashboard } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );
  const [title, setTitle] = useState<string>("");
  const [exisitngLabel, setExisitngLabel] = useState<string>("");
  const [exisitngLabel1, setExisitngLabel1] = useState<string>("");
  const [ibanLabel, setIbanLabel] = useState<string>("");
  const [bankLabel, setBankLabel] = useState<string>("");
  const [exisitingIbanValue, setExisitingIbanValue] = useState<string>("");
  const [exisitingBankValue, setExisitingBankValue] = useState<string>("");
  const [newIbanValue, setNewIbanValue] = useState<string>("");
  const [newBankValue, setNewBankValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [ibanErrorMessage, setIbanErrorMessage] = useState<string>("");

  useEffect(() => {
    if (updateContact === myProfile?.bank) {
      setTitle(dashboard?.update_bank_details);
      setExisitngLabel(dashboard?.existing_iban_no);
      setExisitngLabel1(dashboard?.existing_bank_name);
      setIbanLabel(dashboard?.iban_no);
      setBankLabel(dashboard?.bank_name);
    }
  }, [updateContact]);
  useEffect(() => {
    if (ibanErrorMessage === "" && newBankValue !== "" && newIbanValue !== "") {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [ibanErrorMessage, newBankValue, newIbanValue]);

  const handleClose = () => setShowDialog(false);

  const handleUpdate = () => {
    setLoading(true);
    setShowDialog(false);
    showOtp(true);
    setCallGenerateOtp(true);
    const label = { label: updateContact, value: newIbanValue };
    dispatch(setUpdateContactData(label));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewIbanValue(value);
    validateInputForIban(value);
  };
  const onSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    setNewBankValue(value);
  };

  const validateInputForIban = (value: string | number) => {
    setIbanErrorMessage("");
    console.log(!validateIBAN(value));
    if (!validateIBAN(value)) {
      setIbanErrorMessage(dashboard?.invalid_iban);
    }
  };

  return (
    <div className="profileEditing">
      {loading && <LoaderOverlay />}
      <Modal
        show={showDialog}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={"profile-edit-modal-bank"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="walaa-medium-500">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column mobile-container">
            <div className="existing-bank-label">
              <div className="label-content">
                <span className="label">{exisitngLabel}</span>
                <span className="value">{exisitingIbanValue}</span>
              </div>
              <div className="label-content">
                <span className="label">{exisitngLabel1}</span>
                <span className="value">{exisitingBankValue}</span>
              </div>
            </div>
            <div className="exisiting-mobile-value">
              <span className="label">{ibanLabel}</span>
              <ThemeTextbox
                name="updateContact"
                onChangehandler={handleInputChange}
                value={newIbanValue}
                onBlurHandler={validateInputForIban}
                errorMessage={ibanErrorMessage}
                classes="update-contact"
                placeholder={dashboard?.enter_new_Iban_no}
              />
              <span className="label">{bankLabel}</span>
              <ThemeSelect
                options={[]}
                placeholder={dashboard?.select}
                value={newBankValue}
                onChangehandler={onSelectHandler}
                isRequired={true}
                classes="update-contact form-select"
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
