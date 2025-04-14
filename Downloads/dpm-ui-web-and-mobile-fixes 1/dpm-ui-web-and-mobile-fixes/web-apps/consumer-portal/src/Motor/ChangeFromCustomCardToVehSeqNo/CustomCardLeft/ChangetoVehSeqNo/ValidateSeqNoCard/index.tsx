import ThemeButton from "components/ThemeComponents/ThemeButton";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { Card, Spinner } from "react-bootstrap";
import Nissan from "assets/Endorsement/png/Nissan.png";
import Mercedes from "assets/Endorsement/png/Mercedes.png";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useContext, useState } from "react";
import { DataContext } from "../../../../../DataContext";
import React from "react";

interface IValidateSeqNoCard {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: Object[];
}

const ValidateSeqNoCard = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
}: IValidateSeqNoCard) => {
  // fn that returns vehicle icn as per their manufacturer
  function icnfactory(name: string) {
    switch (name) {
      case "nissan":
        return Nissan;
      case "mercedes":
        return Mercedes;
    }
  }
  //cms content
  let Data = useContext(DataContext);
  return (
    <div className="px-4 mx-2">
      {customCardData?.map((item, key) => {
        return (
          item?.vehicleCustomID && (
            <Card className="right-card h-auto mb-2" key={key}>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-4 pe-0 d-flex align-items-center">
                  <div className="row">
                    <div className="col-xs-12 col-md-3 pe-0">
                      <img src={icnfactory("nissan")} alt="nissan" />
                    </div>
                    <div className="col-xs-12 col-md-8 px-0">
                      <div className="row">
                        <div className="col d-flex justify-content-end">
                          <TypographyAndIcon text={Data?.custom_card_no} />
                        </div>
                        <div className="col ps-4">{item?.vehicleCustomID}</div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-1 px-0 d-flex align-items-center">
                      <ArrowForwardIcon />
                    </div>
                  </div>
                </div>
                <div  className="col-xs-12 col-sm-12 col-md-5 px-0 d-flex align-items-center justify-content-end">
                  <ThemeTextbox
                    dataTestId="vehicleSeqNo-id"
                    name="VehicleSeqNo"
                    placeholder={Data?.enter_vehicle_sequence_no}
                    type="number"
                    onChangehandler={changeHandler}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 pe-0">
                  <span data-testid="validateSeqNoCard-dataHandler" onClick={() => fullDataHandler(item?.vehicleCustomID)}>
                    <ThemeButton
                      title={Data?.validate_sequence_no}
                      isDisabled={isValidateSeqBtnDisable}
                      classes=""
                      // onClickhandler={clickHandler}
                    />
                  </span>
                </div>
              </div>
            </Card>
          )
        );
      })}
    </div>
  );
};

export default ValidateSeqNoCard;
