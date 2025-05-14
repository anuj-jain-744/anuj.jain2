import { FC, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import { SharedCalendar } from "components/Calendar";
import { Value } from "react-multi-date-picker";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DATE_FORMAT } from "constant";
import { ViewPolicy } from "types/endorsement";
import AddClaimEstimate from "Home/AddClaimEstimate/AddClaimEstimate";

interface DataLossProps {
  languageData: LanguageData;
  viewPolicy: ViewPolicy;
  handleRequestClaims: (value: Value) => void;
  causeOfLossOptions: { [key: string]: string }[];
  addEstimateValues: (data: []) => void;
  claimFNOLError: string;
  nonMotorFNOL: {claimInfo: {policyNumber: string}} | null;
}

const DataLoss: FC<DataLossProps> = ({
  viewPolicy,
  languageData,
  causeOfLossOptions,
  handleRequestClaims,
  addEstimateValues,
  claimFNOLError,
  nonMotorFNOL
}) => {
  const [policyStartDate, setPolicyStartDate] = useState<Value>();
  const { policyBasic } = viewPolicy;
  const { effectiveDate, expiryDate, policyNumber } = policyBasic;
  const [isRefNoModal, setRefNoShow] = useState<boolean>(false);

  // set dateofloss to call NonMotorFNOL API call
  const setDatepickerValue = (value: Value) => {
    if (value) {
      const dateOfLoss = new Date(value);
      setPolicyStartDate(dateOfLoss);
      handleRequestClaims(dateOfLoss);
    }
  }

  const handleRefNoClose = () => setRefNoShow(false);
  const handleRefNoShow = () => setRefNoShow(true);

  // call NonMotorFNOL API call selected by dateofloss
  useEffect(() => {
    if (effectiveDate && policyNumber) {
      const dateOfLoss: Value = new Date(effectiveDate);
      setPolicyStartDate(new Date());
      handleRequestClaims(dateOfLoss);
    }
  }, [effectiveDate, policyNumber])

  // check the policy start date and expiry date should not be null or undefined
  if (!expiryDate && !effectiveDate) {
    return null
  }

  const policyEffectiveDate = new Date(effectiveDate); // policy start date
  const policyExpiryDate = new Date(expiryDate) > new Date() ? new Date() : new Date(expiryDate); // policy end date

  return (
    <div className="policy-claim-container">
      <Modal
        show={isRefNoModal}
        centered
        onHide={handleRefNoClose}
        className='home-claims-dialog-box'
      >
        <Modal.Header closeButton>{languageData?.loss_details_guidelines}</Modal.Header>
        <div className='home-claims-container'>
          {languageData?.loss_details_guidelines_content}
        </div>
      </Modal>
      <div className="select-policy-header walaa-medium-500">
        {languageData?.loss_details} <button onClick={handleRefNoShow}><InfoOutlinedIcon /></button>
      </div>
      <hr className="horizontal-line" />
      <div className="loss-details-box-container">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="policy-content-label">
                {languageData?.date_of_claim_registration}
              </div>
              <div className="pt-2 disabled">
                <SharedCalendar
                  value={new Date()}
                  setValue={() => { }}
                  disabled={true}
                  showSwitch={false}
                  format={DATE_FORMAT}
                  isonlyMonthPickerEnable={true}
                  isCalendarIcon={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="policy-content-label">
                {languageData?.date_of_loss} <span className="text-danger">*</span>
              </div>
              <div className="pt-2">
                <SharedCalendar
                  value={policyStartDate}
                  showSwitch={false}
                  setValue={setDatepickerValue}
                  format={DATE_FORMAT}
                  isonlyMonthPickerEnable={true}
                  minDate={policyEffectiveDate}
                  maxDate={policyExpiryDate}
                  isCalendarIcon={true}
                  onOpenPickNewDate={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            {nonMotorFNOL && <div className="pt-2"> <AddClaimEstimate
              languageData={languageData}
              causeOfLossOptions={causeOfLossOptions}
              addEstimateValues={addEstimateValues}
            />
            </div>}
            {claimFNOLError &&
              <p className="pl-25 attach_error">{claimFNOLError}</p>
            }
          </div>
        </div>
      </div>

    </div>
  );
};

export default DataLoss;