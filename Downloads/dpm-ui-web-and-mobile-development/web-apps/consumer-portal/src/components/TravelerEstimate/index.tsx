import React, { useMemo, useState } from "react";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import "./style.scss";
import { TravelData } from "types/languageData";
import Info from "../TravelerAddDetails/info";
import { FullCalender } from "../../../../consumer-portal/src/components/Calendar/fullcalender";
import ThemeDropdown from "../../../../consumer-portal/src/components/ThemeDropdown/ThemeDropdown.tsx";
import ThemeTextbox from "../ThemeTextbox/ThemeTextbox";
import ThemeCheckButton from "../../../../corporate-portal/src/components/ThemeCheckButton";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import DeleteBin from "../../../src/claims/assets/svg/icons/Delete.svg";
import Upload from "assets/IbanValidation/Upload.svg";
import { sanitizeHtml } from "@dpm/shared-module";
import { toast } from "react-toastify";
import pdfIcon from "../../../../consumer-portal/src/assets/TrackYourClaim/pdfIcon.svg";
import cancel from "assets/TrackYourClaim/Cancel.svg";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import { taskConstants, validFileTypes } from "constant";
import { DateObject } from "react-multi-date-picker";
interface PropTypes {
  data?: TravelData;
  options: Array<string>;
  handleLossApi?: () => void;
  minDate?: string;
  maxDate?: string;
  dateOfLoss: string;
  handleDateOfLoss: React.Dispatch<React.SetStateAction<string>>;
  estimations: Travel.ClaimEstimations;
  handleEstimations: React.Dispatch<
    React.SetStateAction<Travel.ClaimEstimations>
  >;
  isValidEstimation: boolean;
  place: string;
  handlePlace: React.Dispatch<React.SetStateAction<string>>;
}
const fields = {
  cause: "codeId",
  amount: "amount",
  names: "names",
  desc: "desc",
  file: "files",
};

const TravelerEstimate = ({
  data,
  options,
  handleLossApi,
  minDate,
  maxDate,
  dateOfLoss,
  handleDateOfLoss,
  estimations,
  handleEstimations,
  isValidEstimation,
  place,
  handlePlace,
}: PropTypes) => {
  const [isOpen, setOpen] = useState<boolean>(true);

  const clickEnterHandler = () => {
    setOpen(true);
  };
  const clickExitHandler = () => {
    setOpen(false);
  };

  const allCauses = useMemo(
    () =>
      Array.isArray(data?.cause_of_loss)
        ? data.cause_of_loss.map((item) => ({
            ...item,
            label: item.value,
            value: item.coverage_code,
            subValues: Array.isArray(item.sub_values) ? item.sub_values : [],
          }))
        : [],
    [data]
  );

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
    handleEstimations(
      estimations.concat([
        {
          id: `${Date.now()}`,
          codeId: "",
          amount: 0,
          names: options.map((item, index) => ({
            id: index,
            name: item,
            checked: false,
          })),
          desc: "",
          files: [],
        },
      ])
    );
    if (estimations.length === 0) handleLossApi();
  };
  const removeEstimation = (id: string) => {
    handleEstimations(estimations.filter((item) => item.id !== id));
  };

  const handleInputChange = async (
    id: string,
    field: string,
    value: string | number | FileList | null,
    fileId: string = ""
  ) => {
    const newEstimations = [...estimations];
    const estimationIndex = newEstimations.findIndex((item) => item.id === id);
    const newItem = newEstimations[estimationIndex];
    if (newItem) {
      if (field === fields.cause) {
        if (value !== newItem.codeId) {
          const cause = allCauses.find((item) => item.value === value);
          newItem.cause = cause ?? { subValues: [] };
          newItem.files = [];
          if (Array.isArray(newItem.cause.subValues)) {
            newItem.files = newItem.cause.subValues.map((item, index) => ({
              id: `file-input-${newItem.id}-${value as string}-${index}`,
              label: item,
              name: "",
              file: null,
              base64: "",
              error: "",
              taskId: 0,
            }));
          }
        }
        newEstimations[estimationIndex] = { ...newItem, [field]: value };
      } else if (field === fields.file) {
        const fileIndex = newItem.files.findIndex((item) => item.id === fileId);
        if (fileIndex !== -1) {
          const newFile = {
            ...newItem.files[fileIndex],
            name: "",
            file: null,
            base64: "",
            error: "",
          };
          const file = value?.[0];
          if (!file) {
            toast.error(data?.nofile);
          } else if (!validFileTypes.includes(file.type)) {
            const errorMessage = `${data?.invalidfile} ${newFile.label}: ${file.type}`;
            toast.error(errorMessage);
            newFile.error = errorMessage;
          } else {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > taskConstants.MAX_FILE_SIZE_MB) {
              const errorMessage = `${newFile.label} ${data?.exceeds} ${
                taskConstants.MAX_FILE_SIZE_MB
              } ${data?.mb} ${data?.currentsize} ${fileSizeMB.toFixed(2)} ${
                data?.mb
              }`;
              toast.error(errorMessage);
              newFile.error = errorMessage;
            } else {
              try {
                const base64 = await convertToBase64(file);
                const base64Data = base64.split(",")[1];
                newFile.file = file;
                newFile.name = file?.name;
                newFile.base64 = base64Data;
                newFile.error = "";
                toast.success(`${data?.file_upload_success} ${newFile.label}`);
              } catch (error) {
                if (error) toast.error(data?.base_convert_error);
              }
            }
          }
          newItem.files[fileIndex] = newFile;
        }
      } else newEstimations[estimationIndex] = { ...newItem, [field]: value };
    }
    handleEstimations(newEstimations);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const enableAddButton =
    estimations.length === 0 || isValidEstimation === true;

  return (
    <div className="travel-estimate-wrapper">
      <div className="estimate-content">
        <div className="estimate-section">
          <div className="estimate-heading" data-testid="estimatemain">
            {data?.estimate_description}
            <div className="travel-tooltip-icon">
              <Info popUpData={data?.estimate_popup || ""} />
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
                      {data?.country_placeof_incident}
                      <span className="text-danger">*</span>
                    </div>
                    <ThemeTextbox
                      type="text"
                      name="place"
                      placeholder={data?.country_placeof_incident}
                      value={place}
                      onChangehandler={(event) => {
                        const value = event?.target.value;
                        handlePlace(value ?? "");
                      }}
                    />
                  </div>
                </Col>
                <Col className="travel-form-group col-6">
                  <div className="form-element">
                    <div className="form-element-label">
                      {data?.date_of_loss}
                      <span className="text-danger">*</span>
                    </div>
                  </div>
                  <FullCalender
                    value={dateOfLoss}
                    format="DD/MM/YYYY"
                    placeholder={data?.traveller_passport_exp_date_placeholder}
                    setValue={(value: DateObject) => {
                      if (value instanceof DateObject) {
                        handleDateOfLoss(value.format("DD/MM/YYYY"));
                      }
                    }}
                    showSwitch={false}
                    customProps={{
                      currentDate: "",
                      minDate: new DateObject(minDate) || "",
                      maxDate: new DateObject(maxDate) || "",
                    }}
                  />
                </Col>
              </Row>
            </div>
            {estimations.map((item, index) => (
              <Accordion
                key={item.id}
                className="estimate-accordion"
                defaultActiveKey={`${index}`}
              >
                <Accordion.Item eventKey={`${index}`}>
                  <Accordion.Button as={Card.Header} eventKey={`${index}`}>
                    <div className="ac-content">
                      <div className="ac-head">
                        {data?.estimate_text} {index + 1}
                      </div>
                      <div className="del-col">
                        <button onClick={() => removeEstimation(item.id)}>
                          <img
                            className="icons-delete"
                            src={DeleteBin}
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </div>
                  </Accordion.Button>
                  <Accordion.Body
                    onEntered={clickEnterHandler}
                    onExiting={clickExitHandler}
                  >
                    <div>
                      <Row>
                        <Col>
                          <label className="label-text">
                            {data?.cause_of_loss_text}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="drop-container">
                            <ThemeDropdown
                              id={`causeofloss-dropdown-${item.id}`}
                              selectedValue={item.codeId}
                              onChangehandler={(event) =>
                                handleInputChange(
                                  item.id,
                                  "codeId",
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
                            {data?.estimated_loss_text}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="drop-container">
                            <ThemeTextbox
                              name="lossamount"
                              placeholder="Enter Estimated Loss Amount"
                              type="number"
                              value={item.amount}
                              onChangehandler={(event) =>
                                handleInputChange(
                                  item.id,
                                  fields.amount,
                                  event.target.value
                                )
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col className="label-text">
                          {data?.travellers_impacted}
                        </Col>
                      </Row>
                      <Row>
                        {item.names.map(({ id, name, checked }) => (
                          <Col md={3} className="checkbox-container" key={id}>
                            <ThemeCheckButton
                              index={id}
                              value={name}
                              isSearched={true}
                              selectOptions={item.names
                                .filter((val) => val.checked === true)
                                .map((val) => val.name)}
                              handleOnchange={(isChecked) => {
                                const newNames = item.names.map((val) =>
                                  val.id === id
                                    ? { ...val, checked: isChecked }
                                    : val
                                );
                                handleInputChange(
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
                            value="All"
                            isSearched={true}
                            selectOptions={
                              item.names.every((val) => val.checked === true)
                                ? ["All"]
                                : []
                            }
                            handleOnchange={(isChecked) => {
                              const newNames = item.names.map((val) => ({
                                ...val,
                                checked: isChecked,
                              }));
                              handleInputChange(
                                item.id,
                                fields.names,
                                newNames
                              );
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col className="label-text">
                          {data?.description_of_loss}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <ThemeTextarea
                            placeholder="Description of Loss"
                            classes="themetextarea-cust"
                            onChangehandler={(event) =>
                              handleInputChange(
                                item.id,
                                "desc",
                                event.target.value
                              )
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                {item.files?.length > 0 && (
                  <div
                    className={`${
                      isOpen ? "sub-accor-open" : "sub-accor-close"
                    } sub-accordion`}
                  >
                    <div className="label-text">{data?.upload_doc_text}</div>
                    <div className="label-text">
                      {" "}
                      {data?.supported_file_type && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(data?.supported_file_type),
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
                                      ? (
                                          val.file.size / 1024
                                        ).toFixed(2)
                                      : "0"}
                                    KB
                                  </span>
                                </>
                              ) : (
                                <div className="upload-btn">
                                  {" "}
                                  <img
                                    src={Upload}
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
                                  handleInputChange(
                                    item.id,
                                    fields.file,
                                    [],
                                    val.id
                                  );
                                }}
                              >
                                <img
                                  src={cancel}
                                  alt="cancel_icon"
                                  className="buttonTextIcon"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="file"
                          id={val.id}
                          onChange={(event) => {
                            handleInputChange(
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
                          src={Approve}
                          alt="Approve"
                          className="buttonTextIcon"
                        />
                        {data?.estimate_upload_msg}
                      </span>
                    )}
                  </div>
                )}
              </Accordion>
            ))}
          </div>
          <div className="estimate-footer">
            <div
              className={`estimate-footer-btn ${
                enableAddButton === true ? "" : "estimate-footer-btn-disabled"
              }`}
            >
              <button
                className={`traveler-add-btn ${
                  enableAddButton === true ? "" : "travelbutton-disabled"
                }`}
                onClick={addEstimation}
                disabled={enableAddButton === false || !dateOfLoss}
              >
                {" "}
                + Add Estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TravelerEstimate;
