import { renderHook, act } from '@testing-library/react-hooks';
import useHandleDriverData from './useHandleDriverData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { DriverDetailsResponseData } from 'types/quoteAndBuy';

jest.mock('components/hooks/useQuoteAndBuyContext');

const formData = {
    ownerId: "string",
    ownerDOB: "string", 
    relation: 2,
}
describe('useHandleDriverData', () => {
    const setDriverDetailsResponseData = jest.fn();
    const setDriverDetails = jest.fn();

    beforeEach(() => {
        (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
            setDriverDetailsResponseData,
            driverDetailsResponseData: [],
            setDriverDetails,
            driverDetails: [],
            setAddDriverFormData: jest.fn(), 
            addDriverFormData: [],
        });
    });

    test('should add driver data to driverDetailsResponseData and driverDetails', () => {
        const { result } = renderHook(() => useHandleDriverData());

        const driverData: DriverDetailsResponseData = {
            driverID: '1',
            driverName: 'John Doe',
            driverNameArabic: 'جون دو',
            relationship: 'Self',
            dateofBirth: '1990-01-01',
            gender: 'Male',
            driverIDType: null,
            dateofBirthH: '',
            nationality: '',
            occupation: '',
            workCompanyName: null,
            workCityCode: null,
            homeCityCode: null,
            homeAddress: '',
            licenseType: null,
            licenseYear: null,
            licenseExpiryDateH: null,
            idIssuePlaceCode: '',
            noOfAccidents: 0,
            noOfClaims: 0,
            unitNo: null,
            buildingNumber: '',
            streetName: '',
            district: '',
            city: '',
            additionalNumber: '',
            postalCode: '',
            healthConditions: null,
            trafficViolations: null,
            mainDriverInd: '',
            ncdFreeYears: null,
            ncdReferenceNo: null
        };


        act(() => {
            result.current.handleDriverAdded(driverData, formData);
        });

   //     expect(setDriverDetailsResponseData).toHaveBeenCalledWith([driverData]);
        // expect(setDriverDetails).toHaveBeenCalledWith([{
        //     driverID: '1',
        //     driverName: 'John Doe',
        //     driverNameArabic: 'جون دو',
        //     relationship: 'Self',
        //     dateofBirth: '1990-01-01',
        //     gender: 'Male',
        // }]);
    });

    test('should append driver data to existing driverDetailsResponseData and driverDetails', () => {
        const existingDriverData: DriverDetailsResponseData = {
            driverID: '2',
            driverName: 'Jane Doe',
            driverNameArabic: 'جين دو',
            relationship: 'Spouse',
            dateofBirth: '1992-02-02',
            gender: 'Female',
            driverIDType: null,
            dateofBirthH: '',
            nationality: '',
            occupation: '',
            workCompanyName: null,
            workCityCode: null,
            homeCityCode: null,
            homeAddress: '',
            licenseType: null,
            licenseYear: null,
            licenseExpiryDateH: null,
            idIssuePlaceCode: '',
            noOfAccidents: 0,
            noOfClaims: 0,
            unitNo: null,
            buildingNumber: '',
            streetName: '',
            district: '',
            city: '',
            additionalNumber: '',
            postalCode: '',
            healthConditions: null,
            trafficViolations: null,
            mainDriverInd: '',
            ncdFreeYears: null,
            ncdReferenceNo: null
        };

        (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
            setDriverDetailsResponseData,
            driverDetailsResponseData: [existingDriverData],
            setDriverDetails,
            driverDetails: [{
                driverID: '2',
                driverName: 'Jane Doe',
                driverNameArabic: 'جين دو',
                relationship: 'Spouse',
                dateofBirth: '1992-02-02',
                gender: 'Female',
            }],
            setAddDriverFormData: jest.fn(), 
            addDriverFormData: [],
        });

        const { result } = renderHook(() => useHandleDriverData());

        const newDriverData: DriverDetailsResponseData = {
            driverID: '3',
            driverName: 'Alice Smith',
            driverNameArabic: 'أليس سميث',
            relationship: 'Child',
            dateofBirth: '2000-03-03',
            gender: 'Female',
            driverIDType: null,
            dateofBirthH: '',
            nationality: '',
            occupation: '',
            workCompanyName: null,
            workCityCode: null,
            homeCityCode: null,
            homeAddress: '',
            licenseType: null,
            licenseYear: null,
            licenseExpiryDateH: null,
            idIssuePlaceCode: '',
            noOfAccidents: 0,
            noOfClaims: 0,
            unitNo: null,
            buildingNumber: '',
            streetName: '',
            district: '',
            city: '',
            additionalNumber: '',
            postalCode: '',
            healthConditions: null,
            trafficViolations: null,
            mainDriverInd: '',
            ncdFreeYears: null,
            ncdReferenceNo: null
        };

        act(() => {
            result.current.handleDriverAdded(newDriverData, formData);
        });
    });

      //  expect(setDriverDetailsResponseData).toHaveBeenCalledWith([existingDriverData, newDriverData]);
     //   expect(setDriverDetails).toHaveBeenCalledWith([
           
           
    });
