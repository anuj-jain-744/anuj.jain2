import React, { useEffect, useState } from "react";
import style from "./DriverDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import driver from "assets/Endorsement/driver.svg";
import ThemeMasterSelect from "components/ThemeComponents/ThemeMasterSelect";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { useMasterData } from "./hook/useMasterData";
import { getCodeDesc } from "utils/MasterData";

interface DriverDetailsProps {
  showDriverDetails: boolean;
  setShowDriverDetails: (show: boolean) => void;
  languageData: [{[key:string] : string}];
  newDriver: {};
  setNewDriver: (newDriver: any) => void;
  driverIndex: number;
  newDriverRelation: number;
  setNewDriverRelation: (newDriverRelation: number) => void;
  handleDriverUpdate:() => void;
}

interface Props {
  show: boolean;
  onHide: () => void;
}

const DriverDetailsModal = ({ showDriverDetails, setShowDriverDetails, languageData, 
  newDriver,
  setNewDriver,
  handleDriverUpdate
 }: DriverDetailsProps) => {
  const [showModal, setShowModal] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [noChildren, setNoChildren] = useState("0");

  //Block to fetch Relation Master data
  const { makeMasterApiCall, isLoading, error, relationData } = useMasterData("getRelations");
  useEffect(() => {
    const fetchData = async () => {
        await makeMasterApiCall();
    };
    fetchData();
  }, [makeMasterApiCall]);

  //Block to fetch Marital Status Master data
  const { 
    makeMasterApiCall: makeMaritalStatusApiCall,
    isLoading: maritalStatusIsLoading,
    error: maritalStatusError,
    relationData: maritalStatusData
  } = useMasterData("getMaritalStatus");
  useEffect(() => {
    const fetchData = async () => {
        await makeMaritalStatusApiCall();
    };
    fetchData();
  }, [makeMaritalStatusApiCall]);

  //Block to fetch License Country Master data
  const { 
    makeMasterApiCall: makeCountryCodesApiCall,
    isLoading: countryCodesIsLoading,
    error: countryCodesError,
    relationData: countryCodesData
  } = useMasterData("getCountryCodes");
  useEffect(() => {
    const fetchData = async () => {
        await makeCountryCodesApiCall();
    };
    fetchData();
  }, [makeCountryCodesApiCall]);

  //Block to fetch Health Condition Master data
  const { 
    makeMasterApiCall: makeHealthConditionsApiCall,
    isLoading: healthConditionsIsLoading,
    error: healthConditionsError,
    relationData: healthConditionsData
  } = useMasterData("getHealthConditions");
  useEffect(() => {
    const fetchData = async () => {
        await makeHealthConditionsApiCall();
    };
    fetchData();
  }, [makeHealthConditionsApiCall]);

  //Block to fetch Traffic Violation Master data
  const { 
    makeMasterApiCall: makeTrafficViolationsApiCall,
    isLoading: trafficViolationsIsLoading,
    error: trafficViolationsError,
    relationData: trafficViolationssData
  } = useMasterData("getTrafficViolations");
  useEffect(() => {
    const fetchData = async () => {
        await makeTrafficViolationsApiCall();
    };
    fetchData();
  }, [makeTrafficViolationsApiCall]);

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNewDriver({...newDriver, [name]: value});
  };
  useEffect(() => {
    setNewDriver({...newDriver, ["childrenBelow16"]: noChildren});
  },[noChildren]);
  
  return (
    <Modal show={showDriverDetails} centered className="endoDriverDetailsModal">
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.driver_details}</div>
        </div>
        <div className={style.body}>
          <div className={style.card}>
            <div className={style.cardContainer}>
              <div className={style.cardTitle}>
                <div className={style.cardHeading}>
                  <div className={style.cardIcon}>
                    <img src={driver} alt={style.driver} />
                  </div>
                </div>
              </div>
              <div className={style.cardContent}>
                <div className={style.cardContentTitle}>{newDriver?.driverName}</div>
                <div className={style.cardContentValue}>{newDriver?.driverNameArabic}</div>
              </div>
            </div>
            <div className={style.content}>
              <div className={style.contentHolder}>
                <div className={style.contentValue}>
                  {/* <div className={style.contentValueLabel}> */}
                  <div className={style.contentValueInput}>{languageData?.owner_id}</div>
                  <div className={style.contentValueInputValue}>{newDriver?.driverID}</div>
                  {/* </div> */}
                </div>
              </div>
              <div className={style.contentHolder}>
                <div className={style.contentValue}>
                  {/* <div className={style.contentValueLabel}> */}
                  <div className={style.contentValueInput}>{languageData?.dob}</div>
                  <div className={style.contentValueInputValue}>{newDriver?.dateofBirth}</div>
                  {/* </div> */}
                </div>
              </div>
              <div className={style.contentHolder}>
                <div className={style.contentValue}>
                  {/* <div className={style.contentValueLabel}> */}
                  <div className={style.contentValueInput}>{languageData?.gender}</div>
                  <div className={style.contentValueInputValue}>{newDriver?.gender}</div>
                  {/* </div> */}
                </div>
              </div>
              <div className={style.contentHolder}>
                <div className={style.contentValue}>
                  {/* <div className={style.contentValueLabel}> */}
                  <div className={style.contentValueInput}>{languageData?.driver_relation}</div>
                  <div className={style.contentValueInputValue}>{getCodeDesc(relationData, newDriver?.relation)}</div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className={style.cardDetails}>
            <div className={style.cardDetailsLabel}>
            {languageData?.driver_s_personal_details}
            </div>
            <div className={style.cardDetailsFrameContainer}>
              <div className={style.cardDetailsFrame}>
                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                    {languageData?.marital_status}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeMasterSelect
                    options={ maritalStatusData?.model?.content}
                    placeholder={languageData?.select + " " + languageData?.marital_status}
                    value={newDriver?.maritalStatusCd}
                    onChangehandler={handleDropdownChange}
                    isRequired={true}
                    fieldName="maritalStatusCd"
                    classes="select-input"
                    //classes={`form-select ${isDropdownOpen ? "open" : ""}`}
                    label={languageData?.driver_relation}
                  />
                </div>
                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                    {languageData?.no_of_children_under_16}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeTextbox
                    classes="form-control"
                    type="text"
                    value={noChildren}
                    onChangehandler={(event) =>
                      setNoChildren(event.target.value)
                    }
                    name={""}
                  />
                </div>
              </div>
            </div>
            <div className={style.cardDetailsFrameContainer}>
              <div className={style.cardDetailsFrame}>
                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                    {languageData?.driver_relation}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeMasterSelect
                    options={relationData?.model?.content}
                    placeholder={languageData?.select + " " + languageData?.driver_relation}
                    value={newDriver?.relation}
                    onChangehandler={handleDropdownChange}
                    isRequired={true}
                    fieldName="relation"
                    classes="select-input"
                    //classes={`form-select ${isDropdownOpen ? "open" : ""}`}
                    label={languageData?.driver_relation}
                  />
                </div>
                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                  {languageData?.license_country}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeMasterSelect
                    options={countryCodesData?.model?.content}
                    placeholder={languageData?.select + " " + languageData?.license_country}
                    value={newDriver?.validDrivingLicenses}
                    onChangehandler={handleDropdownChange}
                    isRequired={true}
                    fieldName="validDrivingLicenses"
                    classes="select-input"
                    //classes={`form-select ${isDropdownOpen ? "open" : ""}`}
                    label={languageData?.license_country}
                  />
                </div>
              </div>
            </div>
            <div className={style.cardDetailsFrameContainer}>
              <div className={style.cardDetailsFrame}>

                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                  {languageData?.traffic_violation}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeMasterSelect
                    options={trafficViolationssData?.model?.content}
                    placeholder={languageData?.select + " " + languageData?.traffic_violation}
                    value={newDriver?.trafficViolations}
                    onChangehandler={handleDropdownChange}
                    isRequired={true}
                    fieldName="trafficViolations"
                    classes="select-input"
                    //classes={`form-select ${isDropdownOpen ? "open" : ""}`}
                    label={languageData?.traffic_violation}
                  />
                </div>
                <div className={style.cardDetailsFrameValue}>
                  <div className={style.cardDetailsFrameLabel}>
                  {languageData?.health_condition}
                  </div>
                  {/* <div className="cardDetailsFrameInput"></div> */}
                  <ThemeMasterSelect
                    options={ healthConditionsData?.model?.content}
                    placeholder={languageData?.select + " " + languageData?.health_condition}
                    value={newDriver?.healthConditions}
                    onChangehandler={handleDropdownChange}
                    isRequired={true}
                    fieldName="healthConditions"
                    classes="select-input"
                    //classes={`form-select ${isDropdownOpen ? "open" : ""}`}
                    label={languageData?.health_condition}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.frameBottom}>
          <ThemeButton
            icon={false}
            variant="outline"
            isDisabled={false}
            title={languageData?.cancel}
            classes="walaa-medium-500"
            onClickhandler={() => setShowDriverDetails(false)}
          />
          <ThemeButton
            icon={false}
            variant="trackClaim"
            isDisabled={false}
            title={languageData?.update}
            classes="walaa-medium-500"
            onClickhandler={handleDriverUpdate}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DriverDetailsModal;
