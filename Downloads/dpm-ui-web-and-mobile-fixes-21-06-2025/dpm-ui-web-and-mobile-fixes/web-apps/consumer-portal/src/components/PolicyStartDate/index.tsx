import React, { ReactNode, useEffect, useState ,useRef} from "react";
import { Card } from "react-bootstrap";
import EditSquare from "assets/QuoteAndBuy/edit_square.svg";
import "./style.scss";
import ChangePolicyStartDate from "./ChangePolicyStartDate";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";
import { Value } from "react-multi-date-picker";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getFormattedDate, convertDateFormat, formatDateDmy } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
interface IPolicyStartDate {
  languageData: LanguageData | undefined | null;
  isCalendarIcon?: boolean;
  productType?: string;
}
const PolicyStartDate: React.FC<IPolicyStartDate> = ({ languageData, isCalendarIcon,productType }) => {
  //policy start Date selected Is from context api hook
  const { setPolicyStartDate, policyStartDate, setPolicyStartDateAPI, viewPolicyData, isRenewpolicy, homePremiumResponse } = useQuoteAndBuyContext();

  const { homePolicyRenewal } = usePHQuoteBuyContext();

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const hasInitialized = useRef(false);

  //policy start Date for Renew policy
  const dateString = viewPolicyData?.policyBasic?.expiryDate;
  const formattedDate = dateString ? formatDateDmy(dateString) : null;
  const [policyDate, setPolicyDate] = useState<Value | string | undefined | null>(null);

  useEffect(() => {
    if (!hasInitialized.current && isRenewpolicy) {
      // Set the policy date only on the first render
      setPolicyDate(formattedDate);
      hasInitialized.current = true; // Mark as initialized
    }
  }, [formattedDate]); // Dependency array ensures this runs only on the first render

  useEffect(() => {
    if (!hasInitialized.current && isHome && homePolicyRenewal && new Date(homePolicyRenewal?.expiryDate) > new Date()) {
      // Set the policy date only on the first render in home case
      setPolicyDate(formatDateDmy(homePolicyRenewal?.expiryDate));
      setPolicyStartDate(formatDateDmy(homePolicyRenewal?.expiryDate));
      hasInitialized.current = true; // Mark as initialized
    }
  }, [isHome]); // Dependency array ensures this runs only on the first render in home case

  //click handler fn to enable edit policystartDate
  const clickHandler = () => {
    setShow(true);
  };

  useEffect(() => {
    if (policyStartDate === null && ((!isHome && !isRenewpolicy) || (isHome && !homePolicyRenewal))) {
      setPolicyDate(getFormattedDate()); //local selected date
      setPolicyStartDate(getFormattedDate()); //updated date to context api hook for UI display
      setPolicyStartDateAPI(convertDateFormat(getFormattedDate())); //updated date to context api hook for API submit payload for mm/dd/yyyy format
    } else {
      setPolicyDate(policyStartDate as string); //local selected date
  }
  }, []);


  //change policystartDate handler fn
  const changeHandler = (value: Value | undefined) => {

    if (!value) {
      return;
    }
        setPolicyDate(value); //local selected date
        setPolicyStartDate(value as string); //updated date to context api hook for UI display
        setPolicyStartDateAPI(convertDateFormat(value as string)); //updated date to context api hook for API submit payload for mm/dd/yyyy format
        setShow(false);
  };

  return (
    <React.Fragment>
      <Card className="policystart-card w-100">
        <Card.Body className="w-100" data-testid="policy-card">
          {isRenewpolicy ? (
                <div className="d-flex align-items-center justify-content-between">
                <div className="ps-2">
                {languageData?.policy_start_date}
                  <span className="px-1 walaa-medium-500">
                  {policyDate as ReactNode}
                  </span>
                </div>
                <div className="policystart-icn-container" role="button" tabIndex={0} onClick={clickHandler}>
                  <img src={EditSquare} alt="edit" />
                </div>
              </div>
            ) : (
              <>
              <div className="d-flex align-items-center justify-content-between">
              <div className="ps-2">
                {languageData?.policy_start_date}:
                <span className="px-1 walaa-medium-500">
                {policyDate as ReactNode}
                </span>
              </div>
              <div className="policystart-icn-container" role="button" tabIndex={0} onClick={clickHandler}>
                <img src={EditSquare} alt="edit" />
              </div>
            </div>

            </>
          )}
        </Card.Body>
      </Card>
      {/* Change policystartDate modal dialog component */}
      {show && policyDate && (
        <ChangePolicyStartDate
          languageData={languageData}
          closeHandler={handleClose}
          changeHandler={changeHandler}

          policyDate={policyDate}
          isOnVal={parseInt((policyDate as string)?.split("/")[2]) !== new Date().getFullYear()}
          isCalendarIcon={isCalendarIcon}
          data-testid="date-picker"
          productType={productType}
        />
      )}
    </React.Fragment>
  );
};
export default PolicyStartDate;
