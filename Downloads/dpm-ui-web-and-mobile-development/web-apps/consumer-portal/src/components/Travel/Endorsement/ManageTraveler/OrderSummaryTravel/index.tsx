import React from "react";
import { Card } from "react-bootstrap";
import "./index.scss";
import EndorsementTravellerSection from "./EndorsementTravellersDetails";

interface OrderSummaryTravelCard {
  languageData: any;
  addBenefitData: any;
  adminFees: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
}

const OrderSummaryTravelCard = ({
  languageData,
  addBenefitData,
  adminFees,
  subtotal,
  vatAmount,
  totalAmount,
}: OrderSummaryTravelCard) => {
  const priceUnit = languageData?.sar;;
  const vatValue = "15%";
  return (
    <Card className="order-summary-travel">
      <div className="order-header">
        <div className="order-title walaa-medium-500">
          {languageData?.order_summary}
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="order-body">
        <div className="walaa-medium-500">{languageData?.endorsement}</div>
        <div className="order-body-content walaa-medium-500">
          {languageData?.endorsement_manage_traveler}
        </div>       
        {
          <div className="">
            <EndorsementTravellerSection
              languageData={languageData}
              sectionName={"Add"}
            />
          </div>
        }
        {
          <div className="">
            <EndorsementTravellerSection
              languageData={languageData}
              sectionName={"Remove"}
            />
          </div>
        }
        {
          <div className="">
            <EndorsementTravellerSection
              languageData={languageData}
              sectionName={"Benefits"}
            />
          </div>
        }

        <hr className="horizontal-line" />

        <div className="order-body-content">
          <div className="order-body-package-content">
            <div>{languageData?.adminfees}</div>
            <div>
              {priceUnit} {adminFees.toFixed(2)}
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>
              {priceUnit} {subtotal.toFixed(2)}
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="order-body-content">
          <div className="order-body-package-content">
            <div>
              {languageData?.vat_amount} ({vatValue})
            </div>
            <div>
              {priceUnit} {vatAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="order-summary-travel-footer walaa-medium-500">
        <div className="left">{languageData?.total_amount}</div>
        <div className="right">
          {priceUnit} {totalAmount.toFixed(2)}
        </div>
      </div>
    </Card>
  );
};

export default OrderSummaryTravelCard;
