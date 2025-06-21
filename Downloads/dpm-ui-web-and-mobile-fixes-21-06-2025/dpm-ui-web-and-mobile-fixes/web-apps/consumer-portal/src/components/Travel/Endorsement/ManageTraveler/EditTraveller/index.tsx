import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form, Accordion } from "react-bootstrap";
import { getInnerTextBetweenTags } from "utils/GetInnerTextBetweenTags";
import { DateObject } from "react-multi-date-picker";
import { subtractDates } from "utils/subtractDates";
import "./index.scss";
import editSquore from "assets/QuoteAndBuy/edit_square.svg";
import Info from "components/TravelerAddDetails/info";
import { FullCalender } from "../../../../../components/Calendar/fullcalender";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import { getAge } from "utils/getAge";
import TravelerDelete from "../TravelerDelete";

export type Traveler = {
  id: number;
  name: string;
  passportNo: string;
  policyExpiryDate: string;
  dob: string;
  relation: string;
};

interface EditTravellerProps {
  noOfAdults: number;
  data: { [key: string]: string };
  travelData: { [key: string]: string };
  onUpdate: (updatedTraveler: Traveler) => void;
  onDelete: (travelerId: string) => void;
  handleAlert(): void;
  familyType: string;
  travelItemValues: Array<{
    adultName: string;
    adultPassport: string;
    adultPassportExp: string;
    adultDob: string;
    elation: string;
  }>;
}
type FamilyType = "child" | "adult" | "senior" | "invalid";
const EditTraveller: React.FC<EditTravellerProps> = React.memo(
  ({ data, travelItemValues, onUpdate, handleAlert, onDelete, familyType }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      dob: "",
      passportNo: "",
      passportExpiry: "",
      relation: "",
    });
    const [modalData, setModalData] = useState<any>(null);
    const [isOpen, setOpen] = useState<boolean>(true);
    const [age, setAge] = useState<number>();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const innerText: string | null = getInnerTextBetweenTags(
      data?.passport_info,
      "<p>",
      "</p>"
    );
    const [showErrorDate, setShowErrorDate] = useState<boolean>(false);
    const [showErrorDob, setShowErrorDob] = useState<boolean>(false);
    const policyStartDate = "12/03/2025";
    const [travelCovidcoverage, settravelCovidcoverage] =
      useState<boolean>(false);
    const [travelWintersportscoverage, settravelWintersportscoverage] =
      useState<boolean>(false);
    const [isOn, setIsOn] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [expiryDate, setExpiryDate] = useState<string | number | Date>("");
    const [spanText, setSpanText] = useState<string>("");
    const handleAddBenefit = (benefit: string, status: boolean) => {
      if (benefit === "winter") {
        settravelWintersportscoverage(!status);
      } else if (benefit === "covid") {
        settravelCovidcoverage(!status);
      }
    };

    useEffect(() => {
      if (travelItemValues) {
        setFormData(travelItemValues);
        setExpiryDate(travelItemValues?.passportExpiry);
      }
    }, [travelItemValues]);
    const dateFormatted = (dateValue) => {
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formattedDate;
    };
    const isChidValidAge = (dobInput: string | Date): boolean => {
      const dob = new Date(dobInput);
      if (isNaN(dob.getTime())) return false;
      const now = new Date();
      const ageInMilliseconds = now.getTime() - dob.getTime();
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // approx avg month

      return ageInMonths >= 3 && ageInYears < 18;
    };

    const getRelation = (relation: string): string => {
      switch (relation) {
        case "1":
          return "Self";
        case "2":
          return "Spouse";
        case "4":
          return "Daughter";
        case "3":
          return "Son";
        default:
          return "Unknown";
      }
    };
    useEffect(() => {
      if (travelItemValues?.dob) {
        setAge(getAge(travelItemValues.dob));
      }
      if (travelItemValues?.passportExpiry) {
        const formattedDate = dateFormatted(travelItemValues?.passportExpiry);
        setExpiryDate(formattedDate);
      }
    }, [travelItemValues?.dob, travelItemValues?.passportExpiry]);
    const handleInputChange = (
      field: string | { coverageCode: string },
      value: string | number | { coverageCode: string }
    ) => {
      if (field === "name") {
        if (value === "") {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
        setFormData({
          ...formData,
          [field]: value,
        });
      } else if (field === "passportNo") {
        if (value === "") {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
        setFormData({
          ...formData,
          [field]: value,
        });
      } else if (field === "passportExpiry") {
        const policyStart = policyStartDate;
        const pptExpiry = new DateObject(value);
        const updatePpExpiry = pptExpiry.format("YYYY-MM-DD");
        const formattedExpiry = pptExpiry.format("DD/MM/YYYY");
        //const pptExpiry = new DateObject(value).format("DD/MM/YYYY");
        const diffDays = subtractDates(policyStart, formattedExpiry);
        if (Math.abs(diffDays) < 180) {
          setShowErrorDate(true);
          setIsDisabled(true);
        } else {
          setShowErrorDate(false);
          setIsDisabled(false);
        }
        setExpiryDate(formattedExpiry || "");
        setFormData({
          ...formData,
          [field]: updatePpExpiry,
        });
      } else if (field === "dob") {
        const updateDob = new DateObject(value).format("YYYY-MM-DD");
        if (familyType === "child") {
          if (!isChidValidAge(updateDob)) {
            setShowErrorDob(true);
            setSpanText("Child age should be 3 month to below 18 years");
            setIsDisabled(true);
          }
        } else if (familyType === "adult") {
          if (!(age >= 18 && age < 65)) {
            setShowErrorDob(true);
            setIsDisabled(true);
            setSpanText("Adult age should be above 18 and below 65");
          }
        } else if (familyType === "senior") {
          if (age <= 65) {
            setShowErrorDob(true);
            setIsDisabled(true);
            setSpanText("Senior citizen are above 65 years");
          }
        } else {
          setShowErrorDob(false);
          setIsDisabled(false);
        }
        setFormData({
          ...formData,
          [field]: updateDob,
        });
      } else if (field === "relation") {
        //const seletedRelationValue = data?.relations?.[value as string] || "";
        const slectedRelationKey = value as string;
        const seletedRelationValue =
          data?.relations?.[slectedRelationKey] || "";
        setIsDisabled(false);
        setFormData({
          ...formData,
          [field]: slectedRelationKey,
        });
      }
    };
    const handleClose = () => setShowModal(false);
    const handleShow = (data) => {
      setShowModal(true);
      setModalData(data);
    };

    const formValidations = () => {
      const newErrors: { [key: string]: string } = {};
      if (!formData.name)
        newErrors.name = data?.edit_traveler_popup_name_error_msg;
      if (!formData.passportNo)
        newErrors.passportno = data?.edit_traveler_popup_passportno_error_msg;
      if (Object.keys(newErrors).length === 0 && showErrorDate === false) {
        setIsDisabled(false);
        setShowModal(false);
      } else {
        setIsDisabled(true);
        setIsDisabled(true);
      }
      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = () => {
      if (formValidations()) {
        onUpdate(formData);
      }
    };
    return (
      <div className="endorsement-edit-popup">
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <button
            className="traveler-add-btn"
            onClick={() => handleShow(modalData)}
            aria-label="edit traveller"
          >
            <div className="trav-label">
              {" "}
              <img src={editSquore} alt="user icon" />{" "}
            </div>
          </button>
          <TravelerDelete
            handleAlert={handleAlert}
            data={data}
            travelerData={formData}
            travelerDelete={onDelete}
          />
        </div>

        {showModal && (
          <Modal
            show={showModal}
            data={modalData}
            centered
            onHide={handleClose}
            className="modal-lg info-modal-main"
          >
            <Modal.Header closeButton className="info-modal-head">
              <Modal.Title className="add-modal-title">
                {data?.edit_traveller_details}{" "}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="add-modal-body">
              <div className="traveler-section-popup">
                <div className="traveler-content">
                  <Accordion
                    defaultActiveKey={["0"]}
                    className={`${
                      isOpen ? "accor-open" : "accor-close"
                    } w-100 coverage-travelinfo`}
                  >
                    <Accordion.Item eventKey="0">
                      <div className="acc-head">
                        <div className="acc-head-strip"></div>

                        <div className="acc-head-titles-align">
                          {formData?.name}
                          &nbsp;
                          <div className="acc-head-strip-sub">
                            {travelItemValues?.relation}| {age} Years
                          </div>
                        </div>

                        <div className="text-incomplete">
                          <GppMaybeOutlinedIcon className="acc-warning-icon" />
                          {data?.incomplete}
                        </div>
                      </div>

                      <div className="p-2 acc-body">
                        <div className="container mt-4">
                          <Form>
                            <Row
                              className="mb-3 form-block-1"
                              controlId="formName"
                              style={{ display: "flex" }}
                            >
                              <Col>
                                <div className="form-element">
                                  <div className="form-element-label">
                                    {data?.traveller_name}
                                    <span className="text-danger">*</span>
                                  </div>

                                  <Form.Control
                                    name="name"
                                    placeholder={
                                      data?.traveller_name_placeholder
                                    }
                                    className="form-element-field"
                                    type="text"
                                    value={formData?.name}
                                    onChange={(e) =>
                                      handleInputChange("name", e.target.value)
                                    }
                                    maxLength={50}
                                    isInvalid={!!errors.name}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              <Col>
                                <div className="form-element">
                                  <div className="form-element-label">
                                    {data?.traveller_passport_no}
                                    <span className="text-danger">*</span>
                                  </div>
                                  <Form.Control
                                    name="passportNo"
                                    placeholder={
                                      data?.traveller_passport_no_placeholder
                                    }
                                    className="form-element-field"
                                    type="text"
                                    value={formData?.passportNo}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "passportNo",
                                        e.target.value
                                      )
                                    }
                                    maxLength={10}
                                    isInvalid={!!errors.passportno}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.passportno}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              <Col>
                                <div className="form-element">
                                  <div className="form-element-label">
                                    {data?.traveller_passport_exp_date}
                                    <span className="text-danger">*</span>
                                    <Info popUpData={data?.passport_info} />
                                  </div>
                                </div>

                                <FullCalender
                                  setValue={(value: Date | null) =>
                                    handleInputChange("passportExpiry", value)
                                  }
                                  format={"DD/MM/YYYY"}
                                  isOn={isOn}
                                  showSwitch={false}
                                  setIsOn={setIsOn}
                                  placeholder={
                                    data?.traveller_passport_exp_date_placeholder
                                  }
                                  maxDate={false}
                                  customProps={{
                                    onOpenPickNewDate: false,
                                    currentDate: "",
                                    value: dateFormatted(
                                      formData?.passportExpiry
                                    ),
                                  }}
                                />
                                {showErrorDate && (
                                  <span className="date-error-msg">
                                    {innerText}
                                  </span>
                                )}
                              </Col>
                            </Row>

                            <Row className="mb-3 form-block-2">
                              <Col md={3}>
                                <div className="form-block-2-elements">
                                  <div className="form-block-2-element-label">
                                    {data?.traveller_dob}
                                  </div>

                                  <FullCalender
                                    value={dateFormatted(formData?.dob)}
                                    setValue={(value: Date | null) =>
                                      handleInputChange("dob", value)
                                    }
                                    format={"DD/MM/YYYY"}
                                    isOn={isOn}
                                    showSwitch={false}
                                    setIsOn={setIsOn}
                                    placeholder={
                                      data?.traveller_dob_placeholder
                                    }
                                    minDate={false}
                                  />
                                  {showErrorDob && (
                                    <span className="date-error-msg">
                                      {spanText}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md={1} className="seprator"></Col>
                              <Col md={3}>
                                <div className="form-block-2-elements">
                                  <div className="form-block-2-element-label">
                                    {data?.traveller_relation}
                                  </div>
                                  <div className="form-block-2-element-value">
                                    <Form.Select
                                      onChange={(e) =>
                                        handleInputChange(
                                          "relation",
                                          e.target.value
                                        )
                                      }
                                      aria-label="Default select realtion-select"
                                      size="lg"
                                      value={formData.relation || 0}
                                      isInvalid={!!errors.relation} // corrected key from `realtion` to `relation`
                                    >
                                      <option value={0}>Select</option>
                                      {data?.relations &&
                                        Object.keys(data.relations)
                                          .filter((relationKey) => {
                                            const label =
                                              data.relations[
                                                relationKey
                                              ]?.toLowerCase();
                                            if (
                                              getRelation(
                                                formData?.relation
                                              ).toLocaleLowerCase() ===
                                                "daughter" ||
                                              getRelation(
                                                formData?.relation
                                              ).toLocaleLowerCase() === "son"
                                            ) {
                                              return (
                                                label === "son" ||
                                                label === "daughter"
                                              );
                                            }
                                            if (
                                              getRelation(
                                                formData?.relation
                                              ).toLocaleLowerCase() === "spouse"
                                            ) {
                                              return label === "spouse";
                                            }
                                            return true; // fallback to show all if needed
                                          })
                                          .map((relationKey) => (
                                            <option
                                              key={relationKey}
                                              value={relationKey}
                                            >
                                              {data.relations[relationKey]}
                                            </option>
                                          ))}
                                    </Form.Select>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </div>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary add-cancel-btn" onClick={handleClose}>
                {data?.cancel}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isDisabled}
              >
                {data?.submit}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
);

export default EditTraveller;
