import React, { useEffect, useState } from 'react';
import './style.scss';
import ThemeButton from '../ThemeButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setShowNotificationResponse, formatDate, capitalizeNameFirstLetter } from '@dpm/shared-module';
import { useNavigate } from 'react-router-dom';
import { HOME,MOTOR,MOTOR_COMP,MOTORCOMP } from 'constant';
import { familtyFlowConstants } from '@consumer-portal/components/Travel/constantsTravel';
import { PolicyStatus, QuoteDetail } from "@consumer-portal/types/Dashboard";
import { getProductCode } from "@consumer-portal/utils/fileUtil";
import { PaymentUrl, TRAVEL } from '@consumer-portal/constant';
import { makeTheNotification } from 'utils/makeNotificationData';

interface NotificationComponentProps {
  languageData: { [key: string]: string };
  setShowNotification: (value: boolean) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  languageData,
  setShowNotification
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const policyData = useSelector((state: RootState) => state.policy);//expiryDate
  const [notificationResponse, setNotificationResponse] = useState<Array<any>>([]);
  const { quotes = [] } = useSelector(
    (state: RootState) => state.queryQuote || { quotes: [], error: null }
  ) as { quotes: QuoteDetail[]; isLoading: boolean; error: unknown };

  const userDetails = useSelector((state: RootState) => state.auth?.userInfo);
  const authDetails = useSelector((state: RootState) => state.auth?.authDetails);
  const addressData = useSelector((state: RootState) => state.addressData);

  const getbuyPropsData = (policyNo: string, prodCode: string) => {
    let propsData = {};
    const commonPropsData = {
      ownerFullNameEnglish: userDetails?.name,
      ownerFullNameArabic: userDetails?.ownerFullNameArabic,
      ownerDobG: userDetails?.ownerDobG || userDetails?.dateOfBirth || familtyFlowConstants.dobG,
      ownerDobH: userDetails?.ownerDobH,
      gender: userDetails?.gender,
      nationality: userDetails?.nationality,
    }
    if (prodCode === HOME) { // home use cases
      propsData = {
        ownerDetail: {
          ...commonPropsData,
          message: authDetails?.message,
          isValid: authDetails?.isValid,
          referenceNo: authDetails?.referenceNo,
          sessionSecretId: authDetails?.sessionSecretId,
          nationalityCode: userDetails?.nationalityCode,
          email: userDetails?.email,
        },
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber,
        addressData: { addresses: addressData.addressData },
        policyNumber: policyNo
      };
    } else
    if (prodCode === MOTOR || prodCode === MOTOR_COMP || prodCode === MOTORCOMP) { // motor use cases
      propsData = {
        ...commonPropsData,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails.mobileNumber ?? "",
        policyNumber: policyNo,
        isValidPolicy: true,
        isValidParam: true,
        loggedInRenew: true, 
      }
    }
    else
     {
      propsData = {
        ...commonPropsData,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails.mobileNumber ?? "",
        policyNumber: policyNo,
        isValidPolicy: true,
        isValidParam: true,
        loggedInRenew: true,
      }
    }
    return propsData;
  }


  const fetchPolicyNotification = () => {
    const policyNoArr = JSON.parse(sessionStorage.getItem('savedNotification') as string) ?? [];
    const filteredArr = (policyData?.showNotification || []).filter((item: { policyNo: string; productCode: string; policyStatus: string; }) => !policyNoArr.includes(item.policyNo) && !(item.productCode === TRAVEL || item.policyStatus === languageData?.cancelled) );
    dispatch(setShowNotificationResponse(filteredArr));
    setNotificationResponse(filteredArr);
  }

  const handleRemindLater = (policyNo: string) => {
    const policyNoArr = JSON.parse(sessionStorage.getItem('savedNotification') as string) ?? [];
    policyNoArr.push(policyNo);
    sessionStorage.setItem('savedNotification', JSON.stringify(policyNoArr));
    setNotificationResponse((prevResponse) => {
      const newNotification = prevResponse.filter((response) => (response.policyNo !== policyNo))
      return newNotification;
    });
  }

  const handleNavigateRenew = (policyNo: string, prodCode: string) => {
    const stateObject = getbuyPropsData(policyNo, prodCode);
    if (prodCode === HOME) { // home side use cases
      navigate("/personal/Home/quote-buy", { state: { data:  stateObject} });
    } else
    if (prodCode === MOTOR || prodCode === MOTOR_COMP || prodCode === MOTORCOMP  ) { // motor side use cases
      navigate("/Motor/QuoteAndBuy", { state: { data: stateObject } });
    }
    setShowNotification(false);
  }


  const renewButtons = [
    {
      title: (languageData as { renew: string })?.renew,
      variant: 'outline',
      classes: 'renew-now walaa-medium-500',
      onClick: (policyNo: string, productCode: string) => () => {
        handleNavigateRenew(policyNo, productCode);
      }
    },
    {
      title: (languageData as { remind_me_later: string })?.remind_me_later,
      variant: 'remindLater',
      classes: 'remind-later walaa-regular-400',
      onClick: (policyNo: string) => () => {
        handleRemindLater(policyNo);
      },
    },
  ];

  useEffect(() => {
    fetchPolicyNotification();
  }, [])

  const currentUserDetails = sessionStorage.getItem("userDetails");

  const [userName, setUserName] = useState<string>('');
  useEffect(() => {
    if(currentUserDetails){
      const userName = JSON.parse(currentUserDetails).userProfileData?.name?.split(" ")[0];
      setUserName(userName);
    }
  },[]);

  const getNotificationMessage = (val) => {
    switch(val?.type){
      case "policy":
        return capitalizeNameFirstLetter(userName) + ", " + (
          (languageData as { your_insurance_policy_nksa: string })?.your_insurance_policy_nksa
              ?.replace("<<POLICYNO>>", val?.policyNo ?? "")
              ?.replace("<<DAYS_TEXT>>", formatDate(val?.expiryDate) || "")
        )
      case "quote":
        return  (
          (languageData as { quotation_notification_message: string })?.quotation_notification_message
            ?.replace("<Quote No>", val?.quoteNo ?? "")
        )
      default:
        return "";
    }
    
   }
  const navigateToPay=(value)=>{
    const code = getProductCode(value.productCode);
      const encryptedQuoteNumber = btoa(value?.quoteNo + "_" + code);
      navigate(PaymentUrl + encryptedQuoteNumber);
  }

  const updateQuotes = (quotes: QuoteDetail[]): QuoteDetail[] => {
    return quotes?.filter(
      (quote) =>
        quote.quoteStatus !== PolicyStatus.Reject &&
        quote.quoteStatus !== PolicyStatus.Expired
    );
  };

  const notificationData = makeTheNotification({policyNotification: notificationResponse, quotesNotification: updateQuotes(quotes), languageData});

  return (
    <div className="notification-parent-container">
      {
        notificationData?.map((val, key) => (
          <div key={key} className={`${val?.type==="policy" ?"notification-child-container":"payment-notification"}`}>

            <div className={"notification-container"}>
              <div className="notification-heading">{val?.title}</div>
              <div className="notification-content">
                {getNotificationMessage(val)}
              </div>
            </div>
            <div className="card-btns">
              { val?.type==="policy"? renewButtons.map((button, index) => (
                <ThemeButton
                  key={index}
                  name={button.title}
                  className={button.classes}
                  handleClick={button.onClick(val?.policyNo, val?.productCode)}
                />
              )):
              <ThemeButton
              name={languageData?.make_payment ?? ""}
              className={"make-payment walaa-medium-500"}
              handleClick={()=>navigateToPay(val)}
            />
              }
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationComponent;