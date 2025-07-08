import React from 'react';
import { toast, ToastOptions, ToastTransition, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './ThemeAlertNotification.module.scss';
import { TOAST_AUTOCLOSE_TIMER } from '@dpm/shared-module';
import closeIconWhite from 'assets/CommonSVG/closeIconWhite.svg';

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
        {description && (
          <div className={`${style['notification-description']} ${descriptionClassName}`}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

// Add a ref to track active toasts and prevent duplicates
const activeToasts = new Set<string>();

// Custom close button component
const CustomCloseButton: React.FC<{ closeToast?: () => void }> = ({ closeToast }) => {
  return (
    <button className={style['custom-close-button']} onClick={closeToast}>
      <img src={closeIconWhite} alt="Close icon" />
    </button>
  );
};

// Function to show notifications with duplicate prevention
export const showNotification = ({
  title,
  description,
  type,
  icon,
  duration = TOAST_AUTOCLOSE_TIMER || false,
  position = 'top-center',
  transition,
  containerClassName = '',
  contentClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
}: NotificationProps) => {
  
  // Create a unique key for this notification
  const notificationKey = `${type}-${title}-${description}`;
  
  // Prevent duplicate notifications
  if (activeToasts.has(notificationKey)) {
    return;
  }
  
  // Add to active toasts
  activeToasts.add(notificationKey);
  
  const options: ToastOptions = {
    className: `${style['notification-wrapper']} ${style[type]}`,
    bodyClassName: style['notification-body'],
    autoClose: duration === false ? false : duration,
    closeOnClick: duration !== false,
    pauseOnHover: true,
    draggable: true,
    position,
    transition,
    hideProgressBar: false,
    newestOnTop: true,
    rtl: false,
    pauseOnFocusLoss: true,
    closeButton: <CustomCloseButton />,
    onClose: () => {
      activeToasts.delete(notificationKey);
    },
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

// Export ToastContainer with proper styling
export const NotificationContainer = () => (
  <ToastContainer
    className={style['toast-container']}
    toastClassName={style['toast']}
    bodyClassName={style['toast-body']}
    progressClassName={style['toast-progress']}
    position="top-center"
    autoClose={TOAST_AUTOCLOSE_TIMER || false}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    closeButton={<CustomCloseButton />}
  />
);