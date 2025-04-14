import ThemeSelect from "components/ThemeSelect";
import { DataContext } from "../../../../../../DataContext";
import ModalDialogBox from "Motor/Claims/Comprehensive/Components/ModalDialogBox";
import React, { useContext, useEffect, useState } from "react";
import { Card, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import UploadDocss from "./UploadDocss";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { useApiCall } from "@dpm/shared-module";
import ThemeMultiSelect from "components/ThemeMultiSelect";
import {
  WORKSHOP,
  CITY,
  comprehensiveOD,
  comprehensiveTP,
  CURRENCY,
  SELECTED,
} from "../../../../../../constant";
import { Bounce, toast } from "react-toastify";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";
interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}
interface IClaimDetails {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  liabilitySelected: number;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeHandlerFiles: (data: any) => void;
  isMandatoryFileUploaded: (isFileExist: boolean) => void;
  updateHandler: (value?: string | number) => void;
  updateHandlerWorkshop: (
    value?: string | null | [] | { id: number; name: string }[],
    name?: string
  ) => void;
  validationData: any;
  claimCheckData: any;
  claimsInfo: {
    refNo: string;
    ownerId: string;
    SourceType: number;
    type: typeof comprehensiveOD | typeof comprehensiveTP;
    mailPhone: string;
  };
  type: string;
  isEstimatedAmountData: string | number | null | undefined;
}

//city interface for city list
interface City {
  cityCode: number;
  cityNameEn: string;
}
//api response interface for city,garage list
interface CityWorkshopRepairList {
  cityCode: number;
  cityNameEn: string;
  repairWorkshopList: string[];
}

const ClaimDetails = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  liabilitySelected,
  changeHandler,
  changeHandlerFiles,
  isMandatoryFileUploaded,
  updateHandler,
  updateHandlerWorkshop,
  validationData,
  claimCheckData,
  claimsInfo,
  type,
  isEstimatedAmountData,
}: IClaimDetails) => {
  // Adding this hard-coding values as per discussion with @Shamim/@Binoy/@Salman, later this value will come from API need to remove this piece!!!
  // default Estimated Amount by Claims - Category
  const EstimatedAmountOD: number = 8000;
  const EstimatedAmountTP: number = 15000;
  //error state handler
  const [compensateError, setCompensateError] = useState({
    estimatedAmount: "",
  });

  const [selected, setSelected] = useState(liabilitySelected);

  // workshop repair dropdown data
  //city list response data
  const [cityData, setCityData] = useState<
    null | { id: number; name: string }[]
  >(null);

  // selected city garage list data
  const [garageData, setGarageData] = useState<
    null | { id: number; name: string }[]
  >(null);
  // selected city
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // selected garage
  const [selectedGarage, setSelectedGarage] = useState<
    null | { id: number; name: string }[]
  >(null);

  // isNajm Case
  const [isNajmCase, setIsNajmCase] = useState<boolean>(false);

  //upload fileData state
  const [fileData, setFileData] = useState<(FileData | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    selected == 2 ? setShow(true) : setShow(false);
  }, [selected]);

  //modal window state
  const [isModal, setShow] = useState<boolean>(false);
  //modal dialog handler functions
  const handleClose = () => setShow(false);

  //cms content
  const Data = useContext(DataContext);

  //call api for getting the data for workshop repair
  //api call
  const { isLoading, data, errors, makeApiCall } = useApiCall(
    15,
    "/Motor/claim/V1/GetCityWorkshopRepairList",
    "get"
  );

  //change handler(select city) return accept fn
  const changeSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, options } = event.target;
    //prepare list of garages for that city selected
    let garageObj: { id: number; name: string } | {} = {};
    // update garage data
    if (value !== null) {
      // set the selected city to the state
      setSelectedCity(value?.toString());
      if(value === SELECTED) {
        // reset the garage data, city and selected garage to null
        setGarageData(null);
        setSelectedGarage(null);
        setSelectedCity(null);
        return;
      }
      let garagearray = null;
      // get the city data from the api response
      const cityData = data as CityWorkshopRepairList[];
      // map over the data and get the garage list for the selected city
      cityData?.map((city) => {
        if (city?.cityNameEn === value) {
          garagearray = city.repairWorkshopList;
          garageList(garagearray);
        }
      });
    }
    //prepare garage list data fn for select garage dropdown
    function garageList(workshoplist: string[]) {
      garageObj = workshoplist.map((name, index) => ({
        id: index + 1,
        name: name,
      }));
      setGarageData(garageObj as []);
    }
  };

  // city list data preparation from api response fn
  const cityList = (data: City[]) => {
    let cityArr: { id: number; name: string }[] = [];
    // iterate over the data and prepare the city list for select dropdown
    data?.map((city) => {
      cityArr.push({
        id: city.cityCode,
        name: city.cityNameEn,
      });
    });
    setCityData(cityArr);

    // check if the city default value is matching with the data
    if (type === comprehensiveTP && cityArr?.find((item) => item?.name === claimCheckData?.city)) {
      setSelectedCity(claimCheckData?.city);
    } else {
      setSelectedCity(null);
    }
  };

  //city list data preparation from api response when api call is success and data is available
  useEffect(() => {
    cityList(data as City[]);
  }, [data, isLoading]);

  //change handler return accept fn
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { name, value } = event.target as HTMLInputElement;

    if (name === "estimatedAmount") {
      // validation for estimatedAmount
      let EstAmount: number = Number(value);
      //comprehensive
      if (type === comprehensiveOD) {
        if (EstAmount !== EstimatedAmountOD) {
          setCompensateError({
            ...compensateError,
            estimatedAmount: "Not Valid Amount",
          });
          updateHandler(value);
        } else {
          setCompensateError({
            ...compensateError,
            estimatedAmount: "",
          });
          updateHandler(value);
        }
      }
      //third-party
      else {
        // Regular expression to match numbers with up to two decimal places
        const regex = /^\d*\.?\d{0,2}$/;
        if (compensateError?.estimatedAmount !== "") {
          updateHandler("");
          setCompensateError({
            ...compensateError,
            estimatedAmount: "",
          });
          toast.error(Data?.field_limit_breached_clearing_to, {
            icon: <WarningAmberOutlinedIcon />,
            className: "error-cust",
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          return;
        } else {
          if (regex.test(value.toString())) {
            updateHandler(value);
          } else {
            setCompensateError({
              ...compensateError,
              estimatedAmount: `${Data?.not_valid_amount_estimated} ${EstimatedAmountTP}`,
            });
            updateHandler(value);
          }
        }
      }
    }
  };

  //change handler callback to send selected garage and city to parent component
  useEffect(() => {
    updateHandlerWorkshop(selectedGarage, WORKSHOP);
    updateHandlerWorkshop(selectedCity, CITY);
  }, [selectedGarage, selectedCity]);

  //change handler final data fn
  const garageListFinalData = (
    data: null | [] | { id: number; name: string }[]
  ) => {
    updateHandlerWorkshop(data, WORKSHOP);
    setSelectedGarage(data);
  };

  const EstimateAmount: string = `${Data?.estimated_amount} (${CURRENCY})`;

  // send back fileData to parent component
  useEffect(() => {
    changeHandlerFiles(fileData);
    (fileData && fileData[0] !== null) &&
    changeHandler({
      target: { name: "mandatoryLiabilityFileUploaded", value: "LiabilityFileUpload" },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [fileData]);

  // api call for getting the city and garage list
  useEffect(() => {
    makeApiCall();
  }, []);

  // remove mandatory files
  const removeMandatFiles = (params: { name: string; value: string }) => {
    changeHandler({
      target: { name: params.name, value: params.value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // check if the user is authenticated
  const isAuthenticated= useSelector((state: RootState) => state.auth?.isAuthenticated);

  // check if the first two characters of the claim reference number are alphabets to check Najm case
  useEffect(() => {
    const areFirstTwoCharactersAlphabets = (input: string): boolean => {
      // Regular expression to check if the first two characters are alphabets
      const regex = /^[A-Za-z]{2}/;
      return regex.test(input);
    };
    setIsNajmCase(areFirstTwoCharactersAlphabets(claimsInfo?.refNo?.substring(0, 2)));
  }, []);

  return (
    <React.Fragment>
      {/* for comprehensive */}
      {type === comprehensiveOD ? (
        <React.Fragment>
          {(validationData?.estimatedAmount ||
          validationData?.liability ||
          (isAuthenticated && claimCheckData?.estimatedAmount) ||
          (isAuthenticated && claimCheckData?.liability)) && !isNajmCase ? (
            <React.Fragment>
              {/* since there is data show liability with yes/no */}
              <div className="px-4 mx-2">
                <Card className="right-card h-auto">
                  <div className="header">
                    <div className="header-content">
                      <div className="content">
                        <div className="walaa-medium-500 policy-number">
                          {Data?.liability_details}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="date">
                <React.Fragment>
                  <div className="row d-flex flex-column">
                    <div className="col walaa-regular-400">
                      <TypographyAndIcon
                        text={Data?.your_qualified_of_estimate}
                        required={true}
                      />
                    </div>
                    <div className="col walaa-medium-500">
                          {validationData?.liability ||
                            claimCheckData?.liability}
                    </div>
                  </div>
                  <hr className="horizontal-line" />
                  <div className="row d-flex flex-column">
                    <div className="col walaa-regular-400">
                      {Data?.do_you_agree}
                    </div>
                    <div className="col radio-button-group-container">
                      <ToggleButtonGroup
                        type="radio"
                        name="options"
                        defaultValue={true}
                        className="radio-button-group-cust"
                      >
                        <ToggleButton
                          id="tbg-radio-1"
                          value={1}
                          onClick={() => setSelected(1)}
                          onChange={changeHandler}
                          className={
                            selected === 1 ? "selected" : "not-selected"
                          }
                        >
                          {Data?.yes}
                        </ToggleButton>
                        <ToggleButton
                          id="tbg-radio-2"
                          value={2}
                          onClick={() => setSelected(2)}
                          onChange={changeHandler}
                          className={
                            selected === 2
                              ? "selected selected-2"
                              : "not-selected"
                          }
                        >
                          &nbsp;{Data?.no}&nbsp;
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                </React.Fragment>
                  </div>
                </Card>
                {/* upload documents */}
                {((type === comprehensiveOD && selected === 2) || isModal) && (
                  <div className="container uploadAccordion px-4">
                    <UploadDocss
                      fileData={fileData}
                      setFileData={setFileData}
                      languageData={Data || {}}
                    />
                  </div>
                )}
              </div>
              {/* card for city list and garage list */}
              <React.Fragment>
              <div className="px-4 mx-2">
                  <Card className="right-card h-auto">
                    <div className="header">
                      <div className="header-content">
                        <div className="content">
                          <div className="walaa-medium-500 policy-number">
                            {Data?.workshop_repair}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="date w-100">
                      <div className="row d-flex w-100">
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.city}`}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeSelect
                                name=""
                                data={cityData}
                                isLoading={isLoading}
                                onChangehandler={changeSelectHandler}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={Data?.select_workshop_max_3}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeMultiSelect
                                placeholder={
                                  Data?.select_workshop_max_3 as string
                                }
                                selectionLimit={3}
                                showCheckbox={true}
                                data={garageData}
                                isLoading={isLoading}
                                // final data change handler
                                changeHandler={garageListFinalData}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </React.Fragment>
            </React.Fragment>
              ) : (
                <React.Fragment>
              {/* as no data show select for city and garage with upload */}
              {(isDamageRepairSelected || type === comprehensiveOD) && (
                <div className="px-4 mx-2">
                  <Card className="right-card h-auto">
                    <div className="header">
                      <div className="header-content">
                        <div className="content">
                          <div className="walaa-medium-500 policy-number">
                            {Data?.workshop_repair}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="date w-100">
                      <div className="row d-flex w-100">
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.city}`}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeSelect
                                name=""
                                data={cityData}
                                isLoading={isLoading}
                                onChangehandler={changeSelectHandler}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={Data?.select_workshop_max_3}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeMultiSelect
                                placeholder={
                                  Data?.select_workshop_max_3 as string
                                }
                                selectionLimit={3}
                                showCheckbox={true}
                                data={garageData}
                                isLoading={isLoading}
                                // final data change handler
                                changeHandler={garageListFinalData}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* upload documents */}
                  {(validationData?.estimatedAmount === null &&
                    validationData?.liability?.length === 0) ||
                  (isAuthenticated &&
                    claimCheckData?.estimatedAmount === null &&
                    isAuthenticated &&
                    claimCheckData?.liability?.length === 0 &&
                    type === comprehensiveOD) 
                    || type === comprehensiveOD && isNajmCase 
                    ? (
                    <div className="container uploadAccordion px-4">
                      <UploadDocss
                        fileData={fileData}
                        setFileData={setFileData}
                        languageData={Data || {}}
                      />
                    </div>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}
                </div>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* for third party */}
          {validationData?.estimatedAmount ||
          (isAuthenticated && claimCheckData?.estimatedAmount) ? (
            <React.Fragment>
              {/* since there is data show Estimated amount only without yes/no */}
              <div className="px-4 mx-2">
                <Card className="right-card h-auto">
                  <div className="header">
                    <div className="header-content">
                      <div className="content">
                        <div className="walaa-medium-500 policy-number">
                          {Data?.liability_details}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex flex-column w-75">
                    <div className="col walaa-regular-400">
                      <TypographyAndIcon
                        text={EstimateAmount}
                        required={true}
                      />
                    </div>
                    <div className="col walaa-medium-500 estimated-amount-title">
                      {type === comprehensiveTP &&
                        (validationData?.estimatedAmount ||
                          (isAuthenticated &&
                            claimCheckData?.estimatedAmount))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* specific to Damage Repair selected */}
              {(isDamageRepairSelected || type === "OD") && (
                <div className="px-4 mx-2">
                  <Card className="right-card h-auto">
                    <div className="header">
                      <div className="header-content">
                        <div className="content">
                          <div className="walaa-medium-500 policy-number">
                            {Data?.workshop_repair}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="date w-100">
                      <div className="row d-flex w-100">
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.city}`}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeSelect
                                name=""
                                data={cityData}
                                isLoading={isLoading}
                                onChangehandler={changeSelectHandler}
                                defaultValue={claimCheckData?.city}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.workshop_repair}`}
                                required={true}
                              />
                            </div>
                            <div className="col">
                              <ThemeMultiSelect
                                placeholder={`${Data?.select} ${Data?.workshop_repair}`}
                                selectionLimit={1}
                                showCheckbox={true}
                                data={garageData}
                                isLoading={isLoading}
                                // final data change handler
                                changeHandler={garageListFinalData}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* as no data show enter for user with upload */}
          <div className="px-4 mx-2">
            <Card className="right-card h-auto">
              <div className="header">
                <div className="header-content">
                  <div className="content">
                    <div className="walaa-medium-500 policy-number">
                      {Data?.liability_details}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row d-flex flex-column w-75">
                <div className="col walaa-regular-400">
                  <TypographyAndIcon
                    text={EstimateAmount}
                    required={true}
                  />
                </div>
                <div className="col walaa-medium-500 estimated-amount-title">
                  {type === comprehensiveTP && (
                    <ThemeTextbox
                      name="estimatedAmount"
                      placeholder={Data?.estimated_amount}
                      type="text"
                      value={
                        typeof isEstimatedAmountData === "boolean"
                          ? ""
                          : (isEstimatedAmountData as unknown as string)
                      }
                      onChangehandler={updatedValue}
                      errorValue={compensateError.estimatedAmount}
                    />
                  )}
                </div>
              </div>
            </Card>
            {/* upload documents */}
            {(((validationData?.estimatedAmount === null ||
              claimCheckData?.estimatedAmount === null) &&
              type === comprehensiveTP) ||
              isModal) && (
              <div className="container uploadAccordion px-4">
                <UploadDocss
                  fileData={fileData}
                  setFileData={setFileData}
                  languageData={Data || {}}
                  onMandatoryFileRemoved={removeMandatFiles}
                />
              </div>
            )}
          </div>

      {/* specific to Damage Repair selected */}
      {(isDamageRepairSelected || type === "OD") && (
        <div className="px-4 mx-2">
          <Card className="right-card h-auto">
            <div className="header">
              <div className="header-content">
                <div className="content">
                  <div className="walaa-medium-500 policy-number">
                    {Data?.workshop_repair}
                  </div>
                </div>
              </div>
            </div>

            <div className="date w-100">
              <div className="row d-flex w-100">
                <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                  <div className="row d-flex flex-column">
                    <div className="col">
                      <TypographyAndIcon
                        text={`${Data?.select} ${Data?.city}`}
                        required={true}
                      />
                    </div>
                    <div className="col">
                      <ThemeSelect
                        name=""
                        data={cityData}
                        isLoading={isLoading}
                        onChangehandler={changeSelectHandler}
                        defaultValue={claimCheckData?.city}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                  <div className="row d-flex flex-column">
                    <div className="col">
                      <TypographyAndIcon
                        text={`${Data?.select} ${Data?.workshop_repair}`}
                        required={true}
                      />
                    </div>
                    <div className="col">
                      <ThemeMultiSelect
                          placeholder={`${Data?.select} ${Data?.workshop_repair}`}
                          selectionLimit={1}
                          showCheckbox={true}
                          data={garageData}
                          isLoading={isLoading}
                          // final data change handler
                          changeHandler={garageListFinalData}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
              </div>
            )}
          </React.Fragment>
        )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ClaimDetails;