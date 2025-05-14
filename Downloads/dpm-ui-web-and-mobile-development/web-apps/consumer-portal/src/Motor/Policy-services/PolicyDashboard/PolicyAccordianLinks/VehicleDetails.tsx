import React from 'react';
import style from './VehicleDetails.module.scss'
import cardIconNissan from 'assets/PolicyDetails/carIconNissan.svg';
import cardIconBenz from 'assets/PolicyDetails/carIconMercedes.svg';
import verticleLine from 'assets/PolicyDetails/verticleLine.svg';
import { getVehicleColor, getVehicleTransmission } from 'utils/policyDetails';


interface VehicleDetailsProps {
  carModel?: string;
  registrationPlateNo?: string;
  registrationPlateText?: string;
  vehicleSequenceNo?: string;
  chassisNo?: string;
  typeOfChassis?: string;
  yearOfManufacture?: string;
  serialNo?: string;
  vehicleColor?: string;
  transmission?: string;
  vehicleMakeText?: string;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  carModel,
  registrationPlateNo,
  registrationPlateText,
  vehicleSequenceNo ,
  chassisNo,
  typeOfChassis,
  yearOfManufacture,
  serialNo,
  vehicleColor,
  transmission ,
  vehicleMakeText
}) => {

    const numberPlate = `${registrationPlateNo} - ${registrationPlateText}`;
    vehicleColor = vehicleColor && getVehicleColor(parseInt(vehicleColor));
    transmission = transmission && getVehicleTransmission(parseInt(transmission));

    return (
        <div className={style.container}>
            <div className={style.frameContainer}>
                <div className={style.rowTitle}>
                    <div className={style.titleContainer}>
                        <div className={style.product}>
                            <div className={style.productIcon}>
                                <img src={carModel === 'Benz' ? cardIconBenz : cardIconNissan} alt='car icon'/>
                            </div>
                            <div className={style.productLabel}>
                                <div className={style.productLabeltitle}>{carModel}</div>
                                <div className={style.productLabeltitleInput}>{numberPlate}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="policyacc-vector" />
                <div className={style.rowContent}>
                    <ViewField label="Vehicle Sequence No." value={vehicleSequenceNo} />
                    <ViewField label="Chassis No." value={chassisNo} />
                    <ViewField label="Type of Chassis" value={typeOfChassis} />
                </div>
                <hr className="policyacc-vector" />
                <div className={style.rowContent}>
                    <ViewField label="Year of Manufacture" value={yearOfManufacture} />
                    <ViewField label="Serial No." value={serialNo} />
                    <ViewField label="Vehicle Color" value={vehicleColor} />
                    <ViewField label="Transmission" value={transmission} />
                </div>
                
            </div>
        </div>
    );
}

const ViewField: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className={style.viewField}>
        <div className={style.viewFieldLabel}>{label}</div>
        <div className={style.viewFieldInput}>{value ?? " "}</div>
    </div>
);


export default VehicleDetails;