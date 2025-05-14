import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  isValidInputRegex,
  iqmaIdNationalIdValidationOnBlur,
  sanitizeHtml,
  useApiCall,
} from "@dpm/shared-module";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Row, Col, Modal } from "react-bootstrap";
import SquareLoader from "../../../assets/QuoteAndBuy/square_loader.gif";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ValidateVehicle.scss";

import ThemeTextbox from "../../Policy-services/PoliciesCancellation/sharedComponent/ThemeTextbox";
import ThemeRadioCheckbox from "../../Policy-services/PoliciesCancellation/sharedComponent/ThemeRadioChexkbox";

// import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import {
  JAVA_API_ROUTES,
  MAX_CUSTOM_CARD_NUMBER,
  MAX_MODEL_YEAR,
  MAX_MODEL_YEAR_DIGIT,
  MAX_OWNER_ID,
  MAX_VEH_SEQUENCE_NUMBER,
  MIN_MODEL_YEAR,
  MIN_NUMBER_ZERO,
  MIN_VEH_SEQUENCE_NUMBER,
  
} from "../../../constant";
import { ThemeButton } from "components/index";
import { AlertBox } from "components/AlertBox";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import BuyProductHeading from "components/BuyProductHeading";
import { MakeModelImageResponse } from "../QuoteAndBuyContext";
import {
  DriverDetailsResponseData,
  VehicleDetailsResponseData,
} from "types/quoteAndBuy";
import useSaveRedisData from "hook/common/useSaveRedisData";
import { formatDOB } from "../hooks/useDriverDetails";

type inputName =
  | "sequenceNumber"
  | "ownerId"
  | "customCardNumber"
  | "modelYear";
interface InitialValueProps {
  [key: string]: string;
}

const initialValue: InitialValueProps = {
  sequenceNumber: "",
  ownerId: "",
  customCardNumber: "",
  modelYear: "",
};
// { driverId, dob: dateOfBirth, mainDriverInd, vehicleDefinitionType, vehicleId }
interface DriverDetailPayload {
  driverId: string;
  dob: string;
  mainDriverInd: string;
  vehicleDefinitionType: string;
  vehicleId: string;
}

interface VehicalDetailsProps {
  data: { [key: string]: string };
  setLeftStep: (val: number) => void;
}

const ValidateVehicle: React.FC<VehicalDetailsProps> = ({
  data,
  setLeftStep,
}) => {
  const {
    vehicleDetails,
    setVehicleDetails,
    vehicleDetailsResponseData,
    setVehicleDetailsResponseData,
    setMakeModelResponse,
    ownerDetailsResponseData,
    setOwnerDetailsResponseData,
    setDriverDetailsResponseData,
  } = useQuoteAndBuyContext();
  const [selectedRadio, setSelectedRadio] = useState<string>("vehi-seq");
  const [isToggleOn, setIsToggleOn] = useState<boolean>(true);
  const [payload, setPayload] = useState<InitialValueProps>(initialValue);
  // const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const [inputError, setInputError] = useState<InitialValueProps | null>(null);
  const [isDisabled, setIsdisabled] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [vehicleAPIData, setVehicleAPIData] = useState<{
    [key: string]: string;
  } | null>(null);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const location = useLocation();
  const propsData = location?.state?.data;
  const driverDetailsPayload = {
    driverId: propsData?.ownerId,
    dob: propsData?.ownerId?.startsWith("2")
      ? propsData?.ownerDetail?.ownerDobG
      : propsData?.ownerDetail?.ownerDobH,
    mainDriverInd: "Y",
    vehicleDefinitionType: "",
    vehicleId: "",
  };

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const { saveRedisData } = useSaveRedisData();

  const handleToggleClick = () => {
    setIsToggleOn((prev) => !prev);
    setPayload(initialValue);
    setInputError(null);
  };

  const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
    useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
      1,
      "consumerportal-config",
      "post",
      "en"
    );

  const {
    makeApiCall: driverApiCall,
    isLoading: isDriverLoading,
    errors: driverErrors,
    data: driverResponse,
  } = useApiCall<DriverDetailsResponseData, DriverDetailPayload>(
    2,
    "/Motor/QuoteAndBuy/V1/GetDriverDetails",
    "post"
  );

  const {
    makeApiCall,
    isLoading,
    errors,
    data: response,
  } = useApiCall<VehicleDetailsResponseData, InitialValueProps>(
    0,
    JAVA_API_ROUTES.getVehicleDetails,
    "post"
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.id);
    setPayload(initialValue);
    setInputError(null);
    setIsdisabled(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number,
    field: string
  ) => {
    const inputValue = e.target.value;

    if (isValidInputRegex(inputValue, MIN_NUMBER_ZERO, maxLength)) {
      setPayload((val) => ({ ...val, [field]: inputValue }));
    }
  };

  const handleInputBlur = (
    value: string | number,
    name: inputName | string
  ) => {
   
    const modelYear = parseInt(value as string, 10);
    const setError = (field: string, message: string) =>
      setInputError((val) => ({ ...(val || {}), [field]: message }));
    const clearError = () => setInputError(null);

    if (isToggleOn) {
      if (selectedRadio === "vehi-seq" && name === "sequenceNumber") {
        !isValidInputRegex(
          value,
          MIN_VEH_SEQUENCE_NUMBER,
          MAX_VEH_SEQUENCE_NUMBER
        )
          ? setError("sequenceNumber", data?.vehicle_seqcunce_invalid)
          : clearError();
      } else if (selectedRadio === "custom-card") {
        if (
          name === "customCardNumber" &&
          !isValidInputRegex(value, MAX_CUSTOM_CARD_NUMBER)
        ) {
          setError("customCardNumber", data?.custom_card_no_is_invalid);
        } else if (
          name === "modelYear" &&
          (!isValidInputRegex(value, MAX_MODEL_YEAR_DIGIT) ||
            modelYear < MIN_MODEL_YEAR ||
            modelYear > MAX_MODEL_YEAR)
        ) {
          setError("modelYear", data?.manufacture_year_invalid);
        } else {
          clearError();
        }
      }
    } else {
      if (
        name === "sequenceNumber" &&
        !isValidInputRegex(
          value,
          MIN_VEH_SEQUENCE_NUMBER,
          MAX_VEH_SEQUENCE_NUMBER
        )
      ) {
        setError("sequenceNumber", data?.vehicle_seqcunce_invalid);
      } else if (
        name === "ownerId" &&
        !isValidInputRegex(value, MAX_OWNER_ID)
      ) {
        setError(
          "ownerId",
          data?.invalid_dynamic_input.replace(
            "<DYNAMIC>",
            data?.owner_id_label
          ) || "ownerId"
        );
      } else {
        clearError();
      }
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    maxLength: number
  ) => {
    const inputValue = e.currentTarget.value;
    if (
      inputValue.length >= maxLength &&
      e.key !== "Backspace" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }
  };

  const isVehicleButtonDisabled = (
    isToggleOn: boolean,
    selectedRadio: string,
    payload: InitialValueProps
  ) => {
    const modelYear = parseInt(payload?.modelYear as string, 10);

    const isValidSequence = isValidInputRegex(
      payload?.sequenceNumber,
      MIN_VEH_SEQUENCE_NUMBER,
      MAX_VEH_SEQUENCE_NUMBER
    );

    const isValidCustomCard = isValidInputRegex(
      payload?.customCardNumber,
      MAX_CUSTOM_CARD_NUMBER
    );

    const isValidModelYear =
      isValidInputRegex(payload?.modelYear, MAX_MODEL_YEAR_DIGIT) &&
      modelYear >= MIN_MODEL_YEAR &&
      modelYear <= MAX_MODEL_YEAR;

    const isValidOwnerId =
      isValidInputRegex(payload?.ownerId, MAX_OWNER_ID) &&
      !iqmaIdNationalIdValidationOnBlur(payload?.ownerId);

    if (isToggleOn) {
      if (selectedRadio === "vehi-seq" && isValidSequence) return false;
      if (
        selectedRadio === "custom-card" &&
        isValidCustomCard &&
        isValidModelYear
      )
        return false;
    } else if (isValidSequence && isValidOwnerId) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    const data: InitialValueProps = {};
    Object.keys(payload).forEach((value: string) => {
      if (payload[value] !== "") {
        data[value] = payload[value];
      }
    });
    if (isToggleOn && selectedRadio === "vehi-seq") {
      data["ownerId"] = propsData?.ownerId;
    }

    if (data?.sequenceNumber) {
      setVehicleDetails({
        ...vehicleDetails,
        vehicleSequenceNo: data?.sequenceNumber,
        vehicleDefinitionType: "1",
      });
    } else if (data?.customCardNumber) {
      setVehicleDetails({
        ...vehicleDetails,
        vehicleCustomID: data?.customCardNumber,
        vehicleDefinitionType: "2",
      });
    }
    setVehicleAPIData(data);
    makeApiCall(data);
    (driverDetailsPayload.vehicleDefinitionType = data?.sequenceNumber
      ? "1"
      : "2"),
      (driverDetailsPayload.vehicleId = data?.sequenceNumber
        ? data?.sequenceNumber
        : data?.customCardNumber);
    driverDetailsPayload.dob = formatDOB(driverDetailsPayload.dob);
    driverApiCall(driverDetailsPayload);
  };

  useEffect(() => {
    const data = isVehicleButtonDisabled(isToggleOn, selectedRadio, payload);
    setIsdisabled(data);
  }, [payload, isToggleOn, selectedRadio]);

  useEffect(() => {
    if (!isToggleOn) {
      setSelectedRadio("vehi-seq");
    }
  }, [isToggleOn]);

  useEffect(() => {
    if (errors || driverErrors) {
      const errorData = errors ?? driverErrors;

      setApiErrorMessage({
        title: errorData?.name ?? "Internal Server Erroe",
        description: errorData?.messages?.message_en ?? "Something went wrong!",
      });
      setShowAlertModal(true);
    }
  }, [errors, driverErrors]);

  useEffect(() => {
    if (response && driverResponse) {
      setVehicleDetailsResponseData({
        ...vehicleDetailsResponseData,
        ...response,
      });
      if (vehicleAPIData) {
        saveRedisData("vehicleDetails", vehicleAPIData, 1);
      }
      setDriverDetailsResponseData((prevDrivers) => {
        const driverExists = prevDrivers.some(
          (driver) => driver.driverID === driverResponse.driverID
        );

        return driverExists ? prevDrivers : [...prevDrivers, driverResponse];
      });
      setLeftStep(1);
    }
  }, [driverResponse, response]);

  useEffect(() => {
    setIsdisabled(!isLoading || !isDriverLoading);
  }, [isLoading, isDriverLoading]);

  useEffect(() => {
    if (!isDisabled) {
      setInputError(null);
    }
  }, [isDisabled]);

  useEffect(() => {
    makeModelImageApiCall();
  }, []);

  useEffect(() => {
    if (modelImageResponse) {
      setMakeModelResponse(modelImageResponse?.motor_makes);
    }
  }, [modelImageResponse]);

  useEffect(() => {
    setOwnerDetailsResponseData({
      ...ownerDetailsResponseData,
      ...propsData?.ownerDetail,
      ownerId: propsData?.ownerId,
      mobileNumber: propsData?.mobileNumber,
    });
  }, [propsData]);

  return (
    <div className="vehical-detail-wrapper background-color-white">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />
      <Modal
        size="lg"
        show={isModal}
        centered
        onHide={() => {
          setIsModal(false);
        }}
        className="validate-vehicle"
      >
        <div className="actual-content">
        <Modal.Header
            closeButton
            className="d-flex justify-content-between"
          ></Modal.Header>
          {data?.vehicle_type_tooltip && (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(data?.vehicle_type_tooltip),
              }}
            ></div>
          )}
        </div>
      </Modal>

      <div className="vehical-detail-content">
        <BuyProductHeading heading={data?.vehicle_details} />
        {(isLoading || isDriverLoading) && (
          <div className="d-flex justify-content-center squareloaderContainer">
            <img className="squareloader" src={SquareLoader} alt="loader" />
          </div>
        )}
        {!isLoading && !isDriverLoading && (
          <div className="vehical-content">
            <div className="toggle-wrapper">
              <div className="product-toggle-wrapper-Ui-Tabs">
                <div className="product-toggle walaa-medium-500">
                  <div
                    data-testid="insurance-toggle"
                    className={isToggleOn ? "selected" : "default"}
                    onClick={handleToggleClick}
                  >
                    <span>{data?.buy_new_insurance_button}</span>
                  </div>

                  <div
                    data-testid="ownership-toggle"
                    className={!isToggleOn ? "selected" : "default"}
                    onClick={handleToggleClick}
                  >
                    <span>{data?.transfer_ownership_button}</span>
                  </div>
                </div>
              </div>
            </div>

            {isToggleOn && (
              <div className="vehical-radio-motor">
                <ThemeRadioCheckbox
                  datatestid="Vehical-radio"
                  label={data?.vehicle_sequence}
                  type="radio"
                  classes="rad"
                  name="radio"
                  id="vehi-seq"
                  onChangehandler={handleRadioChange}
                  value={data?.vehicle_sequence}
                  checked={selectedRadio === "vehi-seq"}
                />

                <InfoOutlinedIcon
                  onClick={() => setIsModal(true)}
                  className="tooltip-icon"
                  data-testid="infooutline-testid"
                />

                <ThemeRadioCheckbox
                  datatestid="custom-radio"
                  label={data?.custom_card_no}
                  type="radio"
                  classes="rad"
                  name="radio"
                  id="custom-card"
                  onChangehandler={handleRadioChange}
                  value={data?.custom_card_no}
                  disabled={!isToggleOn}
                  checked={selectedRadio === "custom-card"}
                />

                <InfoOutlinedIcon
                  onClick={() => setIsModal(true)}
                  className="tooltip-icon"
                  
                />
              </div>
            )}

            <div className="vehical-fields">
              <Row>
                {selectedRadio === "vehi-seq" && (
                 
                  <Col className="input-container">
                    <ThemeTextbox
                      dataTestId="vehical-sequence"
                      placeholder={data?.enter_vehicle_sequence_no}
                      name="sequenceNumber"
                      value={payload?.sequenceNumber}
                      onBlurHandler={handleInputBlur}
                      onChangehandler={(e) =>
                        handleInputChange(
                          e,
                          MAX_VEH_SEQUENCE_NUMBER,
                          "sequenceNumber"
                        )
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, MAX_VEH_SEQUENCE_NUMBER)
                      }
                      maxlength={MAX_VEH_SEQUENCE_NUMBER}
                    />
                    {inputError?.sequenceNumber && (
                      <p className="input-error">
                        {inputError?.sequenceNumber}
                      </p>
                    )}
                  </Col>
                )}

                {selectedRadio === "custom-card" && isToggleOn && (
                  <>
                    <Col className="input-container">
                      <ThemeTextbox
                        dataTestId="custom-card-input"
                        placeholder={data?.enter_custom_card_no}
                        name="customCardNumber"
                        value={payload?.customCardNumber}
                        onBlurHandler={handleInputBlur}
                        onChangehandler={(e) =>
                          handleInputChange(
                            e,
                            MAX_CUSTOM_CARD_NUMBER,
                            "customCardNumber"
                          )
                        }
                        onKeyPress={(e) =>
                          handleKeyPress(e, MAX_CUSTOM_CARD_NUMBER)
                        }
                        maxlength={MAX_CUSTOM_CARD_NUMBER}
                      />
                      {inputError?.customCardNumber && (
                        <p className="input-error">
                          {inputError?.customCardNumber}
                        </p>
                      )}
                    </Col>

                    <Col className="input-container">
                      <ThemeTextbox
                        dataTestId="manufature-year"
                        placeholder={data?.manufacturing_year}
                        name="modelYear"
                        value={payload?.modelYear}
                        onBlurHandler={handleInputBlur}
                        onChangehandler={(e) =>
                          handleInputChange(
                            e,
                            MAX_MODEL_YEAR_DIGIT,
                            "modelYear"
                          )
                        }
                        onKeyPress={(e) =>
                          handleKeyPress(e, MAX_MODEL_YEAR_DIGIT)
                        }
                        maxlength={MAX_MODEL_YEAR_DIGIT}
                      />
                      {inputError?.modelYear && (
                        <p className="input-error">{inputError?.modelYear}</p>
                      )}
                    </Col>
                  </>
                )}

                {!isToggleOn && (
                  <Col className="input-container">
                    <ThemeTextbox
                      dataTestId="owner-id"
                      placeholder={data?.enter_seller_id}
                      name="ownerId"
                      value={payload?.ownerId}
                      onBlurHandler={handleInputBlur}
                      onChangehandler={(e) =>
                        handleInputChange(e, MAX_OWNER_ID, "ownerId")
                      }
                      onKeyPress={(e) => handleKeyPress(e, MAX_OWNER_ID)}
                      maxlength={MAX_OWNER_ID}
                    />
                    {inputError?.ownerId && (
                      <p className="input-error">{inputError?.ownerId}</p>
                    )}
                  </Col>
                )}

                <Col>
                  <ThemeButton
                    dataTestId="retrive-button"
                    title={data?.retrieve_vehicle_details}
                    classes="validate-vehicle-btn"
                    variant="linked"
                    isDisabled={isDisabled && !isDriverLoading}
                    onClickhandler={handleSubmit}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidateVehicle;
