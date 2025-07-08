import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Form } from "react-bootstrap";
import SuccessMessage from "../SuccessMessage";
import { commonKeywords } from "../../../constant";
import { useApiCall } from "@dpm/shared-module";
import { callValidation, getMaxLength } from "../../../utils/GetQuoteFormValdiation";
import "./index.scss";
interface formFieldsProps {
  products?: {
    class_name: string;
  };
  productTitle?: string;
  buttonText: string;
  formFields: any[];
  successMessage: string;
  show: boolean;
  setShow: (show: boolean) => void;
}

const GetForm = ({ products, buttonText, formFields, successMessage, show, setShow }: formFieldsProps): JSX.Element => {
  const handleClose = () => setShow(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
 const extendedFields = formFields.map((field) => ({
  ...field,
  field_validation: field.field_validation || {},
}));

const { makeApiCall, data, error, isLoading } = useApiCall(
  5,
  "Comms/RequestaQuote",
  "post",
);

const validateField = (fieldName: string, value: string) => {
  const meta = extendedFields.find((f) => f.field_name === fieldName);
  const rules = meta?.field_validation;
  if (!rules) return "";
  for (const key in rules) {
    if (key === "required") {
      // Required check
      if (value.trim() === "") return rules[key]?.message;
      if (meta.field_name === "additional_information") {
        if (value.length > 200) return rules[key]?.message;
      }
if (meta.field_name === "number_of_employees") {
        if (isNaN(Number(value)) || Number(value) < 0) return rules[key]?.message;
      }
    } else {
      const valid = callValidation(key, value);
      if (!valid) return rules[key]?.message || "Invalid input.";
    }
  }
  return "";
};

const isFormValid = () => {
    return extendedFields.every((field) => {
      if (field.field_type === commonKeywords.webform_actions) return true;
      const value = formData[field.field_name] || "";
      const errorMsg = validateField(field.field_name, value);
      return errorMsg === "";
    });
  };
  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    const errorMsg = validateField(fieldName, value);
    setFormErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };
  const handleSubmit = () => {
    const payload = {
      "fullName": formData[extendedFields[0]?.field_name] ?? "",
      "companyName": formData[extendedFields[1]?.field_name] ?? "",
      "email": formData[extendedFields[3]?.field_name] ?? "",
      "phone": formData[extendedFields[2]?.field_name] ?? "",
      "numberOfEmployees":formData[extendedFields[4]?.field_name] ?? "",
      "timePreference": formData[extendedFields[5]?.field_name] ?? "",
      "region": formData[extendedFields[6]?.field_name] ?? "",
      "additionalInformation":formData[extendedFields[7]?.field_name] ?? "",
      "productName":products?.class_name ?? "",
    }
    makeApiCall(payload);
  };
  const renderField = (field) => {
    const { field_name, field_title, field_type, field_placeholder, field_options } = field;
    const value = formData[field_name] || "";
    switch (field_type) {
      case "textfield":
      case "email":
      case "number":
        return (
          <>
            <Form.Control
              type={field_type === "textfield" ? "text" : field_type}
              placeholder={field_placeholder}
              value={value}
              onChange={(e) => {
                const val = e.target.value;
                if (field_name === "phone_number") {
                  if (/^\d*$/.test(val) && val.length <= 10) {
                    handleChange(field_name, val);
                  }
                } else {
                  handleChange(field_name, val);
                }
              }}
              isInvalid={!!formErrors[field_name]}
              maxLength={getMaxLength(field.field_name)}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors[field_name]}
            </Form.Control.Feedback>
          </>
        );

      case "select":
        return (
          <Form.Select
            value={value}
            onChange={(e) => handleChange(field_name, e.target.value)}
            isInvalid={!!formErrors[field_name]}
          >
            <option value="">Select {field_title}</option>
            {field_options &&
              Object.entries(field_options).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
          </Form.Select>
        );
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={field_placeholder}
            value={value}
            onChange={(e) => handleChange(field_name, e.target.value)}
            isInvalid={!!formErrors[field_name]}
            maxLength={getMaxLength(field.field_name)}
          />
        );
      case "radios":
        return (
          <Form.Group controlId={field_name}>
            <div className="product-toggle-wrapper-Ui-Tabs">
              <div className="product-toggle">
                {field_options &&
                  Object.entries(field_options).map(([key, label]) => (
                    <button
                      key={key}
                      className={`default ${value === key ? "selected" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChange(field_name, key);
                      }}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </div>
          </Form.Group>
        );
      case "button":
        return (
          <button
            className="get-quote-button custom-button-class"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            {field_placeholder || "Submit"}
          </button>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (data && !isLoading && !error) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        handleClose();
      }, 3000);
    }
  }, [data, error, isLoading]);
  
  return (
    <div>
      {formSubmitted ? (
        <SuccessMessage successMessage={successMessage} setFormSubmitted={setFormSubmitted} />
      ) : (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} className="get-quote-modal">
          <Modal.Header closeButton>
            <Modal.Title>{buttonText}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="get-quote-form-container">
              <Row className="field-style">
                {extendedFields.filter(f => f.field_type !== "webform_actions").map((field, index) => (
                  <Col md={field.field_type === "textarea" ? 12 : 6} key={index}>
                    <Form.Group controlId={field.field_name}>
                      <Form.Label>{field.field_title}</Form.Label>
                      {renderField(field)}
                    </Form.Group>
                  </Col>
                ))}
                <Col md={12} className="lastBtnDiv">{renderField({ field_name: "submit", field_type: "button", field_placeholder: buttonText })}</Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>

      )}
    </div>
  );
};
export default GetForm;

