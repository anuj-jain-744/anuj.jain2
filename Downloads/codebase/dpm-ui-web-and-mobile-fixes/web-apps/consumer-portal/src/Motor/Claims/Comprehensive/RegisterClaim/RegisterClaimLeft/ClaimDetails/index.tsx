import ThemeSelect from "components/ThemeSelect";
import { DataContext } from "../../../../../../DataContext";
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
  OTHERS_CASE_SOURCE_TYPE,
  lossDate,
  taqderr,
  lossType,
  estAmountOthers,
  OTHERS_LIABILITY_PER,
  CLAIM_CASES,
} from "../../../../../../constant";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import OtherCase from "./OtherCase";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";
import { isValidEstimateAmount } from "@dpm/shared-module";
import { formatedAmountToDisplay } from "@dpm/shared-module";
import { useMatchDocument } from "Motor/ClaimHooks/useMatchDocument";
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
  updateHandler: (value?: string | number, name?: string) => void;
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
  isOthersCase?: number;
  isEstimatedAmountData: string | number | null | undefined;
  lossDescription?: string;
  othersClaimInfo?: OthersClaimInfo;
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
type UploadFileEntry = {
  key: string;
  value: string;
  required: boolean;
  file?: File;
};
const formatNumberForDisplay = (value: string): string => {
  const numericValue = value.replace(/,/g, "");
  const numberValue = parseFloat(numericValue);

  if (isNaN(numberValue)) {
    return value;
  }

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
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
  isOthersCase,
  isEstimatedAmountData,
  lossDescription,
  othersClaimInfo,
}: IClaimDetails) => {
  // Adding this hard-coding values as per discussion with @Shamim/@Binoy/@Salman, later this value will come from API need to remove this piece!!!
  // default Estimated Amount by Claims - Category
  const EstimatedAmountOD: number = 8000;
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

  // for others case
  //taqdeer error state handler
  const [taqdeerError, setTaqdeerError] = useState({
    taqdeerNo: "",
  });

  //upload fileData state
  const [fileData, setFileData] = useState<(FileData | null)[]>([null]);
  const [matchDocList, setMatchDocList] = useState<UploadFileEntry[]>([]);

  useEffect(() => {
    selected == 2 ? setShow(true) : setShow(false);
  }, [selected]);

  //modal window state
  const [isModal, setShow] = useState<boolean>(false);
  //modal dialog handler functions

  // estimate value denominator conversion
  const [estAmountUpdate, setEstAmountUpdate] = useState<
    string | number | null
  >(null);

  //cms content
  const Data = useContext(DataContext);

  //call api for getting the data for workshop repair
  //api call
  const { isLoading, data, makeApiCall } = useApiCall(
    15,
    "/Motor/claim/V1/GetCityWorkshopRepairList",
    "get"
  );
  const garageList = (workshoplist: string[]) => {
    //prepare list of garages for that city selected
    let garageObj: { id: number; name: string } | {} = {};

    //prepare garage list data fn for select garage dropdown
    garageObj = workshoplist.map((name, index) => ({
      id: index + 1,
      name: name,
    }));
    setGarageData(garageObj as []);
  };

  //change handler(select city) return accept fn
  const changeSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    // update garage data
    if (value !== null) {
      // set the selected city to the state
      setSelectedCity(value?.toString());
      if (value === SELECTED) {
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
        if (
          city?.cityNameEn?.toLocaleLowerCase() === value?.toLocaleLowerCase()
        ) {
          garagearray = city.repairWorkshopList;
          garageList(garagearray);
        }
      });
    }
  };

  // city list data preparation from api response fn
  const cityList = (data: City[]) => {
    const cityArr: { id: number; name: string }[] = [];
    // iterate over the data and prepare the city list for select dropdown
    data?.map((city) => {
      cityArr.push({
        id: city.cityCode,
        name: city.cityNameEn.toUpperCase(),
      });
    });
    setCityData(cityArr);

    // check if the city default value is matching with the data
    if (
      cityArr?.find(
        (item) =>
          item?.name.toLocaleLowerCase() ===
          validationData?.city?.toLocaleLowerCase()
      )
    ) {
      setSelectedCity(validationData?.city?.toString()?.toUpperCase());
      // update garage data matching with city
      const cityData = data as CityWorkshopRepairList[];
      // map over the data and get the garage list for the selected city
      cityData?.map((city) => {
        if (
          city?.cityNameEn?.toLocaleLowerCase() ===
          validationData?.city?.toLocaleLowerCase()
        ) {
          const garagearray = city.repairWorkshopList;
          garageList(garagearray);
        }
      });
    } else {
      setSelectedCity(null);
    }
  };

  //city list data preparation from api response when api call is success and data is available
  useEffect(() => {
    cityList(data as City[]);
  }, [data, isLoading]);

  const validateAmount = (value: string, name: string) => {
    setCompensateError({
      ...compensateError,
      estimatedAmount: "",
    });
    const valueSanitized =
      value.length === 1 && value === "."
        ? value.replace(/[.]/g, "")
        : value.trim();
    const input = valueSanitized.replace(/,/g, ""); // Remove commas
    if (isValidEstimateAmount(input)) {
      setCompensateError({
        ...compensateError,
        estimatedAmount: "",
      });
      updateHandler(input, name);
      setEstAmountUpdate(input);
    } else {
      updateHandler("");
      setEstAmountUpdate("");
      setCompensateError({
        ...compensateError,
        estimatedAmount: NOT_VALID_AMOUNT,
      });
      return;
    }
  };

  //change handler return accept fn
  const validationForEstimatedAmount = (value: string): void => {
    const EstAmount: number = Number(value);
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
      validateAmount(value, "");
    }
  };
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { name, value } = event.target as HTMLInputElement;

    if (name === "estimatedAmount") {
      // validation for estimatedAmount
      validationForEstimatedAmount(value);
    }
    // Other case
    // for taqdeer
    else if (name === taqderr) {
      const taqdeerRegex = /^[0-9]+$/; // Regular expression to match only numbers
      taqdeerRegex.test(value) && value?.length <= 15
        ? setTaqdeerError({ ...taqdeerError, taqdeerNo: "" })
        : setTaqdeerError({
            ...taqdeerError,
            taqdeerNo: Data?.Invalid_taqdeer_number as string,
          });
      updateHandler(value, name);
    }
    // estimated amount for others
    else if (name === estAmountOthers) {
      // validation for estimatedAmount for others
      validateAmount(value, name);
    }
    // Loss type for others
    // Loss description for others
    else if (
      name === lossType ||
      name === Data?.description_of_loss ||
      name === OTHERS_LIABILITY_PER
    ) {
      updateHandler(value === SELECTED ? "" : value, name);
    }
    // for city others
    else if (name === CITY) {
      changeSelectHandler({
        target: {
          name: CITY,
          value: value,
        },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
    // for workshop others
    else if (name === WORKSHOP) {
      updateHandlerWorkshop(value, WORKSHOP);
      setSelectedGarage(value as unknown as { id: number; name: string }[]);
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
    fileData &&
      fileData[0] !== null &&
      changeHandler({
        target: {
          name: "mandatoryLiabilityFileUploaded",
          value: "LiabilityFileUpload",
        },
      } as React.ChangeEvent<HTMLInputElement>);
  }, [fileData]);

  // api call for getting the city and garage list
  useEffect(() => {
    makeApiCall();
  }, []);
  // --- Trigger on page load ---
  useEffect(() => {
    if (validationData?.city && data) {
      // Create a synthetic event to simulate a change event
      const syntheticEvent = {
        target: {
          value: validationData?.city,
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      changeSelectHandler(syntheticEvent);
    }
  }, [validationData?.city, data]);
  // remove mandatory files
  const removeMandatFiles = (params: { name: string; value: string }) => {
    changeHandler({
      target: { name: params.name, value: params.value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // check if the user is authenticated
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  // check if the first two characters of the claim reference number are alphabets to check Najm case
  useEffect(() => {
    const areFirstTwoCharactersAlphabets = (input: string): boolean => {
      // Regular expression to check if the first two characters are alphabets
      const regex = /^[A-Za-z]{2}/;
      return regex.test(input);
    };
    setIsNajmCase(
      areFirstTwoCharactersAlphabets(claimsInfo?.refNo?.substring(0, 2))
    );
  }, []);
  //set the selected city from validation data if available
  useEffect(() => {
    if (validationData?.city && data) {
      setSelectedCity(validationData?.city?.toString()?.toUpperCase());
    }
  }, [validationData?.city, data]);
  // change handler return for loss_date accept fn
  const lossDateHandler = (name: string, value: string) => {
    // for date of Loss
    if (name === lossDate) {
      updateHandler(value, name);
    }
  };
  
 const caseReportedType =  isNajmCase
 ? CLAIM_CASES?.NAJM_CASE?.toLocaleLowerCase()
 : CLAIM_CASES?.POLICE_CASE?.toLocaleLowerCase();
  const  getDocumentList   =  useMatchDocument({
    type,
    validationData,
    caseReportedType,
    Data,
  });
  useEffect(()=>{
    getDocumentList && getDocumentList.length > 0 && setMatchDocList(getDocumentList);
  },[getDocumentList]);
  
  return (
    <React.Fragment>
      {/* for comprehensive */}
      {type === comprehensiveOD && OTHERS_CASE_SOURCE_TYPE !== isOthersCase ? (
        <React.Fragment>
          {(validationData?.estimatedAmount ||
            validationData?.liability ||
            (isAuthenticated && claimCheckData?.estimatedAmount) ||
            (isAuthenticated && claimCheckData?.liability)) &&
          !isNajmCase ? (
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
                    <div className="col walaa-regular-400 col-label">
                      <TypographyAndIcon
                        text={Data?.your_qualified_of_estimate}
                        required={true}
                      />
                    </div>
                    <div className="col walaa-medium-500 col-value">
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
                {(((type === comprehensiveOD && selected === 2) || isModal) && (matchDocList && matchDocList.length>0)) && (
                  <div className="container uploadAccordion px-4">
                    <UploadDocss
                      fileData={fileData}
                      setFileData={setFileData}
                      languageData={Data || {}}
                      onMandatoryFileRemoved={removeMandatFiles}
                      claimRequestType={type}
                      matchDocList = {matchDocList || []}
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
                                defaultValue={selectedCity}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.workshop}`}
                                required={true}
                              />
                            </div>
                            <div
                              className={`${
                                Array.isArray(selectedGarage) &&
                                selectedGarage?.length > 0
                                  ? "show-no-placeholder col"
                                  : "col"
                              }`}
                            >
                              <ThemeMultiSelect
                                placeholder={`${Data?.select} ${Data?.workshop}`}
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
              </React.Fragment>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* as no data show enter for user */}
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
                                defaultValue={selectedCity}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                          <div className="row d-flex flex-column">
                            <div className="col">
                              <TypographyAndIcon
                                text={`${Data?.select} ${Data?.workshop}`}
                                required={true}
                              />
                            </div>
                            <div
                              className={`${
                                Array.isArray(selectedGarage) &&
                                selectedGarage?.length > 0
                                  ? "show-no-placeholder col"
                                  : "col"
                              }`}
                            >
                              <ThemeMultiSelect
                                placeholder={`${Data?.select} ${Data?.workshop}`}
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

                  {/* upload documents */}
                  {/* for isNajmCase & estimatedAmount null */}
                  {((isNajmCase && validationData?.estimatedAmount === null) && (matchDocList && matchDocList.length >0)) ? (
                    <React.Fragment>
                      <div className="container uploadAccordion px-4">
                        <UploadDocss
                          fileData={fileData}
                          setFileData={setFileData}
                          languageData={Data || {}}
                          claimRequestType={type}
                          onMandatoryFileRemoved={removeMandatFiles}
                          matchDocList = {matchDocList || []}
                        />
                      </div>
                    </React.Fragment>
                  ) : ((validationData?.estimatedAmount === null &&
                      validationData?.liability?.length === 0) ||
                    (isAuthenticated &&
                      claimCheckData?.estimatedAmount === null &&
                      isAuthenticated &&
                      claimCheckData?.liability?.length === 0 &&
                      type === comprehensiveOD) ||
                    (type === comprehensiveOD && isNajmCase)) && (matchDocList && matchDocList.length > 0) ? (
                    <div className="container uploadAccordion px-4">
                      <UploadDocss
                        fileData={fileData}
                        setFileData={setFileData}
                        languageData={Data || {}}
                        claimRequestType={type}
                        onMandatoryFileRemoved={removeMandatFiles}
                        matchDocList = {matchDocList || []}
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
        OTHERS_CASE_SOURCE_TYPE !== isOthersCase && (
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
                  {((type === comprehensiveTP || isModal) && (matchDocList && matchDocList.length > 0)) && (
                    <div className="container uploadAccordion px-4">
                      <UploadDocss
                        fileData={fileData}
                        setFileData={setFileData}
                        languageData={Data || {}}
                        onMandatoryFileRemoved={removeMandatFiles}
                        claimRequestType={type}
                        matchDocList = {matchDocList || []}
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
                                  defaultValue={selectedCity}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                            <div className="row d-flex flex-column">
                              <div className="col">
                                <TypographyAndIcon
                                  text={`${Data?.select} ${Data?.workshop}`}
                                  required={true}
                                />
                              </div>
                              <div className="col">
                                <div
                                  className={`${
                                    Array.isArray(selectedGarage) &&
                                    selectedGarage?.length > 0
                                      ? "show-no-placeholder col"
                                      : "col"
                                  }`}
                                >
                                  <ThemeMultiSelect
                                    placeholder={`${Data?.select} ${Data?.workshop}`}
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
                            placeholder={Data?.estimated_amount as string}
                            type="text"
                            value={estAmountUpdate as string}
                            onChangehandler={updatedValue}
                            errorValue={compensateError.estimatedAmount}
                            onBlurhandler={(event) =>
                              setEstAmountUpdate(
                                formatedAmountToDisplay(event?.target?.value)
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                  {/* upload documents */}
                  {((type === comprehensiveTP || isModal) && (matchDocList && matchDocList.length > 0)) && (
                    <div className="container uploadAccordion px-4">
                      <UploadDocss
                        fileData={fileData}
                        setFileData={setFileData}
                        languageData={Data || {}}
                        onMandatoryFileRemoved={removeMandatFiles}
                        claimRequestType={type}
                        matchDocList = {matchDocList || []}
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
                                  defaultValue={selectedCity}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                            <div className="row d-flex flex-column">
                              <div className="col">
                                <TypographyAndIcon
                                  text={`${Data?.select} ${Data?.workshop}`}
                                  required={true}
                                />
                              </div>
                              <div
                                className={`${
                                  Array.isArray(selectedGarage) &&
                                  selectedGarage?.length > 0
                                    ? "show-no-placeholder col"
                                    : "col"
                                }`}
                              >
                                <ThemeMultiSelect
                                  placeholder={`${Data?.select} ${Data?.workshop}`}
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
        )
      )}
      {/* for other case */}
      {isOthersCase === OTHERS_CASE_SOURCE_TYPE && (
        <OtherCase
          onChangehandler={updatedValue}
          errorValue={taqdeerError?.taqdeerNo}
          onLossDateChangehandler={lossDateHandler}
          estimateErrorValue={compensateError?.estimatedAmount}
          type={type}
          setFileData={setFileData}
          lossDescription={lossDescription}
          othersClaimInfo={othersClaimInfo}
          cityData={cityData}
          garageData={garageData}
          isDamageRepairSelected={isDamageRepairSelected}
          estAmountUpdate={estAmountUpdate}
          matchDocList = {matchDocList || []}
        />
      )}
      {/* for other case end */}
    </React.Fragment>
  );
};

export default ClaimDetails;
