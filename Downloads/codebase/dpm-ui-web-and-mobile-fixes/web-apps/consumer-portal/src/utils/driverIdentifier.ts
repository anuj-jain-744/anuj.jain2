export const getDriverIdentifier = (driverID: string | undefined, languageData: any): string | null => {
    if (driverID?.startsWith("1")) {
      return languageData?.national_id;
    } else if (driverID?.startsWith("2")) {
      return languageData?.iqama_no;
    }
    return null;
  };