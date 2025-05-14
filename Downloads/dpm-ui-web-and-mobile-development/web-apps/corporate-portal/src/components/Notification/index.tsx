import React, { useEffect, useState } from 'react';

import './style.scss';
import ThemeButton from '../ThemeButton';
import { useSelector } from 'react-redux';
import { RootState } from '@dpm/shared-module';
import { useNavigate } from 'react-router-dom';
import { genderIdMap, HOME, TRAVEL,MOTOR,MOTOR_COMP,MOTORCOMP } from '../../constant';
import { familtyFlowConstants } from '@dpm/consumer-portal/src/components/Travel/constantsTravel';

interface NotificationComponentProps {
  isNotification: boolean;
  languageData: object;
  setShowNotification: (value: boolean) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  isNotification,
  languageData,
  setShowNotification
}) => {
  const navigate = useNavigate();

  if (!isNotification) return null;

  const policyData = useSelector((state: RootState) => state.policy);//expiryDate
  const [notificationResponse, setNotificationResponse] = useState<Array<any>>([]);


  const userDetails = useSelector((state: RootState) => state.auth?.userInfo);
  const authDetails = useSelector((state: RootState) => state.auth?.authDetails);
  const addressData = useSelector((state: RootState) => state.addressData);

  const genderName = userDetails?.gender && (userDetails.gender in genderIdMap)
    ? genderIdMap[userDetails.gender as keyof typeof genderIdMap]
    : ""; // male,female gender mapping

  const getbuyPropsData = (policyNo: string, prodCode: string) => {
    let propsData = {};
    const commonPropsData = {
      ownerFullNameEnglish: userDetails?.name,
      ownerFullNameArabic: userDetails?.ownerFullNameArabic,
      ownerDobG: userDetails?.ownerDobG || userDetails?.dateOfBirth || familtyFlowConstants.dobG,
      ownerDobH: userDetails?.ownerDobH,
      gender: genderName,
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
    setNotificationResponse(policyData?.showNotification);
  }

  const handleRemindLater = (policyNo: string) => {
    let policyNoArr = JSON.parse(sessionStorage.getItem('savedNotification') as string) ?? [];
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
    if (prodCode === MOTOR || prodCode === MOTOR_COMP || prodCode === MOTORCOMP) { // motor side use cases
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

  return (
    <div className="notification-parent-container">
      {
        notificationResponse.map((val, key) => (
          <div key={key} className="notification-child-container">

            <div className="notification-container">
              <div className="notification-heading walaa-medium-500">{(languageData as { policy_renewal_reminder: string })?.policy_renewal_reminder}</div>
              <div className="notification-content walaa-regular-400">
                {val?.insurerName + " " + (
                  val?.daysToExpiry !== undefined
                    ? (languageData as { your_insurance_policy_nksa: string })?.your_insurance_policy_nksa
                      ?.replace("<<POLICYNO>>", val?.policyNo ?? "")
                      ?.replace("<<DAYS>>", val?.daysToExpiry?.toString() || "")
                    : (languageData as { expired_policy_msg: string })?.expired_policy_msg
                      ?.replace("<<DAYS>>", val?.daysSinceExpiry?.toString() || "")
                )}
              </div>
            </div>
            <div className="card-btns">
              {renewButtons.map((button, index) => (
                <ThemeButton
                  key={index}
                  variant={button.variant}
                  name={button.title}
                  className={button.classes}
                  handleClick={button.onClick(val?.policyNo, val?.productCode)}
                />
              ))}
            </div>
            <hr className="horizontal-line" />
          </div>
        ))}
    </div>
  );
};

export default NotificationComponent;