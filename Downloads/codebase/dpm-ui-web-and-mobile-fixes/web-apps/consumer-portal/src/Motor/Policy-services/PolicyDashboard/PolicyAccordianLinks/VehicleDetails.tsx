import React, { useEffect, useState } from 'react';
import style from './VehicleDetails.module.scss'
import { capitalizeNameFirstLetter, useApiCall, NOT_APPLICABLE } from "@dpm/shared-module";
import { getPlateNumber } from 'utils/getPlateNumber';
import { MakeModelImageResponse } from 'Motor/QuoteAndBuy/QuoteAndBuyContext';
import { getModelIcon } from 'utils/getModelIcon';
import change from 'assets/PolicyDetails/change.svg';
import { useNavigate } from 'react-router-dom';
import { LanguageData } from 'types/languageData';

interface VehicleDetailsProps {
  carModel?: string;
  registrationPlateNo?: string;
  registrationPlateText1?: string;
  registrationPlateText2?: string;
  registrationPlateText3?: string;
  vehicleSequenceNo?: string;
  vehicleCustomID?: string;
  chassisNo?: string;
  typeOfChassis?: string;
  yearOfManufacture?: string;
  serialNo?: string;
  vehicleColor?: string;
  transmission?: string;
  vehicleMakeText?: string;
  vehicleModelText?: string;
  details?: unknown;
  vehicleMakeId?: string | number;
  languageData?: LanguageData;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
    registrationPlateNo,
    registrationPlateText1,
    registrationPlateText2,
    registrationPlateText3,
    vehicleSequenceNo ,
    chassisNo,
    typeOfChassis,
    yearOfManufacture,
    serialNo,
    vehicleColor,
    transmission ,
    vehicleMakeText,
    vehicleModelText,
    vehicleMakeId,
    details,
    languageData,
}) => {

   const numberPlate = getPlateNumber({plateNo: registrationPlateNo, plateNoText1: registrationPlateText1, plateNoText2: registrationPlateText2, plateNoText3: registrationPlateText3});
   const carModel = capitalizeNameFirstLetter(`${vehicleMakeText} ${vehicleModelText}`);
   
   const customNumber = details?.vehicleDetails[0].vehicleCustomID;

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

    const navigate = useNavigate();
    const handleChangeSequenceNumber = () => {
        const data ={
            policyData: details,
            languageData: languageData,
        }

        navigate('/ChangeCustCardtoVehSeq', { state: data });
        // Logic to handle change to sequence number
    };

    return (
        <div className={style.container}>
            <div className={style.frameContainer}>
                <div className={style.rowTitle}>
                    <div className={style.titleContainer}>
                        <div className={style.product}>
                            <div className={style.productIcon}>
                            <img
                                className="vehicle-icon"
                                src={getModelIcon(vehicleMakeText, vehicleMakeId, makeModelResponse || [])}
                                alt="logo"
                              />
                            </div>
                            <div className={style.productLabel}>
                                <div className={style.productLabeltitle}>{carModel}</div>
                                <div className={style.productLabeltitleInput}>{numberPlate}</div>
                            </div>
                        </div>
                        <div className={vehicleSequenceNo === null || vehicleSequenceNo === NOT_APPLICABLE ? `${style.changeSeqNumber}` : `${style.disableSeqNumber}`} onClick={handleChangeSequenceNumber} role="button" tabIndex={0} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleChangeSequenceNumber();
                            }
                        }}>
                            <div className={style.text}>{languageData?.changeToSequenceNumber}</div>
                            <div className={style.changeLogo}><img src={change} alt='Change Sequence Number' /></div>
                        </div>
                    </div>
                </div>
                <hr className={style.policyaccVector} />
                <div className={style.rowContent}>
                {vehicleSequenceNo === null || vehicleSequenceNo === NOT_APPLICABLE ? <ViewField label={languageData?.custom_card_no} value={customNumber} /> : <ViewField label={languageData?.vehicle_sequence} value={vehicleSequenceNo} /> }
                    <ViewField label={languageData?.chassis_no} value={chassisNo} />
                    <ViewField label={languageData?.type_of_chassis} value={typeOfChassis} />
                </div>
                <hr className={style.policyaccVector} />
                <div className={style.rowContent}>
                    <ViewField label={languageData?.year_of_manufacture} value={yearOfManufacture} />
                    <ViewField label={languageData?.serial_no} value={serialNo} />
                    <ViewField label={languageData?.vehicle_color} value={vehicleColor} />
                    <ViewField label={languageData?.transmission} value={transmission} />
                </div>
            </div>
        </div>
    );
}

const ViewField: React.FC<{ label: string | undefined; value: string | undefined }> = ({ label, value }) => (
    <div className={style.viewField}>
        <div className={style.viewFieldLabel}>{label}</div>
        <div className={style.viewFieldInput}>{value ?? " "}</div>
    </div>
);


export default VehicleDetails;