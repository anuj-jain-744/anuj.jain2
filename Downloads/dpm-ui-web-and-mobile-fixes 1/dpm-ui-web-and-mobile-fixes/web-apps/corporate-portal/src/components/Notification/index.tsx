import React, { useEffect, useState } from 'react';

import './style.scss';
import ThemeButton from '../ThemeButton';
import { useSelector } from 'react-redux';
import { RootState } from '@dpm/shared-module';

interface ButtonConfig {
  title: string;
  variant: string;
  classes: string;
  onClick: () => void;
}

interface NotificationComponentProps {
  onClose: () => void;
  isNotification: boolean;
  languageData: object;
  navigateTo?: (url: string) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  onClose,
  isNotification,
  languageData,
  navigateTo
}) => {


  if (!isNotification) return null;

  const policyData = useSelector((state: RootState) => state.policy);//expiryDate
  const [notificationResponse, setNotificationResponse] = useState<Array<any>>([]);

  const fetchPolicyNotification = () => {
    setNotificationResponse(policyData?.showNotification);
  }

  const handleNavigate = (policyNo: string) => {
    let productCode = notificationResponse.filter((response) => (response.policyNo === policyNo))
    if (productCode[0]?.productCode) {
      // Need to remove the comments once the renew flow is completed
      // switch(productCode[0].productCode){
      //   case 'TRVL':
      //     navigateTo && navigateTo('/Travel/QuoteAndBuy')
      //     break;
      //   case 'HOME':
      //     navigateTo && navigateTo('/personal/home/quote-buy')
      //     break;
      //   case 'RMTPL':
      //     navigateTo &&  navigateTo('/Motor/QuoteAndBuy')
      //     break;
      //   default:
      //     break;
      // }
    }
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

  const renewButtons = [
    {
      title: (languageData as { renew: string })?.renew,
      variant: 'outline',
      classes: 'renew-now walaa-medium-500',
      onClick: (productCode: string) => {
        handleNavigate(productCode);
      }
    },
    {
      title: (languageData as { remind_me_later: string })?.remind_me_later,
      variant: 'remindLater',
      classes: 'remind-later walaa-regular-400',
      onClick: (productCode: string) => {
        handleRemindLater(productCode);
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
                  handleClick={() => button.onClick(val?.policyNo)}
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
