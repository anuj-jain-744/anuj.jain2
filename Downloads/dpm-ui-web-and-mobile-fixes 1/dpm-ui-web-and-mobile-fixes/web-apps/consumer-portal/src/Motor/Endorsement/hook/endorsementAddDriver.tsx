import { useState, useCallback } from 'react';
import { callAPI } from "@dpm/shared-module";

export const useEndorsementAddDriverApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const makeApiCall1 = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const {
      VITE_ENDORSEMENT_ADD_DRIVER_BASE_URL,
      VITE_CONTENT_SAG_USERNAME,
      VITE_CONTENT_SAG_PASSWORD,
    } = import.meta.env;

    const username = VITE_CONTENT_SAG_USERNAME;
    const password = VITE_CONTENT_SAG_PASSWORD;

    if (!username || !password) {
      setError('API credentials are not set');
      setIsLoading(false);
      return;
    }

    // Encode the username and password for Basic Auth
    const encoded = btoa(`${username}:${password}`);

    const requestBody = {
    
            apiSource: "Portal",
            policyNo: "P-ER1-24-331-000367",
            endoRequestReferenceNo: "EDRN-24-0002657578",
            endoEffectiveDate: "2024-07-09",
            createdBy: "10327",
            smeProduct: false,
            vehicles: [
                {
                    drivers: [
                        {
                            mainDriverInd: "N",
                            usagePercentage: 2,
                            nationality: "Saudi",
                            driverIDType: 2,
                            driverID: "1061105878",
                            driverName: "SALMAN EID ALANAZI",
                            driverNameArabic: "سلمان عيد العنزي",
                            relation: 3,
                            dateofBirth: "1987-12-02",
                            dateofBirthH: "11-04-1408",
                            gender: "M",
                            occupation: "",
                            educationLevel: 0,
                            maritalStatusCd: 0,
                            childrenBelow16: 0,
                            workCompanyName: "Walaa",
                            workCityCode: "",
                            homeCityCode: "",
                            homeAddress: "",
                            licenseType: 5,
                            licenseYear: 1,
                            licenseExpiryDateH: "",
                            nCDFreeYears: 0,
                            noOfAccidents: 0,
                            noOfClaims: 0,
                            unitNo: "-",
                            buildingNumber: "7945",
                            streetName: "",
                            district: "حي الشقة",
                            city : "بريدة",
                            additionalNumber: "",
                            postalCode: "52564",
                            healthConditions: "6",
                            trafficViolations: "2",
                            validDrivingLicenses: [
                                {
                                    licenseCountry: "Yemen",
                                    licenseYears: 1
                                }
                            ]
                        }
                    ]
                }
            ]
        
    };

    try {
      const responseStatus = await callAPI('post', VITE_ENDORSEMENT_ADD_DRIVER_BASE_URL, requestBody, {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json'
      });

      setData(responseStatus);
      return responseStatus;

    } catch (err) {
      console.error('Error:', err);
      setError(`API call failed: ${err.message || 'Unknown error'}`);
      return null;

    } finally {
      setIsLoading(false);
    }
  }, []);

  return { makeApiCall1, isLoading, error, data };
};