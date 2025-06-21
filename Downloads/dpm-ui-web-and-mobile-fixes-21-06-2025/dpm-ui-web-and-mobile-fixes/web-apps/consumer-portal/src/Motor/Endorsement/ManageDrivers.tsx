import React, { useEffect, useState } from "react";
import "./ManageDrivers.scss";
import ThemeRadioCheckbox from "./sharedComponent/ThemeRadioCheckbox";
import {
    Accordion,
    Card,
    useAccordionButton,
} from "react-bootstrap";
import Line from "assets/Endorsement/Line.svg";
import CancelRed from "assets/Endorsement/cancel-red.svg";
import { AddDriver } from "components/AddDriver";
import DriverDetailsModal from "components/DriverDetailsModal";
import { getCodeDesc } from "utils/MasterData";
import { useMasterData } from "./hook/useMasterData";
import { DriverProps } from "types/driver";
import PromptModal from "components/PromptModal";
import { AlertBox } from "components/AlertBox";
import { MAX_DRIVERS_TO_ADD, MAX_ADDITIONAL_DRIVERS_TO_ADD, NAME_CHARACTER_LIMIT } from "constant";
import { getDriverIdentifier } from "utils/driverIdentifier";
import { getPlateNumber } from "utils/getPlateNumber";
import { useSelector } from 'react-redux';
import { RootState, useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { AddDriverProps, NewDriverProps } from "types/endorsement";
import { getGenderProfileIcon, truncateName } from "utils/quoteAndBuy";
import { getModelIcon } from "utils/getModelIcon";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { getAmountWithIcon } from "@app-shell/utils/common";
interface ManageDriverProps {
    languageData: { [key: string]: string };
    policyData: {
        vehicleModel: string;
        plateNo: string;
        manufactureYear: string;
        vehicleColour: number;
        chassisNo: string;
        vehicleSequenceNo: string;
        vehicleCustomID: string;
        drivers: Driver[];
        vehicleModelText?: string;
        plateNoText1?: string;
        plateNoText2?: string;
        plateNoText3?: string;
        vehicleMakeTextEn?: string;
        vehicleMakeId?: number | string;
        vehicleModelTextEn?: string;
    };
    policyNumber: string;
    newDriverArray: NewDriverProps[];
    setNewDriverArray: (val: NewDriverProps[]) => void;
    addDriverData: AddDriverProps[],
    setAddDriverData: (val: AddDriverProps[]) => void;
}

interface ListDriversProps {
    languageData: { [key: string]: string };
    drivers: Driver[];
    isOwner?: boolean;
}

export const ManageDrivers: React.FC<ManageDriverProps> = ({ languageData, policyData, policyNumber,
    newDriverArray, setNewDriverArray,
    addDriverData, setAddDriverData
}) => {

    const {userInfo}= useSelector((state: RootState) => state.auth);
    const [isRadioChecked, setIsRadioChecked] = useState(true);
    const [driverArray, setDriverArray] = useState<DriverProps[]>([]);
    const [existingDrivers, setExistingDrivers] = useState<DriverProps[]>([]);
    const [driverIndex, setDriverIndex] = useState<number>(0);
    const [newDriver, setNewDriver] = useState<DriverProps>();
    const [newDriverRelation, setNewDriverRelation] = useState<number>(0);
    const [driverCount, setDriverCount] = useState<number>(0);

    // AddDriver related states
    const [showAddDriver, setShowAddDriver] = useState<boolean>(false);

    // Driver Details related states
    const [showDriverDetails, setShowDriverDetails] = useState<boolean>(false);

    //vehicle data
    const vehicleModel = policyData?.vehicleModelText || "";
   const { plateNo, plateNoText1, plateNoText2, plateNoText3 } = policyData || {};

    const displayPolicyNumber = getPlateNumber({plateNo, plateNoText1, plateNoText2, plateNoText3});
    const manufactureYear = policyData?.manufactureYear;
    const vehicleColour = policyData?.vehicleColour;
    const color = (vehicleColour === 0) ? "Black" : "White";
    const chassisNo = policyData?.chassisNo;
    const vehicleSequenceNo = policyData?.vehicleSequenceNo;
    const vehicleCustomID = policyData?.vehicleCustomID;
    const { makeMasterApiCall, relationData } = useMasterData("getRelations");

    const [makeModelResponse, setMakeModelResponse] = useState();

    const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
    useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
      1,
      "consumerportal-config",
      "post",
      "en"
    );
  
    useEffect(() => {
      makeModelImageApiCall();
    }, []);
  
    useEffect(() => {
      if (modelImageResponse) {
        setMakeModelResponse(modelImageResponse?.motor_makes);
      }
    }, [modelImageResponse]);

    //delete driver
    const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
    const [showRemoveDriverModal, setShowRemoveDriverModal] = useState<boolean>(false);

    // shows alert notification box
    const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
    const [apiErrorMessage, setApiErrorMessage] = useState({
        title: "",
        description: ""
    });

    useEffect(() => {
        const primaryDriver: driver = [];
        const existingDrivers = [];
        policyData?.drivers?.forEach(driver => {
            if (driver?.driverID === userInfo?.userId) {
                primaryDriver.push(driver);
            } else {
                existingDrivers.push(driver);
            }
        })

        // check the existing additional driver added exceed of maxmium count particular customer
        if (existingDrivers.length === MAX_ADDITIONAL_DRIVERS_TO_ADD) {
            setApiErrorMessage({
                description: languageData?.existing_additional_drivers_limit
            });
            setShowAlertModal(true);
        }
        setDriverArray(primaryDriver);
        setExistingDrivers(existingDrivers);
    }, []);


    useEffect(() => {
        if (newDriver?.driver?.driverName) {
            const driverList1Exist = driverArray?.some(driver => driver?.driverID === newDriver?.driver?.driverID);
            const driverList2Exist = newDriverArray?.some(driver => driver?.driverID === newDriver?.driver?.driverID);
            if (!driverList1Exist && !driverList2Exist) {
                const newDriverObj = newDriver?.driver;
                newDriverObj.relation = newDriverRelation;
                newDriverObj.premium = newDriver?.taxableAmount ?? 0 ;
                setNewDriverArray([...newDriverArray, newDriverObj]);
                
                setAddDriverData([...addDriverData, newDriver]);
            } else {
                if(languageData?.driver_already_added + languageData?.add_new_driver) {
                    setApiErrorMessage({
                        title: "",
                        description: languageData?.driver_already_added + languageData?.add_new_driver
                    });
                    setShowAlertModal(true);
                }
            }
        }
    }, [newDriver]);

    useEffect(() => {
        const fetchData = async () => {
            await makeMasterApiCall();
        };
        fetchData();
    }, [makeMasterApiCall]);


    function ContextAwareToggle() {

        const decoratedOnClick = useAccordionButton("" , () => {
            setIsRadioChecked((prev) => !prev);
        });


        return (
            <ThemeRadioCheckbox
                type="radio"
                defaultChecked={isRadioChecked}
                classes={"card-radio-btn"}
                onChangehandler={decoratedOnClick}
                name="radio-check"
                label=""
                dataTestId="radio-accordion"
            />
        );
    }

    const handleAddDriver = () => {
        setShowAddDriver(true);
        setShowDriverDetails(false);
    }

    const handleDriverDetails = (index: number) => {
        setDriverIndex(index);
        setNewDriver(newDriverArray[index]);
        setShowDriverDetails(true);
        setShowAddDriver(false);
    }

    const handleDriverUpdate = (modifiedData: {}) => {
        const items = newDriverArray;
        items[driverIndex].maritalStatusCd = modifiedData.maritalStatusCd;
        items[driverIndex].childrenBelow16 = modifiedData.childrenBelow16;
        items[driverIndex].relation = modifiedData.relation;
        items[driverIndex].educationLevel = modifiedData.educationLevel;
        items[driverIndex].licenseType = modifiedData.licenseType;
        items[driverIndex].trafficViolations = modifiedData.trafficViolations;
        items[driverIndex].healthConditions = modifiedData.healthConditions;
        setNewDriverArray(items);
        setShowDriverDetails(false);
    };

    const handleDriverDelete = (index: number) => {
        setDriverToDelete(index);
        setShowRemoveDriverModal(true);
    }

    const handleCloseEditModal = () => {
        setShowDriverDetails(false);
    };

    const handleCloseModal = () => {
        setShowRemoveDriverModal(false);
        setDriverToDelete(null);
    };

    const handleConfirmDelete = () => {
        const newDArray = newDriverArray.filter((item, idx) => idx !== driverToDelete);
        const newDrvDataArray = addDriverData.filter((item, idx) => idx !== driverToDelete);
        // Updates the state with the new array
        setNewDriverArray(newDArray);
        setAddDriverData(newDrvDataArray);
        handleCloseModal();
    };

    // total drivers count as four with primary driver, existing addtional drivers and new addtional drivers
    useEffect(() => {
        const driverCount = (driverArray?.length || 0) + (existingDrivers?.length || 0) + (newDriverArray?.length || 0 );
        setDriverCount(driverCount);
        
    }, [driverArray, existingDrivers, newDriverArray]);
    // component to show drivers lits with status of active
    function ListDrivers({ drivers, languageData, isOwner }: ListDriversProps) {
        if (!drivers?.length) {
            return null;
        }
        return drivers?.map((driver, index) => (
            <div key={index} className="driver-card">
                <div className="driver">
                    <div className="driver-img">
                        <img src={getGenderProfileIcon(driver?.gender)} alt="Driver Imaga" />
                    </div>
                    <div className="driver-name-sec">
                        <div className="driver-name" title={driver.driverName}>
                            {truncateName(driver.driverName, NAME_CHARACTER_LIMIT)}
                        </div>
                        <div className="driver-name">
                            {driver.driverNameArabic}
                        </div>
                    </div>
                </div>
                <img src={Line} alt="Line" />
                <div className="detail">
                    <div className="detail-label">
                        {getDriverIdentifier(driver?.driverID, languageData)}
                    </div>
                    <div className="detail-value">
                        {driver.driverID}
                    </div>
                </div>
                <img src={Line} alt="Line" />
                <div className="detail">
                    <div className="detail-label">
                        {languageData?.relationship}
                    </div>
                    <div className="detail-value">
                        {(isOwner && !driver.relation) ? languageData?.owner ?? 'Owner' : driver.relation ? driver.relation : getCodeDesc(relationData, driver.relation)}
                    </div>
                </div>
                
                <div className="active-btn">
                    <button>{languageData?.active}</button>
                </div>
            </div>
        ))
    }

    const handleClose = () => {
        setShowAlertModal(false);
    };

    const isDisableAddDriver=policyData?.drivers.length && driverArray.length && driverCount >= MAX_DRIVERS_TO_ADD;

    return (
        <>
            <AlertBox
                title={apiErrorMessage.title}
                description={apiErrorMessage.description}
                showAlertModal={showAlertModal}
                setShowAlertModal={handleClose}
            />
            <DriverDetailsModal
                showDriverDetails={showDriverDetails}
                languageData={languageData}
                driverDetails={newDriver}
                setDriverDetails={setNewDriver}
                handleDriverUpdate={handleDriverUpdate}
                onHide={handleCloseEditModal}
            />
            <AddDriver
                showAddDriver={showAddDriver}
                setShowAddDriver={setShowAddDriver}
                languageData={languageData}
                setNewDriver={setNewDriver}
                setNewDriverRelation={setNewDriverRelation}
                policyNumber={policyNumber}
                driverCount={driverCount}
            />

            {showRemoveDriverModal && (
                <PromptModal
                    show={showRemoveDriverModal}
                    onHide={handleCloseModal}
                    languageData={languageData}
                    title={languageData?.remove_driver}
                    description={languageData?.are_you_sure_you_want_to_remove}
                    onConfirm={handleConfirmDelete}
                />
            )}
            <div className="benefit-container manage-driver-container">
                <div className="header walaa-medium-500">
                    <div className="header-body">
                        {languageData?.select_vehicle_to_manage}
                    </div>
                </div>
                <div className="header-border"></div>

                <div className="body-addons">
                    <Accordion defaultActiveKey="0" className="main-accordion">
                        <Card
                            className={
                                isRadioChecked ? "card-accordion-1" : "card-accordion"
                            }
                        >
                            <Card.Header className="card-accordion-header">
                                <div className="card-accordion-before-collapse">
                                    <div className="logo-container">
                                        <div className="logo">
                                        <img
                                            className="vehicle-icon"
                                            src={getModelIcon(policyData?.vehicleMakeTextEn, policyData?.vehicleMakeId, makeModelResponse || [])}
                                            alt="logo"
                                        />
                                        </div>
                                        <div className="content">
                                            {/* <div className="content-vehicle walaa-regular-400">
                                                {languageData?.vehicle_sequence}
                                            </div> */}
                                            <div className="content-vehicle-number walaa-medium-500">
                                                {capitalizeNameFirstLetter(`${policyData?.vehicleMakeTextEn} ${policyData?.vehicleModelTextEn}`)}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <ContextAwareToggle />
                                    </div>
                                </div>
                            </Card.Header>
                            <Accordion.Collapse
                                eventKey="0"
                                className="card-accordion-after-expand"
                            >
                                <Card.Body className="accordion-expand-body">
                                    {/* policyData */}
                                    
                                    <div className="detail">
                                        <div className="detail-type walaa-regular-400">
                                            {languageData?.number_plate}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {displayPolicyNumber}
                                        </div>
                                    </div>
                                    <img src={Line} />
                                    <div className="detail">
                                        {vehicleSequenceNo ? <><div className="detail-type walaa-regular-400">
                                            {languageData?.vehicle_sequence}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {vehicleSequenceNo}
                                        </div></> :
                                        <><div className="detail-type walaa-regular-400">
                                            {languageData?.custom_card_no}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {vehicleCustomID}
                                        </div></>
                                        }
                                    </div>
                                    <img src={Line} />
                                    <div className="detail">
                                        <div className="detail-type walaa-regular-400">
                                            {languageData?.registration_year_label}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {manufactureYear}
                                        </div>
                                    </div>
                                    <img src={Line} />
                                    <div className="detail">
                                        <div className="detail-type walaa-regular-400">
                                            {languageData?.colour}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {color}
                                        </div>
                                    </div>
                                    <img src={Line} />
                                    <div className="detail">
                                        <div className="detail-type walaa-regular-400">
                                            {languageData?.chassis_no}
                                        </div>
                                        <div className="detail-type-data walaa-medium-500">
                                            {chassisNo}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className="benefit-cards">
                                <div className="driver-list-container">
                                    {/* // driver sub1 */}
                                    <div className="driver-card-add driver-sub2">
                                        {languageData?.policy_holder ?? "Policy Holder"}
                                    </div>
                                    <div className="driver-sub2">
                                        {/* Section starts to print details of Owner as primary driver  */}
                                        <ListDrivers drivers={driverArray} languageData={languageData} isOwner={true}/>
                                        {/* Kept this code for future use if needed
                                         {(existingDrivers?.length || newDriverArray?.length) ? <div className="driver-card-add">
                                            {languageData?.additional_drivers}
                                        </div> : ''} */}
                                        <div className="driver-sub1">
                                            <div className="driver-sub1-head">
                                                <div className="driver-sub1-text">
                                                    {languageData?.add_additional_drivers_up}
                                                </div>
                                            </div>
                                            <button className={`driver-sub1-btn ${isDisableAddDriver?"disabled-sub1-btn":""}`} disabled={isDisableAddDriver} onClick={handleAddDriver}>{languageData?.add_additional_driver}</button>
                                        </div>

                                        {/* Section starts to print details of Owner as addtional driver  */}
                                        <ListDrivers drivers={existingDrivers} languageData={languageData} />

                                        {/* Section begins to print add additional drivers */}
                                        {newDriverArray.length> 0 && <span className="driver-sub2-text">{languageData?.additional_drivers}</span>}
                                        {newDriverArray.map((driver, index) => (
                                            // driver.mainDriverInd !== "Y" &&
                                            <div key={index} className="driver-card new-driver">
                                                <div className="driver">
                                                    <div className="driver-img">
                                                        <img src={getGenderProfileIcon(driver?.gender)} alt="Driver Imaga" />
                                                    </div>
                                                    <div className="driver-name-sec">
                                                        <div className="driver-name" title={driver.driverName}>
                                                            {truncateName(driver.driverName, NAME_CHARACTER_LIMIT)}
                                                        </div>
                                                        <div className="driver-name">
                                                            {driver.driverNameArabic}
                                                        </div>
                                                    </div>
                                                </div>
                                                <img src={Line} alt="Line" />
                                                <div className="detail">
                                                    <div className="detail-label">
                                                        {getDriverIdentifier(driver?.driverID, languageData)}
                                                    </div>
                                                    <div className="detail-value">
                                                        {driver.driverID}
                                                    </div>
                                                </div>
                                                <img src={Line} alt="Line" />
                                                <div className="detail">
                                                    <div className="detail-label">
                                                        {languageData?.relationship}
                                                    </div>
                                                    <div className="detail-value">
                                                        {getCodeDesc(relationData, driver.relation)}
                                                    </div>
                                                </div>
                                                
                                                <div className="detail premium col-2">
                                                    <div className="detail-label">
                                                        {languageData?.premium}
                                                    </div>
                                                    <div className="detail-value amount">
                                                        {getAmountWithIcon(driver?.premium)}
                                                    </div>
                                                </div>
                                                
                                                <div className="driver-details">
                                                    <button className="link-div" data-testid="driver-detail" onClick={() => handleDriverDetails(index)}>
                                                        <div>{languageData?.driver_details}</div>
                                                    </button>
                                                </div>
                                                {/* Below code for delete driver option */}
                                                <img src={CancelRed} data-testid="driver-delete" onClick={() => handleDriverDelete(index)} />
                                            </div>
                                        ))}
                                        {/* Section ends here to print additional drivers */}
                                    </div>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            </div >
        </>
    );
}