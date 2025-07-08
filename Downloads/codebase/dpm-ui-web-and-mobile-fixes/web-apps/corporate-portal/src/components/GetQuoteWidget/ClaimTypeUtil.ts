//najm case
export const Najm_Case = (casenumber: string): boolean => {
  // Rule: total length between 9 to 12, first two characters are alphabets, and the rest are numbers
  const regex = /^[A-Za-z]{2}\d{7,10}$/;
  return regex.test(casenumber);
};

//najm case crossed 48hrs or not checker
export const isCrossed48Hours = (input: string): boolean => {
  // Validate the length of the input string
  if (input.length < 9 || input.length > 12) {
    return false;
  }

  // Extract date, month, and year from the input string
  const date = parseInt(input.slice(2, 4), 10);
  const month = parseInt(input.slice(4, 6), 10) - 1; // Months are 0-indexed in JavaScript Date
  const year = parseInt(input.slice(6, 8), 10);

  // Determine the century of the year
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const fullYear = year + currentCentury;

  // Construct a date object from the extracted values
  const inputDate = new Date(fullYear, month, date);

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();

  // Convert the difference to hours
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  // Check if the difference is greater than 48 hours
  return differenceInHours >= 48;
};

export const replaceMobileNumber = (mobileNumber?: string): string => {
  let mobileNum: string = mobileNumber ? mobileNumber?.toString() : "";
  if (mobileNum?.length === 12) {
    const regex = /^966/;
    if (regex.test(mobileNum)) {
      mobileNum = mobileNum.replace(regex, "0");
    }
  }   
  return mobileNum;  
}

export const checkMobileNumberStartingWithZero = (mobilenum:string):string=>{
  if (!mobilenum?.startsWith("0")) {
     return  "0" + mobilenum;
  }
  return mobilenum;
}