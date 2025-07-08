import React, { useMemo, useState } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import AccordionItem from "react-bootstrap/AccordionItem";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import Info from "../TravelerAddDetails/info";
import { InputCalendar } from "components/Calendar/inputCalendar";
import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown.tsx";
import ThemeTextbox from "../ThemeTextbox/ThemeTextbox";
import ThemeCheckButton from "../../../../corporate-portal/src/components/ThemeCheckButton";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import { DateObject } from "react-multi-date-picker";
import { toast } from "react-toastify";
import { sanitizeHtml, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { convertToBase64 } from "utils/fileUtil";
import { isValidAmountEdit } from "utils/quoteAndBuy";
import deleteIcon from "../../../src/claims/assets/svg/icons/Delete.svg";
import uploadIcon from "assets/IbanValidation/Upload.svg";
import pdfIcon from "assets/TrackYourClaim/pdfIcon.svg";
import cancelIcon from "assets/TrackYourClaim/Cancel.svg";
import approveIcon from "assets/QuoteAndBuy/Approve.svg";
import { taskConstants, validFileTypes } from "constant";
import "./style.scss";
import { LanguageData } from "types/languageData";

interface PropTypes {
  langData: LanguageData;
  travelerNames: Array<string>;
  policyData: {
    policyDetails?: {
      startDate?: string;
      expiryDate?: string;
    };
  };
  handleLossApi?: () => void;
  dateOfLoss: string;
  handleDateOfLoss: React.Dispatch<React.SetStateAction<string>>;
  estimations: Travel.ClaimEstimations;
  handleEstimations: React.Dispatch<
    React.SetStateAction<Travel.ClaimEstimations>
  >;
  isValidEstimation: boolean;
  place: string;
  handlePlace: React.Dispatch<React.SetStateAction<string>>;
  coverageInfoList: Travel.ClaimCoverageValues;
}

const fields = {
  cause: "codeId",
  amount: "amount",
  names: "names",
  desc: "desc",
  file: "files",
};

const TravelerEstimate = ({
  langData,
  travelerNames,
  policyData,
  handleLossApi,
  dateOfLoss,
  handleDateOfLoss,
  estimations,
  handleEstimations,
  isValidEstimation,
  place,
  handlePlace,
  coverageInfoList,
}: PropTypes) => {
  const [activeId, setActiveId] = useState<string>("");

  const dateRange = useMemo(() => {
    const result = {
      min: "",
      max: "",
    };
    const today = new DateObject();
    const startDate = new DateObject(policyData?.policyDetails?.startDate);
    let expiryDate = new DateObject(policyData?.policyDetails?.expiryDate);
    if (startDate.isValid === true) result.min = startDate.format("DD/MM/YYYY");
    if (expiryDate.isValid === true) {
      if (expiryDate > today) expiryDate = today;
      result.max = expiryDate.format("DD/MM/YYYY");
    }
    return result;
  }, [policyData]);

  const allCauses = useMemo(() => {
    const result = [];
    const coverageInfoItems = Object.fromEntries(
      coverageInfoList.map((item) => [item.coverageCode, item])
    );
    if (Array.isArray(langData.cause_of_loss) === true) {
      for (const item of langData.cause_of_loss) {
        if (coverageInfoItems[item.coverage_code] instanceof Object && coverageInfoItems[item.coverage_code].siLimit > 0) {
          result.push({
            ...item,
            coverageInfo: coverageInfoItems[item.coverage_code],
            label: item.value,
            value: item.coverage_code,
            subValues: Array.isArray(item.sub_values) ? item.sub_values : [],
          });
        }
      }
    }
    return result;
  }, [langData, coverageInfoList]);

  const causes = useMemo(() => {
    const result = {};
    const codeIds = estimations.map(({ codeId }) => codeId);
    const filteredCauses = allCauses.filter(
      ({ value }) => codeIds.includes(value) === false
    );
    codeIds.forEach((codeId, index) => {
      result[estimations[index].id] = filteredCauses.concat(
        allCauses.filter((item) => item.value === codeId)
      );
    });
    return result;
  }, [allCauses, estimations]);

  const addEstimation = () => {
    const newEstimation = {
      id: `${Date.now()}`,
      cause: {},
      codeId: "",
      amount: 0,
      names: travelerNames.map((item, index) => ({
        id: index,
        name: item,
        checked: travelerNames.length === 1,
      })),
      desc: "",
      files: [],
      amountError: "",
    };
    setActiveId(newEstimation.id);
    handleEstimations(estimations.concat([newEstimation]));
    if (estimations.length === 0) handleLossApi?.();
  };
  const removeEstimation = (id: string) => {
    handleEstimations(estimations.filter((item) => item.id !== id));
  };

  const updateEstimation = async (
    id: string,
    field: string,
    value: string | number | FileList | null,
    fileId: string = ""
  ) => {
    const newEstimations = [...estimations];
    const estimationIndex = newEstimations.findIndex((item) => item.id === id);
    if (estimationIndex !== -1) {
      const currentItem = newEstimations[estimationIndex];
      if (field === fields.cause) {
        if (value !== currentItem.codeId) {
          const cause = allCauses.find((item) => item.value === value);
          currentItem.cause = cause;
          currentItem.files = [];
          if (Array.isArray(currentItem.cause.subValues)) {
            currentItem.files = currentItem.cause.subValues.map(
              (item, index) => ({
                id: `file-input-${currentItem.id}-${value as string}-${index}`,
                label: item,
                name: "",
                file: null,
                base64: "",
                error: "",
              })
            );
          }
        }
        newEstimations[estimationIndex] = { ...currentItem, [field]: value };
      } else if (field === fields.amount) {
        const amount = value?.toString() ?? "";
        if (amount === "") {
          newEstimations[estimationIndex].amountError = langData?.required_field;
        } else if (amount === "0") {
          newEstimations[estimationIndex].amountError = langData.no_zero_amount;
        } else {
          newEstimations[estimationIndex].amountError = "";
        }
        if (isValidAmountEdit(value as string)) {
          newEstimations[estimationIndex] = {
            ...currentItem,
            [field]: (value as string).replace(/^0+(?=\d)/, ""),
          };
        }
      } else if (field === fields.names) {
        newEstimations[estimationIndex] = {
          ...currentItem,
          names: value,
        };
      } else if (field === fields.file) {
        const fileIndex = currentItem.files.findIndex(
          (item) => item.id === fileId
        );
        if (fileIndex !== -1) {
          const newFile: Travel.InputFileType = {
            ...currentItem.files[fileIndex],
            name: "",
            file: null,
            base64: "",
            error: "",
          };
          const file = value instanceof Object ? value[0] : null;
          if (file instanceof File === false) {
            toast.error(langData.nofile, {
              autoClose: parseInt(langData.toaster_timeout) || TOAST_AUTOCLOSE_TIMER,
            });
          } else if (validFileTypes.includes(file.type) === false) {
            const errorMessage = `${langData.invalidfile} ${newFile.label}: ${file.type}`;
            toast.error(errorMessage, {
              autoClose: parseInt(langData.toaster_timeout) || TOAST_AUTOCLOSE_TIMER,
            });
            newFile.error = errorMessage;
          } else {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > taskConstants.MAX_FILE_SIZE_MB) {
              const errorMessage = `${newFile.label} ${langData.exceeds} ${taskConstants.MAX_FILE_SIZE_MB
                } ${langData.mb} ${langData.currentsize} ${fileSizeMB.toFixed(
                  2
                )} ${langData.mb}`;
              toast.error(errorMessage, {
                autoClose: parseInt(langData.toaster_timeout) || TOAST_AUTOCLOSE_TIMER,
              });
              newFile.error = errorMessage;
            } else {
              try {
                const base64 = await convertToBase64(file);
                const base64Data = base64.split(",")[1];
                newFile.file = file;
                newFile.name = file?.name;
                newFile.base64 = base64Data;
                newFile.error = "";
                toast.success(
                  `${langData.file_upload_success} ${newFile.label}`,
                  {
                    autoClose:
                      parseInt(langData.toaster_timeout) || TOAST_AUTOCLOSE_TIMER,
                  }
                );
              } catch (error) {
                if (error)
                  toast.error(langData.base_convert_error, {
                    autoClose:
                      parseInt(langData.toaster_timeout) || TOAST_AUTOCLOSE_TIMER,
                  });
              }
            }
          }
          currentItem.files[fileIndex] = newFile;
        }
      } else
        newEstimations[estimationIndex] = { ...currentItem, [field]: value };
      const siLimit = parseFloat(newEstimations[estimationIndex].cause.coverageInfo?.siLimit);
      const amount = parseFloat(newEstimations[estimationIndex].amount.toString());
      if (Number.isFinite(siLimit) && Number.isFinite(amount)) {
        const riskCount =
          currentItem.names.filter((name) => name.checked).length || 1;
        const totalLimit = riskCount * siLimit;
        if (amount > totalLimit) {
          newEstimations[estimationIndex].amountError = langData.limit_exceeded;
        }
      }
    }
    handleEstimations(newEstimations);
  };

  const enableAddButton =
    (estimations.length === 0 || isValidEstimation === true) &&
    dateOfLoss &&
    place;

  return (
    <div className="travel-estimate-wrapper">
      <div className="estimate-content">
        <div className="estimate-section">
          <div className="estimate-heading" data-testid="estimatemain">
            {langData.estimate_description}
            <div className="estimate-details ">
              <Info popUpData={langData.estimate_description_guidelines ?? ""} />
            </div>
          </div>
          <div className="traveler-content">
            <div className="container mt-3 fieldsbody">
              <Row
                className="mb-3 form-block-1 col-12"
                controlId="formName"
                style={{ display: "flex" }}
              >
                <Col className="travel-form-group col-6">
                  <div className="form-element">
                    <div className="form-element-label">
                      {langData.country_placeof_incident}
                      <span className="text-danger">*</span>
                    </div>
                    <ThemeTextbox
                      type="text"
                      name="place"
                      maxLength={255}
                      placeholder={langData.country_placeof_incident}
                      value={place}
                      onChangehandler={(event) => {
                        const value = event?.target.value;
                        handlePlace(value ?? "");
                      }}
                      classes="form-element-field"
                    />
                  </div>
                </Col>
                <Col className="travel-form-group col-6">
                  <div className="form-element">
                    <div className="form-element-label">
                      {langData.date_of_loss}
                      <span className="text-danger">*</span>
                    </div>
                  </div>
                  <InputCalendar
                    value={dateOfLoss}
                    showSwitch={false}
                    setValue={(value: DateObject) => {
                      if (value) {
                        handleDateOfLoss(value);
                      }
                    }}
                    format="DD/MM/YYYY"
                    isonlyMonthPickerEnable={false}
                    minDate={dateRange.min}
                    maxDate={dateRange.max}
                    isCalendarIcon={true}
                  />
                </Col>
              </Row>
            </div>
            {estimations.map((item, index) => (
              <Accordion
                key={item.id}
                className="estimate-accordion"
                activeKey={activeId}
                onSelect={(eventKey) => setActiveId(eventKey as string)}
              >
                <AccordionItem eventKey={item.id}>
                  <AccordionHeader>
                    <div className="ac-content">
                      <div className="ac-headers">
                        <div className="ac-head">
                          {langData.estimate_text} {index + 1}
                        </div>
                        {activeId !== item.id && (
                          <div className="ac-head-lower">
                            {langData.cause_of_loss_text}:{" "}
                            <div className="walaa-semibold-600">
                              {item.cause?.label}
                            </div>
                            <div>{" | "}</div>
                            {langData.estimated_loss_text}:{" "}
                            <div className="walaa-semibold-600">
                              {getAmountWithIcon(item.amount)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="del-col">
                        <button onClick={() => removeEstimation(item.id)}>
                          <img
                            className="icons-delete"
                            src={deleteIcon}
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <div>
                      <Row>
                        <Col>
                          <label className="label-text">
                            {langData.cause_of_loss_text}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="drop-container">
                            <ThemeDropdown
                              id={`causeofloss-dropdown-${item.id}`}
                              selectedValue={item.codeId}
                              onChangehandler={(event) =>
                                updateEstimation(
                                  item.id,
                                  fields.cause,
                                  event.target.value
                                )
                              }
                              value={causes[item.id]}
                              classes=""
                            />
                          </div>
                        </Col>
                        <Col>
                          <label className="label-text">
                            {langData.estimated_loss_text}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="drop-container">
                            <ThemeTextbox
                              name="lossamount"
                              placeholder={langData.estimated_loss_placeholder}
                              type="text"
                              value={item.amount}
                              onChangehandler={(event) =>
                                updateEstimation(
                                  item.id,
                                  fields.amount,
                                  event.target.value
                                )
                              }
                              disabled={!item.codeId}
                            />
                            {item.amountError !== "" && (
                              <span className="text-danger">
                                {item.amountError}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col className="label-text">
                          {langData.travellers_impacted}
                        </Col>
                      </Row>
                      <Row>
                        {item.names.map(({ id, name, checked }) => (
                          <Col md={3} className="checkbox-container" key={id}>
                            <ThemeCheckButton
                              index={id}
                              value={name}
                              isSearched={travelerNames.length > 1}
                              selectOptions={item.names
                                .filter((val) => val.checked === true)
                                .map((val) => val.name)}
                              handleOnchange={(isChecked) => {
                                const newNames = item.names.map((val) =>
                                  val.id === id
                                    ? { ...val, checked: isChecked }
                                    : val
                                );
                                updateEstimation(
                                  item.id,
                                  fields.names,
                                  newNames
                                );
                              }}
                            />
                          </Col>
                        ))}
                        <Col md={3} className="checkbox-container">
                          <ThemeCheckButton
                            index={-1}
                            value={langData.all_text ?? ""}
                            isSearched={travelerNames.length > 1}
                            selectOptions={
                              item.names.every((val) => val.checked === true)
                                ? [langData.all_text ?? ""]
                                : []
                            }
                            handleOnchange={(isChecked) => {
                              const newNames = item.names.map((val) => ({
                                ...val,
                                checked: isChecked,
                              }));
                              updateEstimation(item.id, fields.names, newNames);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col className="label-text">
                          {langData.description_of_loss}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <ThemeTextarea
                            placeholder={langData.description_of_loss ?? ""}
                            classes="themetextarea-cust"
                            value={item.desc}
                            onChangehandler={(event) => {
                              if (event.target.value.length <= 2000) {
                                updateEstimation(
                                  item.id,
                                  fields.desc,
                                  event.target.value
                                );
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </AccordionBody>
                </AccordionItem>
                {activeId === item.id && item.files.length > 0 && (
                  <div className="sub-accor-open sub-accordion">
                    <div className="label-text">{langData.upload_doc_text}</div>
                    <div className="label-text">
                      {" "}
                      {langData.supported_file_type && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(langData.supported_file_type),
                          }}
                        />
                      )}
                    </div>
                    {item.files.map((val, subIndex) => (
                      <div key={val.id} className="estimate-block">
                        <div className="estimate-content">
                          <div>
                            {val.label}
                            <span className="text-danger">*</span>
                          </div>
                          <div
                            className={
                              item.files[subIndex].name
                                ? "buttonTextContainer"
                                : "upload-img-text"
                            }
                          >
                            <label htmlFor={val.id}>
                              {val.name ? (
                                <>
                                  <span className="buttonTextNameValue">
                                    <img
                                      src={pdfIcon}
                                      alt="PDF"
                                      className="buttonTextIcon"
                                    />
                                    {val?.name}
                                  </span>
                                  <span className="buttonTextNameSize">
                                    {val.file
                                      ? (val.file.size / 1024).toFixed(2)
                                      : "0"}
                                    KB
                                  </span>
                                </>
                              ) : (
                                <div className="upload-btn">
                                  {" "}
                                  <img
                                    src={uploadIcon}
                                    alt="upload"
                                    className="buttonTextIcon"
                                  />
                                  {"Upload"}
                                </div>
                              )}
                            </label>
                            {item.files[subIndex].name && (
                              <button
                                className="filecloseIcon"
                                onClick={() => {
                                  updateEstimation(
                                    item.id,
                                    fields.file,
                                    null,
                                    val.id
                                  );
                                }}
                              >
                                <img
                                  src={cancelIcon}
                                  alt="cancel_icon"
                                  className="buttonTextIcon"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          key={val.name ? val.id : "empty-" + val.id}
                          type="file"
                          id={val.id}
                          onChange={(event) => {
                            updateEstimation(
                              item.id,
                              fields.file,
                              event.target.files,
                              val.id
                            );
                          }}
                          accept={validFileTypes.join(",")}
                          style={{ display: "none" }}
                        />
                      </div>
                    ))}
                    {item.files.every((val) => val.name && !val.error) && (
                      <span className="approve-text">
                        <img
                          src={approveIcon}
                          alt="Approve"
                          className="buttonTextIcon"
                        />
                        {langData.estimate_upload_msg}
                      </span>
                    )}
                  </div>
                )}
              </Accordion>
            ))}
          </div>
          <div className="estimate-footer">
            <button
              className={`estimate-footer-btn ${enableAddButton ? "" : "estimate-footer-btn-disabled"
                }`}
              onClick={addEstimation}
              disabled={!enableAddButton}
            >
              {estimations.length > 0
                ? langData.add_another_estimate
                : langData.add_estimate}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerEstimate;
