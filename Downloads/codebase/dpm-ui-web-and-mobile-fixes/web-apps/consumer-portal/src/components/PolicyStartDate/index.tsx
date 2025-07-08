import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Card } from "react-bootstrap";
import { DateObject, Value } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_en from "react-date-object/locales/arabic_en";
import { LanguageData } from "types/languageData";
import ChangePolicyStartDate from "./ChangePolicyStartDate";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {
  getFormattedDate,
  convertDateFormat,
  formatDateDmy,
  convertDateYmd,
} from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import EditDate from "assets/QuoteAndBuy/Edit_Date.svg";
import {
  after45,
  after90,
} from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import { productIDs } from "../../constant";
import { isValidDate } from "utils/calendarValidation";
import "./style.scss";

interface IPolicyStartDate {
  languageData: LanguageData | undefined | null;
  isCalendarIcon?: boolean;
  productType?: string;
}

const PolicyStartDate: React.FC<IPolicyStartDate> = React.memo(
  ({ languageData, isCalendarIcon, productType }) => {
    //policy start Date selected Is from context api hook
    const {
      policyStartDate,
      setPolicyStartDate,
      policyExpiryDate,
      setPolicyExpiryDate,
      setPolicyStartDateAPI,
      viewPolicyData,
      isRenewpolicy,
      homePremiumResponse,
    } = useQuoteAndBuyContext();
    const { homePolicyRenewal } = usePHQuoteBuyContext();
    const isHome = useMemo(
      () => homePremiumResponse && Object.keys(homePremiumResponse).length > 0,
      [homePremiumResponse]
    );
    const [show, setShow] = useState(false);
    const handleClose = useCallback(() => setShow(false), []);
    const [policyDate, setPolicyDate] = useState<
      Value | string | undefined | null
    >(null);

    // State and logic for ChangePolicyStartDate
    const [dateValue, setDateValue] = useState<string | number | Value>();
    const [isOn, setIsOn] = useState<boolean>(false);
    const [ownerDOB, setOwnerDOB] = useState<string | number | Value>();
    const [isError, setIsError] = useState<boolean>(false);

    const getInitialDateForRenew = (policyExpiryDate: Value) => {
      const policyExpiryDateStr = policyExpiryDate; // Pre/Before Expiry- "30/06/2025";  // Post/After Expiry- "10/06/2025"
      const convertedPolicyExpiryDate = convertDateYmd(
        String(policyExpiryDateStr ?? "")
      );
      const policyExpiryNextDate = new DateObject(convertedPolicyExpiryDate)
        .add(1, "days")
        .format("DD/MM/YYYY");
      const currentDate = new DateObject().format("DD/MM/YYYY");
      const currentDateObj = new DateObject();
      const nextDate = new DateObject(currentDateObj)
        .add(1, "days")
        .format("DD/MM/YYYY");
      return policyExpiryDateStr && policyExpiryDateStr < currentDate
        ? nextDate
        : policyExpiryNextDate;
    };

    // Initialization logic for policyDate and policyExpiryDate
    useEffect(() => {
      let initialDate: Value | string | null = null;

      // Renew policy logic
      if (isRenewpolicy) {
        initialDate = getInitialDateForRenew(policyExpiryDate);
      } else if (
        isHome &&
        homePolicyRenewal &&
        new Date(homePolicyRenewal?.expiryDate) > new Date()
      ) {
        // Home policy renewal logic
        initialDate = formatDateDmy(homePolicyRenewal?.expiryDate);
        setPolicyStartDate(initialDate);
      } else if (
        policyStartDate === null &&
        ((!isHome && !isRenewpolicy) || (isHome && !homePolicyRenewal))
      ) {
        // Default logic - not a renewal policy and no start date set
        initialDate = getFormattedDate();
        setPolicyStartDate(initialDate);
        setPolicyStartDateAPI(convertDateFormat(initialDate));
      } else {
        initialDate = policyStartDate as string;
      }
      setDateValue(initialDate);
      setPolicyDate(initialDate);
      setPolicyExpiryDate(initialDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoize minDate and maxDate calculation

    const { minDate, maxDate } = useMemo(() => {
      const afterDays = productType === productIDs.travel ? after90 : after45;
      if (policyExpiryDate && isRenewpolicy) {
        const initialDate = getInitialDateForRenew(policyExpiryDate);
        setDateValue(initialDate);
        setPolicyDate(initialDate);
        
        const convertedDate = convertDateYmd(String(initialDate ?? ""));
        const minDate = new DateObject(convertedDate);
        const maxDate = new DateObject(convertedDate).add(afterDays, "days");
        return { minDate, maxDate };
      } else {
        const afterDays = productType === productIDs.travel ? after90 : after45;
        const minDate = new DateObject(new Date()).add(1, "days");
        const maxDate = new DateObject(new Date()).add(afterDays, "days");
        return { minDate, maxDate };
      }
    }, [policyExpiryDate, productType]);

    // Update ownerDOB when dateValue or isOn changes
    useEffect(() => {
      let dob = dateValue;
      if (dateValue) {
        if (isOn) {
          // Convert to Hijri (arabic calendar)
          dob =
            typeof dob === "string"
              ? dob
              : new DateObject(dateValue).convert(arabic, arabic_en).format();
        } else {
          // Convert to Gregorian (default calendar)
          dob =
            typeof dob === "string" ? dob : new DateObject(dateValue).format();
        }
        setOwnerDOB(dob);
      }
    }, [dateValue, isOn]);

    const checkValue = useMemo(
      () => RegExp(/home/i).exec(languageData?.isLatest as string),
      [languageData]
    );

    const setDatepickerValue = useCallback(
      (value: Value | string) => {
        // Only validate if minDate and maxDate are not null
        if (!minDate || !maxDate) {
          setIsError(true);
          return;
        }

        const isValid = isValidDate(String(value), isOn, maxDate, minDate);
        if (!isValid && value) {
          setIsError(true);
          return;
        } else {
          setIsError(false);
        }
        setDateValue(value);
      },
      [isOn, maxDate, minDate]
    );

    const changeHandler = useCallback(
      (value: Value | undefined) => {
        if (!value) return;
        setPolicyDate(value); //local selected date
        setPolicyStartDate(value as string); //updated date to context api hook for UI display
        setPolicyStartDateAPI(convertDateFormat(value as string)); //updated date to context api hook for API submit payload for mm/dd/yyyy format
        setShow(false);
      },
      [setPolicyStartDate, setPolicyStartDateAPI]
    );

    const clickHandler = useCallback(() => {
      // Only validate if minDate and maxDate are not null
      if (!minDate || !maxDate) {
        setIsError(true);
        return;
      }
      const isValid = isValidDate(String(ownerDOB), isOn, maxDate, minDate);
      if (!isValid) {
        setIsError(true);
        return;
      }
      setIsError(false); // Reset error if ownerDOB is set and valid
      changeHandler(ownerDOB);
    }, [ownerDOB, isOn, maxDate, minDate, changeHandler]);

    //click handler fn to enable edit policystartDate
    const handleEditPolicyStartDate = useCallback(() => setShow(true), []);

    const showChangePolicyStartDate = useMemo(
      () => show && policyDate,
      [show, policyDate]
    );

    return (
      <>
        {/* Policy Start Date Card */}
        {policyDate && (
          <>
            <Card className="policystart-card w-100">
              <Card.Body className="w-100" data-testid="policy-card">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="ps-2">
                    {languageData?.policy_start_date}
                    {!isRenewpolicy && ":"}
                    <span className="px-1 walaa-medium-500">
                      {policyDate as ReactNode}
                    </span>
                  </div>
                  <div
                    className="policystart-icn-container"
                    role="button"
                    tabIndex={0}
                    onClick={handleEditPolicyStartDate}
                  >
                    <img src={EditDate} alt="edit" />
                  </div>
                </div>
              </Card.Body>
            </Card>
            {/* Change policystartDate modal dialog component */}
            {showChangePolicyStartDate && (
              <ChangePolicyStartDate
                languageData={languageData}
                closeHandler={handleClose}
                changeHandler={clickHandler}
                policyDate={policyDate}
                dateValue={dateValue}
                isOnVal={isOn}
                isCalendarIcon={isCalendarIcon}
                data-testid="edit-policy-start-date-date-picker-modal"
                setValue={setDatepickerValue}
                setIsOn={setIsOn}
                isError={policyDate ? false : isError}
                minDate={minDate}
                maxDate={maxDate}
                ownerDOB={ownerDOB}
                checkValue={checkValue}
              />
            )}
          </>
        )}
      </>
    );
  }
);

export default PolicyStartDate;
