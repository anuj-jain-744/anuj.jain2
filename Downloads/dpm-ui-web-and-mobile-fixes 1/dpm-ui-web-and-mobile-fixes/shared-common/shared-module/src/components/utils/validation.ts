/**
 * This function checks if the input value is a valid number string
 * based on the specified minimum and optional maximum number of digits.
 *
 * @param inputValue - The value to check. It can be a string or a number.
 * @param minDigit - The minimum number of digits the input should have.
 * @param maxDigit - The optional maximum number of digits the input can have. If not provided, minDigit will be used.
 *
 * @returns boolean - Returns true if the input is a valid number string with the length between
 *                    minDigit and maxDigit (inclusive), otherwise false.
 */
export const isValidInputRegex = (
  inputValue: string | number,
  minDigit: number,
  maxDigit?: number
): boolean => {
  // Convert the input value to a string, as we need to check the length
  const value = String(inputValue);

  // Create a regular expression to check if the value is a number with the specified length
  // If maxDigit is not provided, it defaults to minDigit, meaning the value should have exactly minDigit digits
  const regex = new RegExp(`^\\d{${minDigit},${maxDigit ?? minDigit}}$`);

  // Return true if the input matches the regex pattern, otherwise false
  return regex.test(value);
};

export const checkPhoneNumberStarts = (value: string) => {
  const saudiMobileRegex = /^05\d{8}$/;
  return saudiMobileRegex.test(value) && value.length === 10;
};

export function isValidEmail(email: string) {
  const regex =
    /^\S+(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/;
  return regex.test(email);
}

export const getLabelOfIqmaIdNationalId = (
  input: string,
  language: {
    national_id: string;
    iqama_no: string;
    field_corporate_id: string;
  }
) => {
  const { national_id, iqama_no, field_corporate_id } = language;
  if (input && language && /^[1]\d{0,9}$/.test(input)) {
    //tesing for first number to be 1 and no characters
    return national_id;
  }
  if (input && language && /^[2]\d{0,9}$/.test(input)) {
    //tesing for first number to be 2 and no characters
    return iqama_no;
  }
  if (input && language && /^[7]\d{0,9}$/.test(input)) {
    //tesing for first number to be 7 and no characters
    return field_corporate_id;
  }
  return national_id ?? "";
};

export const validateHomePoliciesCount = (
  input: string,
  homePolicesCount: number,
  homeActivePolicy: { nationalid: number; iqamaid: number }
) => {
  if (
    homePolicesCount > homeActivePolicy?.nationalid &&
    /^[1]\d{0,9}$/.test(input)
  ) {
    //tesing for first number to be 1 and no characters
    return true;
  }
  if (
    homePolicesCount > homeActivePolicy?.iqamaid &&
    /^[2]\d{0,9}$/.test(input)
  ) {
    //tesing for first number to be 2 and no characters
    return true;
  }
  return false;
};

export const iqmaIdNationalIdValidation = (input) => {
  if (input === "") {
    return false;
    // if blank then no error
  } else if (
    input.length > 0 &&
    (!/^[127]/.test(input) || !/\d$/.test(input))
  ) {
    //tesing for first number to be 1, 2 or 7 and no characters
    return true;
  } else if (input.length > 10) {
    //not correct format
    return true;
  }
  if (input.length === 10 && !/^[127]\d{0,9}$/.test(input)) {
    //testing for 10 digits
    return true;
  }
  return false;
};

export const iqmaIdNationalIdValidationOnBlur = (input) => {
  let flag = false;
  // Validate input: up to 10 digits and starts with 1, 2, or 7
  if (
    !(input === "" || (input.length === 10 && /^[127]\d{0,9}$/.test(input)))
  ) {
    flag = true;
  }
  return flag;
};

export const refNoValidation = (input: string) => {
  if (input === "") {
    // if blank then no error
  } else if (input.length > 0) {
    if (/^[A-Za-z]/.test(input)) {
      //## Najm case ##
      //## Najm case ## reference number starts with 2 alphabets followed by 7 to 10 digits
      if (/^[A-Za-z]{0,2}[0-9]{0,10}$/.test(input)) {
        //correct format
      } else {
        return false;
      }
    } else if (/^[4567]/.test(input)) {
      //## Police case ##
      //## Police case ## reference number starts with 4,5,6 or 7 and with 10 numeric characters.
      if (!/\d$/.test(input) || input.length > 10) {
        // all should be digit otherwise error
        return false;
      } else if (input.length === 10 && !/^[4567][0-9]{0,10}$/.test(input)) {
        //invalid format
        return false;
      }
    } else if (/^[123890]/.test(input)) {
      //## Other case ##
      //## Other case ## reference number starts with 1,2,3,8,9,0
      //as of now it is not defined so no validation
      if (!/\d$/.test(input) || input.length > 30) {
        return false;
      }
    }
  }
  return true;
};

export const refNoValidationOnBlur = (input: string) => {
  let flag = false;
  if (input === "") {
    // if blank then no error
  } else if (input.length > 0) {
    if (/^[A-Za-z]/.test(input)) {
      //## Najm case ##
      //## Najm case ## reference number starts with 2 alphabets followed by 7 to 10 digits
      if (input.length > 8 && /^[A-Za-z]{0,2}[0-9]{0,10}$/.test(input)) {
        //correct format
      } else {
        flag = true;
      }
    } else if (/^[4567]\d{9}$/.test(input)) {
      //## Police case ##
      //## Police case ## reference number starts with 4,5,6 or 7 and with 10 numeric characters.
      flag = true;
    } else if (/^[123890]/.test(input)) {
      //## Other case ##
      //## Other case ## reference number starts with 1,2,3,8,9,0
      //as of now it is not defined so no validation
      if (input.length < 3 || input.length > 30 || !/\d$/.test(input)) {
        flag = true;
      }
    }
  }
  return flag;
};
// for SMS/Email OTP Link Validation
export const claimIdCaseNoValidation = (
  claimIdinput: string,
  ownerIdInput: string
) => {
  let flag = false;

  if (claimIdinput && ownerIdInput === "") {
    // if blank then no error
    return flag;
  } else if (claimIdinput.length > 0 && ownerIdInput.length > 0) {
    // Check for ClaimNo format
    if (
      /^C-[A-Z]{2}\d{1}-\d{2}-\d{3}-\d{6}$/.test(claimIdinput) ||
      /^C-[A-Z]\d{2}-\d{2}-\d{3}-\d{6}$/.test(claimIdinput)
    ) {
      flag = true;
    }
    // Check for Owner ID format
    else if (
      ownerIdInput.length === 10 &&
      /^[127]\d{0,9}$/.test(ownerIdInput)
    ) {
      flag = true;
    }
  }

  return flag;
};

export const claimIdValidation = (input: string) => {
  if (input === "") {
    // if blank then no error
  } else if (input.length > 0) {
  }
  return true;
};

export const claimIdValidationOnBlur = (input: string) => {
  let flag = false;
  if (input === "") {
    // if blank then no error
  } else if (input.length > 0) {
    if (
      !(
        (input.length === 19 && /^C-([A-Z]\d{2}|[A-Z]{2}\d)-\d{2}-\d{3}-\d{6}$/.test(input)) ||
        (input.length === 21 && /^C-([A-Z]\d{2}|[A-Z]{2}\d)-\d{2}-\d{5}-\d{6}$/.test(input))
      )
    ) {
      flag = true;
    }
  }
  return flag;
};

//Check input length and format as per Saudi National ID/Iqama No
export const checkNationalIdFormat = (
  value: string,
  format = false
): boolean => {
  const saudiNationalIdFormat = /^[127]\d{9}$/;
  return format ? saudiNationalIdFormat.test(value) : value.length === 10;
};

export const checkInputStringMinMax = (
  value: string,
  min: number = 3,
  max: number = 20
) => {
  return value.length >= min && value.length <= max;
};

export const validateIBAN = (iban) => {
  if (/\s/.test(iban)) {
    return false;
  }

  iban = iban.replace(/\s+/g, "").toUpperCase();

  if (!/^SA\d{2}[A-Z0-9]{20}$/.test(iban)) {
    return false;
  }

  const country = iban.substring(0, 2);
  const ibanLength = 24;

  if (country !== "SA" || iban.length !== ibanLength) {
    return false;
  }

  const ibanDigits = (iban.substring(4) + iban.substring(0, 4)).replace(
    /[A-Z]/g,
    (char) => char.charCodeAt(0) - 55
  );
  if (BigInt(ibanDigits) % 97n !== 1n) {
    return false;
  }

  return true;
};

export const validateIbanNonSA = (inputString) => {
  // Check if the input is exactly 24 characters
  if (inputString.length !== 24) {
    return false;
  }
  
  // Check if the first 2 characters are alphabets
  if (!/^[A-Z]{2}$/.test(inputString.substring(0, 2))) {
    return false;
  }

  // Check if the last 22 characters are digits
  if (!/^\d{22}$/.test(inputString.substring(2))) {
    return false;
  }

  return true;
}


// function checks if a given string contains only alphanumeric characters (letters and numbers)
// If the input matches this pattern, it returns the trimmed version of the string; otherwise, it returns an empty string
export const validateInput = (value: string) => {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(value) ? value.trim() : "";
};

export const formatFileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

export const validateBuildYear = (
  year: string,
  maxYear: number,
  validationError: string
) => {
  const currentYear = new Date().getFullYear();
  const yearNumber = parseInt(year, 10);
  if (
    isNaN(yearNumber) ||
    yearNumber < currentYear - maxYear ||
    yearNumber > currentYear
  ) {
    return validationError;
  }
  return null;
};

export function isValidSubscribeEmail(email: string) {
  const regex = /^\S+@[a-zA-Z]+\.(com|co.in)$/;
  return regex.test(email);
}
