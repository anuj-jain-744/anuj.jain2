import { Card } from 'react-bootstrap';
import './OrderSummaryCard.scss';
import { LanguageData } from 'types/languageData';
import { AddBenefitprops } from 'types/AddBenefit';
import { ENDORSEMENT_TYPE } from 'constant';
import { getAmountWithIcon, getCurrencySymbolForSR } from '@app-shell/utils/common';

interface OrderSummaryCardProps {
  languageData: LanguageData;
  addBenefitData: {
    benefits: AddBenefitprops[],
  };
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  endorsementType? : string;
  adminFees?: number;
}

const OrderSummaryCard = ({ 
  languageData, 
  addBenefitData, 
  subtotal, 
  vatAmount, 
  totalAmount ,
  endorsementType,
  adminFees = 0
}: OrderSummaryCardProps) => {

  const vatValue = '15%'

  const getEndorsementType = () => {
    if (endorsementType === ENDORSEMENT_TYPE.ADD_DRIVER) {
      return languageData?.addDriver ?? 'Additional Drivers';
    } else if (endorsementType === ENDORSEMENT_TYPE.ADD_BENEFITS) {
      return languageData?.addBenefits ?? 'Additional Benefits';
    } 
    return languageData?.endorsement;
  };
  
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
          {getEndorsementType()}
        </div>

        {addBenefitData?.benefits?.map((benefit, index) => {
          return (
            benefit.isSelected && (
              <div key={index} className="order-body-content">
                <div className="order-body-package-content">
                  <div>{getCurrencySymbolForSR(benefit.benefitNameEn)}</div>
                  <div>{getAmountWithIcon(benefit.benefitPrice)}</div>
                </div>
              </div>
            )
          );
        })}
        {Boolean(adminFees) && <><hr className="horizontal-line" />
        <div className="order-body-content">
          <div className="order-body-package-content">
            <div>{languageData?.adminfees ?? "Admin Fees"}</div>
            <div>{getAmountWithIcon(adminFees)}</div>
          </div>
        </div></>}
        <hr className="horizontal-line" />
        <div className="order-body-content walaa-medium-500">
          <div className="order-body-package-content">
            <div>{languageData?.subtotal}</div>
            <div>{getAmountWithIcon(subtotal)}</div>
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
            <div>{getAmountWithIcon(vatAmount)}</div>
          </div>
        </div>
      </div>
      <div className="order-summary-footer walaa-medium-500">
        <div className="left">{languageData?.total_amount}</div>
        <div className="right">{getAmountWithIcon(totalAmount)}</div>
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
