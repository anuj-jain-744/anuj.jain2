import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal"; 
import { Row, Col, Form } from "react-bootstrap";
import SuccessMessage from "../SuccessMessage";  
import { commonKeywords } from "../../../constant";
import "./index.scss";

interface formFieldsProps {
  productTitle: string;
  buttonText: string;
  formFields: string;
  successMessage: string;
}
 

export const GetForm = ({ 
    productTitle, 
    buttonText, 
    formFields,  
    successMessage,
  }: formFieldsProps): JSX.Element => {

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false); 

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);  
  const [formData, setFormData] = useState({}); 

  const isFormValid = () => {
    
    return (
      formFields &&
      formFields.every((field) => {
        const { field_name, field_type } = field;
   
        if (field_type === commonKeywords.webform_actions) return true;  
       
        const value = formData[field_name]; 
        
        if (field_name === commonKeywords.phone && value) {
          if (!/^\d{10}$/.test(value)) {
            return false; 
          }
        }

        if (field_name === commonKeywords.email && value) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
          if (!emailRegex.test(value)) {
            return false; 
          }
        }
        
        return value && value.toString().trim() !== ""; 
      })
    );
  };

  const handleChange = (fieldName: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  
  const handleSubmit = () => {
    if (isFormValid()) {
      setFormSubmitted(true);  
    }
  }; 

  const renderField = (field) => {
    const { field_name, field_title, field_type, field_placeholder, field_options } = field;

    switch (field_type) {
      case "textfield":
        return (
          <Form.Control
            type="text"
            placeholder={field_placeholder}
            value={formData[field_name] || ""}
            onChange={(e) => handleChange(field_name, e.target.value)}
          />
        );
      case "email":
        return (
          <Form.Control
            type="email"
            placeholder={field_placeholder}
            value={formData[field_name] || ""}
            onChange={(e) => handleChange(field_name, e.target.value)}
          />
        );
      case "number":
        return (
          <Form.Control
            type="number"
            placeholder={field_placeholder}
            value={formData[field_name] || ""}
            onChange={(e) => handleChange(field_name, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={field_placeholder}
            value={formData[field_name] || ""}
            onChange={(e) => handleChange(field_name, e.target.value)}
          />
        );
      case "select":
        return (
          <Form.Select
            value={formData[field_name] || ""}
            onChange={(e) => handleChange(field_name, e.target.value)}
          >
            <option value="">Select {field_title}</option>
            {field_options &&
              Object.entries(field_options).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </Form.Select>
        );
      case "radios":
        return (
          <Form.Group controlId={field_name}> 
            <div className="product-toggle-wrapper-Ui-Tabs">
              <div className="product-toggle">
                {field_options &&
                  Object.entries(field_options).map(([key, value], index) => (
                    <button
                      key={key}
                      className={`default ${formData[field_name] === key || (index === 0 && !formData[field_name]) ? "selected" : ""}`}
                      onClick={() => handleChange(field_name, key)}
                    >
                      {value}
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
            value="ddfdfdf"
            onClick={() => { 
                handleSubmit();  
            }}
            disabled={!isFormValid()} 
          >
            {field_placeholder || "Submit"} 
          </button>
        );
      default:
        return null;
    }
  };

  
  return (
    <div>
      {formSubmitted ? (
         <SuccessMessage successMessage={successMessage} />
      ) : (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          className="get-quote-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{buttonText}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="get-quote-form-container"> 

              <Row className="field-style">

              {formFields &&
                formFields
                  .filter((field) => field.field_name !== "actions")
                  .map((field, index) => (
                    <Col md={field.field_type === "textarea" ? 12 : 6} key={index}>
                      <Form.Group controlId={field.field_name}>
                        <Form.Label>{field.field_title}</Form.Label>
                        {renderField(field)}
                      </Form.Group>
                    </Col>
                  ))}
 
                <Col md={12}>
                  {renderField({
                    field_name: "submitButton",
                    field_title: "",
                    field_type: "button",
                    field_placeholder: buttonText || "Submit",
                  })}
                </Col>

              </Row>  
              
            </div>
          </Modal.Body>
 
        </Modal>
      )}
    </div>
  );
};

export default GetForm;
