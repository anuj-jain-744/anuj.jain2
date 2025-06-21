import { Card } from "react-bootstrap";
import ThemeRadioCheckbox from "../../components/ThemeRadioCheckbox";
import ThemeTextbox from "../../components/ThemeTextbox";
import { useContext, useState } from "react";
import { DataContext } from "../../../DataContext";
import TypographyAndIcon from "../../components/TypographyAndIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";

type CompensatetypeType = {
  onChangehandler: (e: React.FormEvent<HTMLDivElement>) => void;
  onBlurhandler?: (event: React.FocusEvent<HTMLInputElement>) => void;
  responseData: any;
  isBank: boolean;
  isDamage: boolean;
  showIcon: boolean;
  compensateError: any;
};

function CompensateType(
  {
    onChangehandler,
    onBlurhandler,
    responseData,
    isBank,
    isDamage,
    showIcon,
    compensateError
  }: CompensatetypeType,
  data: any
) {
  const [compensateType, setCompensatetype] = useState<null | string>(null);
  const [isLiabilityCorr, setLiability] = useState<boolean>(false);
  // const [showIcon, setIconhandler] = useState<boolean>(false);

  //change handler return accept fn
  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "Yes") {
      setLiability(true);
    } else if (value === "Damage Repairs" || "Bank Transfer") {
      setCompensatetype(value);
    } else setLiability(false);
  };
  //cms content
  const Data = useContext(DataContext);

 

  return (
    <div className="register-compensate" onChange={onChangehandler}>
      <Card className="register-compensate-card register-row-spacing-top">
        <Card.Body className="p-0">
          <div className="flex flex-col">
            <div className="register-compensate-title walaa-medium-500">
              {Data.compensation_type}
            </div>
            <div className="register-row-spacing-top register-row-spacing-bottom">
              <ThemeRadioCheckbox
                label={Data?.bank_transfer}
                type="radio"
                defaultChecked={isBank ? true : false}
                classes="register-compensate-radio radio-check-cust walaa-regular-400"
                onChangehandler={updatedValue}
              />
              <ThemeRadioCheckbox
                label={Data?.damage_repair}
                type="radio"
                defaultChecked={isDamage ? true : false}
                classes="register-compensate-radio radio-check-cust walaa-regular-400"
                onChangehandler={updatedValue}
              />
            </div>
            <hr className="register-compensate-splitter" />
            <div className="row">
              <div className="col-sm">
                <div
                  className="register-compensate-estimate border border-top-0
                border-bottom-0
                 border-start-0 border-color-cust"
                >
                  <div className="register-compensate-estimate-title walaa-regular-400">
                    {Data?.estimated_amount}
                  </div>
                  <div className="register-compensate-estimate-value walaa-medium-500">
                    SAR {responseData?.estimatedAmount}
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <div className="row">
                  <div className="col-md">
                    <div className="register-compensate-estimate">
                      <div className="register-compensate-estimate-title walaa-regular-400">
                        {Data?.walaa_liability}
                      </div>
                      <div className="register-compensate-estimate-value walaa-medium-500">
                        {responseData?.liability}%
                      </div>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="register-compensate-estimate">
                      <div className="register-compensate-estimate-title walaa-regular-400 fw-medium">
                        {Data?.is_walaa_liability_correct}
                      </div>
                      <div className="register-compensate-estimate-value walaa-medium-500">
                        No{" "}
                        <ThemeRadioCheckbox
                          label="Yes"
                          type="switch"
                          defaultChecked={false}
                          classes="register-compensate-radio radio-check-cust"
                          onChangehandler={updatedValue}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="register-compensate-splitter" />
          </div>
          {/* commented as per review need to future */}
          {/* {compensateType === "Damage Repairs" && (
            <div>
              <div className="row">
                <div className="col register-compensate-estimate-large-title walaa-medium-500 register-row-spacing-bottom">
                  Select the Garage for Repairs
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-6">
                  <div className="register-compensate-estimate-small-value walaa-regular-400">
                    <div>
                    <TypographyAndIcon
                      text='City'
                      required={true}
                    />
                    </div>
                    <div className="walaa-regular-400 title">
                      <ThemeSelect />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-6">
                  <div className="register-compensate-estimate-small-value walaa-regular-400 register-row-spacing-bottom">
                    <div>
                    <TypographyAndIcon
                      text='Garage'
                      required={true}
                    />
                    </div>
                    <div className="walaa-regular-400 title">
                      <ThemeSelect />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <div className="register-compensate-estimate">
                <div className="register-compensate-estimate-large-title walaa-medium-500 register-row-spacing-bottom">
                  {Data?.kindly_provide_your_iban}
                </div>
                <div className="register-compensate-estimate-small-value walaa-regular-400">
                  <div>
                    <TypographyAndIcon text="IBAN Number" required={true} />
                  </div>
                  <div className="walaa-regular-400 title d-flex align-items-center">
                    <ThemeTextbox
                      name="IBan"
                      placeholder={Data?.placeholder_enter_iban_num}
                      type="text"
                      maxLengthIs={24}
                      onBlurhandler={onBlurhandler}
                      errorValue={compensateError.iBan}
                    />
                    {showIcon && (
                      <span className="m-2">
                        <CheckCircleIcon sx={{ color: "green" }} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CompensateType;
