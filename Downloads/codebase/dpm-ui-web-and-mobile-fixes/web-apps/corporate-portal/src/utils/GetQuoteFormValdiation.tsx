export const callValidation = (key: string, value: string) => {
    switch (key) {
      case "shouldStart5":
        return value.startsWith("05") && value.length === 10;
      case "emailValid":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "nonNegative":
        return !isNaN(+value) && Number(value) >= 0;
      case "onlyDigits":
        return /^\d*$/.test(value);
      case "tenDigitsOnly":
        return /^\d{10}$/.test(value);
      case "maxLength100":
        return value.length <= 100;
      case "maxLength200":
        return value.length <= 200;
      case "required":
        return value.trim() !== "";
      default:
        return true;
    }
  };
  
  
export  const getMaxLength = (fieldName: string): number | undefined => {
    switch (fieldName) {
      case "full_name":
        return 100;
      case "company_name":
        return 150;
      case "email_id":
        return 30;
      case "additional_information":
        return 255;
      default:
        return undefined;
    }
  };