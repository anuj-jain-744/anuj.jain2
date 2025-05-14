import React from 'react';
import { toast, ToastOptions, ToastTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './ThemeAlertNotification.module.scss';
import closeIconWhite from 'assets/CommonSVG/closeIconWhite.svg'

// Define the possible notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  title: string;
  description: string;
  type: NotificationType;
  icon?: React.ReactNode | string;
  duration?: number | false;
  position?: ToastOptions['position'];
  transition?: ToastTransition;
  containerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  toasterClassName?: string;
}

// Custom notification content component
const NotificationContent: React.FC<NotificationProps> = ({ 
  title, 
  description, 
  type, 
  icon,
  containerClassName = '',
  contentClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
}) => {
  return (
    <div className={`${style['custom-notification']} ${style[type]} ${containerClassName}`}>
      {icon && (
        <div className={`${style['notification-icon']} ${iconClassName}`}>
          {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
        </div>
      )}
      <div className={`${style['notification-content']} ${contentClassName}`}>
        <div className={`${style['notification-title']} ${titleClassName}`}>{title}</div>
        <div className={`${style['notification-description']} ${descriptionClassName}`}>{description}</div>
      </div>
    </div>
  );
};

// Function to show notifications
export const showNotification = ({
  title,
  description,
  type,
  icon,
  duration = false,
  position = 'top-right', // Default position
  transition, // Optional transition
  containerClassName = '',
  contentClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
}: NotificationProps) => {
  const options: ToastOptions = {
    className: `${style['notification-wrapper']} ${style[type]}`,
    autoClose: duration === false ? false : duration,
    closeOnClick: duration !== false,
    pauseOnHover: true,
    draggable: true,
    position,
    transition,
    closeButton: <CustomCloseButton />,
  };

  toast(
    <NotificationContent 
      title={title} 
      description={description} 
      type={type} 
      icon={icon}
      containerClassName={containerClassName}
      contentClassName={contentClassName}
      titleClassName={titleClassName}
      descriptionClassName={descriptionClassName}
      iconClassName={iconClassName}
    />, 
    options
  );
};

// Custom close button component
const CustomCloseButton: React.FC<{ closeToast?: () => void }> = ({ closeToast }) => {
    return (
      <button className={style['custom-close-button']} onClick={closeToast}>
        <img src={closeIconWhite} alt="Close icon" />
      </button>
    );
  };