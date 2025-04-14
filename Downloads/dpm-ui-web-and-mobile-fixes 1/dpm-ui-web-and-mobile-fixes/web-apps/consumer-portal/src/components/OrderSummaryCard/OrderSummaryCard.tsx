import React from 'react';
import { Card } from 'react-bootstrap';
import './OrderSummaryCard.scss';

interface OrderSummaryCardProps {
  languageData: any;
  addBenefitData: any;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
}

const OrderSummaryCard = ({ 
  languageData, 
  addBenefitData, 
  subtotal, 
  vatAmount, 
  totalAmount 
}: OrderSummaryCardProps) => {

  const priceUnit = `SAR`;
  const vatValue = '15%'
  return (
    <Card className="order-summary">
      <div className="order-header">
        <div className="order-title walaa-medium-500">
          {languageData?.order_summary}
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="order-body">
        <div className="walaa-medium-500">
          {languageData?.endorsement}
        </div>

        {addBenefitData?.benefits?.map((benefit, index) => {
          return (
            benefit.isSelected && (
              <div key={index} className="order-body-content">
                <div className="order-body-package-content">
                  <div>{benefit.benefitNameEn}</div>
                  <div>{priceUnit} {benefit.benefitPrice?.toFixed(2)}</div>
                </div>
              </div>
            )
          );
        })}

        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>{priceUnit} {subtotal.toFixed(2)}</div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content">
            <div>{languageData?.tax}</div>
            <div></div>
          </div>
        </div>
        <div className="order-body-content">
          <div className="order-body-package-content">
            <div>{languageData?.vat_amount} ({vatValue})</div>
            <div>{priceUnit} {vatAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.total_amount}</div>
        <div className="right">{priceUnit} {totalAmount.toFixed(2)}</div>
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
