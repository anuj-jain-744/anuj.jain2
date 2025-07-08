import React, { useContext, useState } from "react";
import ThemeRadioCheckbox from "../../../../claims/components/ThemeRadioCheckbox";
import ThemeTextbox from "../../../../claims/components/ThemeTextbox";
import ThemeButton from "../../../../claims/components/ThemeButton";
import Nissan from "../../../../assets/Endorsement/png/Nissan.png";
import Mercedes from "../../../../assets/Endorsement/png/Mercedes.png";
import { DataContext } from "DataContext";

function VehicleSeqInformation() {
  //active custom-card
  const [activeSeq, setCustomSequenceActive] = useState<number>(1);
  //cms content
  const Data = useContext(DataContext);

  //vehicle sequence No custom-card Data
  const CustomCardData = [
    {
      id: 1,
      key: "custom_card_seq_1",
      iconName: "nissan",
      title: Data?.custom_card_no,
      subtitle: "9797080880",
      txtboxname: "vehicle_seq_no_txt",
      txtplaceholder: Data?.enter_vehicle_sequence_no,
      txtbuttonname: "vehicle_seq_no_btn",
      txtbuttontext: Data?.validate_sequence_no,
    },
    {
      id: 2,
      key: "custom_card_seq_2",
      iconName: "mercedes",
      title: Data?.custom_card_no,
      subtitle: "2754562356",
      txtboxname: "vehicle_seq_no_txt",
      txtplaceholder: Data?.enter_vehicle_sequence_no,
      txtbuttonname: "vehicle_seq_no_btn",
      txtbuttontext: Data?.validate_sequence_no,
    },
  ];

  //icon render fn
  function icnFactory(name: string) {
    const IcnListObj = {
      mercedes: Mercedes,
      nissan: Nissan,
    };
    return IcnListObj[name];
  }

  //change handler return accept fn
  const updatedValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    switch (name) {
      case "custom_card_seq_1":
        setCustomSequenceActive(1);
        break;
      case "custom_card_seq_2":
        setCustomSequenceActive(2);
        break;
    }
  };

  return (
    <React.Fragment>
      {CustomCardData?.map((item, key) => (
        <div className="row customcardvehsequence mb-3" key={item.id + key}>
          <div className="col">
            <div
              className={
                activeSeq === item?.id
                  ? "radio-btn-checked w-100 border-color-vehseq d-grid"
                  : "radio-btn-unchecked-customcard w-100 border-color-vehseq-no-background d-grid"
              }
            >
              <div className="row w-100 vehicleinformation">
                <div className="col-xs-12 col-4">
                  <div className="row">
                    <div className="col-xs-12 col-md-3">
                      <img
                        src={icnFactory(item?.iconName)}
                        alt={item?.iconName}
                      />
                    </div>
                    <div className="col">
                      <div className="d-flex flex-column">
                        <div className="walaa-medium-500 titleText">
                          {item?.title}
                        </div>
                        <div>{item?.subtitle}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-8 text-end p-0 m-0 vehicleseq-radio-con">
                  <ThemeRadioCheckbox
                    classes=""
                    defaultChecked={activeSeq === item?.id ? true : false}
                    label=""
                    name="vehseqno"
                    type="radio"
                    onChangehandler={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => updatedValue(event, item?.key)}
                  />
                </div>
              </div>
              <hr className="vehicleseq-splitter" />
              <div className="row d-flex align-items-center">
                <div className="col-xs-12 col-md-6">
                  <ThemeTextbox
                    name={item?.txtboxname}
                    placeholder={item?.txtplaceholder}
                    type="text"
                  />
                </div>
                <div className="col-xs-12 col-md-6">
                  <ThemeButton
                    classes=""
                    isDisabled={true}
                    title={item?.txtbuttontext}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}
export default VehicleSeqInformation;
