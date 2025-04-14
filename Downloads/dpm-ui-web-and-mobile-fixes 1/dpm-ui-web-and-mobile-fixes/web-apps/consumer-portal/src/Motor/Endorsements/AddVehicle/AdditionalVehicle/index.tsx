import React, { useContext, useState } from "react";
import { DataContext } from "../../../../DataContext";
import ThemeRadioCheckbox from "../../../../claims/components/ThemeRadioCheckbox";
import { Card } from "react-bootstrap";
import ThemeButton from "../../../../claims/components/ThemeButton";
import ThemeTextbox from "../../../../claims/components/ThemeTextbox";
import ThemeSelect from "../../../../claims/components/ThemeSelect";
import Nissan from "../../../../claims/assets/png/Nissan.png";
import Mercedes from "../../../../claims/assets/png/Mercedes.png";
import Car from "../../../../claims/assets/svg/icons/Car.svg";
import DeleteBin from "../../../../claims/assets/svg/icons/Delete.svg";
import CompreTermsAndCon from "../../../../claims/register/compensation/TermsAndCon";

function AdditionalVehicle() {
  const [vehicle, setVehicle] = useState<boolean>(true);
  const [vehicleseqval, setVehicleSeq] = useState<string>("");
  const [custom, setCustom] = useState<boolean>(false);
  const [customcardno, setCustomCardNo] = useState<string>("");
  const [isVehicleDetails, setIsVehicleDetails] = useState<boolean>(false);

  //cms content
  const Data = useContext(DataContext);

  //change handler fn for vehicle seq/custom card radio, vehicle seq txt
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, title, value } = event?.target;
    //for radio
    if (value === "Vehicle Sequence No.") {
      setVehicle(true);
      setCustom(false);
      //resetting other values
      setCustomCardNo("");
    }
    //for radio
    if (value === "Custom Card No.") {
      setCustom(true);
      setVehicle(false);
      //resetting other values
      setVehicleSeq("");
    }
    //for textbox
    if (name === "VehicleSequence") {
      setVehicleSeq(value);
    }
    //for textbox
    if (name === "CustomCard") {
      setCustomCardNo(value);
    }
  };

  const retriveVehicleDetails = () => {
    setIsVehicleDetails(true);
  };

  //sample Data for Existing Vehicles
  const ExistingVehicles = [
    {
      id: 1,
      vehicle_brand: "Nissan",
      title: Data?.vehicle_sequence,
      value: "8754562340",
    },
    {
      id: 2,
      vehicle_brand: "Mercedes",
      title: Data?.vehicle_sequence,
      value: "2754562356",
    },
  ];
  //icon fact fn
  const VehicleBrandIcon = (name: string) => {
    const IcnObj = {
      Nissan: <img src={Nissan} alt="Nissan" />,
      Mercedes: <img src={Mercedes} alt="Mercedes" />,
    };
    return IcnObj[name];
  };
  return (
    <React.Fragment>
      <div className="container additionalvehicle">
        <div className="left-card walaa-regular-400">
          <div className="header walaa-medium-500">
            <div className="header-body">{Data?.add_additional_vehicle}</div>
          </div>
          <div className="header-border"></div>
          <div className="body">
            <div className="body-addons walaa-medium-500">
              {Data?.existing_vehicles}
            </div>
            <div className="body-addons">
              <div className="row">
                {ExistingVehicles?.map((item, key) => {
                  return (
                    <React.Fragment key={key}>
                      <div className="col-sm-12 col-md-6">
                        <Card className="veh-seq-card">
                          <Card.Body>
                            <div className="row d-flex align-items-center">
                              <div className="col-3">
                                {VehicleBrandIcon(item?.vehicle_brand)}
                              </div>
                              <div className="col px-0">
                                <div className="d-flex flex-column">
                                  <div className="veh-seq-card-title walaa-regular-400">
                                    {item?.title}
                                  </div>
                                  <div className="veh-seq-card-value walaa-medium-500">
                                    {item?.value}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="body-addons">
              <hr style={{ margin: "0px" }} />
              {isVehicleDetails ? (
                <>
                  <div className="body-vehicle-list">
                    <div className="body-vehicle-list-sub">
                      <div className="row1">
                        <div className="brandCol">
                          <img
                            src="/src/claims/assets/png/Nissan.png"
                            alt="Nissan"
                          ></img>
                        </div>
                        <div className="col px-0 brand-desc">
                          <div className="d-flex flex-column">
                            <div className="veh-seq-card-title walaa-regular-400">
                              {Data?.vehicle_sequence}
                            </div>
                            <div className="veh-seq-card-value walaa-medium-500">
                              8754562340
                            </div>
                          </div>
                        </div>
                        <div className="col px-0">
                          <div className="d-flex flex-column">
                            <div className="new-veh walaa-medium-500">
                              {Data?.new_vehicle}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="del-col">
                        <img
                          className="icons-delete"
                          src={DeleteBin}
                          alt="Delete"
                        />
                      </div>
                    </div>

                    <div className="body-vehicle-list-sub2">
                      <div className="cols">
                        <div className="veh-seq-card-title walaa-regular-400">
                          {Data?.model_type}
                        </div>
                        <div className="veh-seq-card-value walaa-medium-500">
                          Nissan Patrol XE
                        </div>
                      </div>
                      <div className="border-line"></div>
                      <div className="cols">
                        <div className="veh-seq-card-title walaa-regular-400">
                          {Data?.no_plate}
                        </div>
                        <div className="veh-seq-card-value walaa-medium-500">
                          7403 - RUA
                        </div>
                      </div>
                      <div className="border-line"></div>
                      <div className="cols">
                        <div className="veh-seq-card-title walaa-regular-400">
                          {Data?.registration_year_label}
                        </div>
                        <div className="veh-seq-card-value walaa-medium-500">
                          2018
                        </div>
                      </div>
                      <div className="border-line"></div>
                      <div className="cols">
                        <div className="veh-seq-card-title walaa-regular-400">
                          {Data?.vehicle_color}
                        </div>
                        <div className="veh-seq-card-value walaa-medium-500">
                          Pearl Blue
                        </div>
                      </div>
                      <div className="border-line"></div>
                      <div className="cols">
                        <div className="veh-seq-card-title walaa-regular-400">
                          {Data?.chassis_no}
                        </div>
                        <div className="veh-seq-card-value walaa-medium-500">
                          342128976
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-2">
                    <div className="col">
                      <CompreTermsAndCon isChecked={false} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="walaa-medium-500">
                    {Data?.adding_the_third_vehicle}
                  </div>
                  <div className="row">
                    <div
                      data-testid="radio-checkid"
                      className="col-xs-12 col-sm-12 col-md-4 pe-0"
                    >
                      <ThemeRadioCheckbox
                        label={Data?.vehicle_sequence}
                        type={"radio"}
                        defaultChecked={vehicle}
                        classes={""}
                        onChangehandler={changeHandler}
                        dataTestId="radio_vehicleSeq"
                      />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5">
                      <ThemeRadioCheckbox
                        label={Data?.custom_card_no}
                        type={"radio"}
                        defaultChecked={custom}
                        classes={""}
                        onChangehandler={changeHandler}
                        dataTestId="radio_customCardNo"
                      />
                    </div>
                  </div>
                  <div className="row d-flex align-items-center">
                    {vehicle ? (
                      <div className="col-xs-12 col-sm-12 col-md-6">
                        <ThemeTextbox
                          name="VehicleSequence"
                          placeholder={Data?.enter_vehicle_sequence_no}
                          type="number"
                          onChangehandler={changeHandler}
                          value={vehicleseqval}
                        />
                      </div>
                    ) : (
                      <React.Fragment>
                        <div className="col-xs-12 col-sm-12 col-md">
                          <ThemeTextbox
                            name="CustomCard"
                            placeholder={Data?.enter_custom_card_no}
                            type="number"
                            onChangehandler={changeHandler}
                            value={customcardno}
                          />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md">
                          <ThemeSelect name={Data?.manufacturing_year} />
                        </div>
                      </React.Fragment>
                    )}

                    <div className="col-xs-12 col-sm-12 col-md-5">
                      <ThemeButton
                        isDisabled={
                          vehicle
                            ? vehicleseqval?.length > 0
                              ? false
                              : true
                            : customcardno?.length > 0
                            ? false
                            : true
                        }
                        title={Data?.retrieve_vehicle_details}
                        classes=""
                        onClickhandler={retriveVehicleDetails}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="right-card">
          <Card className="policy-card">
            <div className="header">
              <div className="header-content">
                <div className="logo">
                  <img src={Car} className="logo-img" />
                </div>
                <div className="content">
                  <div>{Data?.policy_no}</div>
                  <div className="walaa-medium-500 policy-number">WL-12345</div>
                </div>
              </div>
              <div className="cmp walaa-medium-500">{Data?.comprehensive}</div>
            </div>
            <hr className="horizontal-line" />
            <div className="date">
              <div className="start-date">
                <div>{Data?.start_date}</div>
                <div className="policy-start-date walaa-medium-500">
                  22/08/2024
                </div>
              </div>
              <hr className="horizontal-line" />
              <div className="expiry-date">
                <div>{Data?.expiry_date}</div>
                <div className="policy-end-date walaa-medium-500">
                  21/08/2025
                </div>
              </div>
            </div>
            <div className="idv">
              <div className="idv-content">{Data?.sum_insured}</div>
              <div className="idv-value walaa-medium-500">SAR 22,793.00</div>
            </div>
          </Card>
          <Card className="order-summary">
            <div className="order-header">
              <div className="walaa-medium-500 order-title">
                {Data?.order_summary}
              </div>
            </div>
            <hr style={{ width: "100%", margin: "0" }} />
            <div className="body">
              <div className="walaa-medium-500">{Data?.endorsements}</div>

              <div className="child-body">
                <div className="child-child-body">
                  <div>Death Package</div>
                  <div>SAR 200.00</div>
                </div>
              </div>

              <div className="child-body">
                <div className="child-child-body">
                  <div>{Data?.roadside_assistance} Package</div>
                  <div>SAR 120.00</div>
                </div>
              </div>

              <div className="child-body">
                <div className="child-child-body">
                  <div>Accident Coverage Package</div>
                  <div>SAR 140.00</div>
                </div>
              </div>

              <hr style={{ width: "100%", margin: "0" }} />
              <div className="child-body walaa-medium-500">
                <div className="child-child-body">
                  <div>{Data?.subtotal}</div>
                  <div>"SAR 200.00"</div>
                </div>
              </div>
              <hr style={{ width: "100%", margin: "0" }} />
              <div className="child-body walaa-medium-500">
                <div className="child-child-body">
                  <div>{Data?.tax}</div>
                  <div></div>
                </div>
              </div>
              <div className="child-body">
                <div className="child-child-body">
                  <div>{Data?.vat_amount} (15%)</div>
                  <div>"SAR 45.30"</div>
                </div>
              </div>
            </div>
            <div className="foot walaa-medium-500">
              <div className="left">{Data?.total_amount}</div>
              <div className="right">SAR 265.30</div>
            </div>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AdditionalVehicle;
