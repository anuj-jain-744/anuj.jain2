import React, {  useEffect, useState } from "react";
import GetForm from "./GetForm/index";
import "./index.scss";


interface FieldData {
  field_name: string;
  field_title: string;
  field_type: string;
  field_required: boolean;
  field_placeholder: string;
  field_options?: Record<string, string> | null;
  field_validation?: Record<string, any> | null;

}
interface GetQuoteProps {
  carIcon: string;
  arrowIcon: string;
  verifiedIcon: string;
  introText: string;
  disclaimerText: string;
  buttonLabel: string;
  products: string;  
  configdata:string;  
  fieldsData:FieldData[];  
  successMessage:string;
}
 
export const GetQuote = ({
  carIcon,
  arrowIcon,
  verifiedIcon,
  introText,
  disclaimerText,
  buttonLabel,
  products,  
  configdata,  
  fieldsData,  
  successMessage,
}: GetQuoteProps): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [iconPath, setIconPath] = useState(null); 
 
 
  const handleRequestQuote = () => {
    setShowForm(true);
  };

  const productName = configdata;  
  useEffect(() => {
    if (productName) {
      import(`../../../src/assets/Header/activeIcons/active${productName}Icon.svg`)
        .then((module) => {
          setIconPath(module.default); 
        })
        .catch((err) => {
          console.error("Error loading image:", err); 
        });
    }
  }, [productName]); 
   
  return (
    <div className="get-quote">
      <div className="get-quote-container">
        <div className="get-quote-content">
          <div className="get-quote-header">
            <div className="get-quote-icon-wrapper"> 
            {iconPath ? (
              <img
                src={iconPath}
                alt={`${productName} icon`}
                className="get-quote-product-icon"
              />
            ) : null}
            </div>

            <div className="get-quote-intro">
              <p className="get-quote-intro-text">{introText}</p>
            </div>
          </div>

          <div className="get-quote-button-section"  onClick={() => setShowForm(true)}>
            <div className="get-quote-button-label">
              <button className="get-quote-button" >
                {buttonLabel}
              </button>
            </div>

            <img
              src={arrowIcon}
              alt="Arrow Right"
              className="get-quote-arrow-icon"
            />
          </div>
        </div>

        <div className="get-quote-footer">
          <div className="get-quote-verified-icon-wrapper">
            <img
              src={verifiedIcon}
              alt="Verified Icon"
              className="get-quote-verified-icon"
            />
          </div>

          <p className="get-quote-disclaimer">{disclaimerText}</p>
        </div>
      </div>

      {showForm && 
  <GetForm 
    productTitle={introText}
    buttonText={buttonLabel}
    formFields={fieldsData} 
    successMessage={successMessage}
  />
}
    </div>
  );
};