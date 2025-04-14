import { render, screen } from "@testing-library/react";
//import usePropertyPayload from "Home/QuoteAndBuy/hooks/usePropertyPayload";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import ContentBenefits from "../ContentBenefits";


let onHide = jest.fn();

jest.mock("context/PHQuoteBuyContext", () => ({
    usePHQuoteBuyContext: jest.fn(),
}));

//jest.mock("Home/QuoteAndBuy/hooks/usePropertyPayload");

describe("BenefitCard Component", () => {
    beforeEach(() => {
        (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
            homeConfig: {
                select_your_property: "Select Your Property",
                property: "Property",
                national_address: "National Address",
                placeholder_detail: "Please select your property from the list below.",
            },
            setselectedBuilding: jest.fn(),
            selectedBuilding: "0",
        });

        // (usePropertyPayload as jest.Mock).mockReturnValue({
        //     "schemeCode": "",
        //     "planCode": "",
        //     "ownerOrTenant": 0,
        //     "riskDescription": "",
        //     policyCustomer: [
        //         {
        //             "nationalId": "",
        //             "gender": "",
        //             "dateOfBirth": "",
        //             "nationality": ""
        //         },
        //     ],
        //     policyRisk: [
        //         {
        //             "cityDistrict": "Riyadh",
        //             "riskName": "Walaa Building",
        //             "yearofConstruction": 0,
        //             "buildingAge": 0,
        //             "noofFloors": 0,
        //             "question7Details": "question7",
        //             "country": "Saudi Arabia",
        //             "areaLocalityEn": "Main Road",
        //             "streetNameEn": "",
        //             "longitude": "",
        //             "latitude": "",
        //             "question7": 0,
        //             "question6": 0,
        //             "question5": 1,
        //             "question4": 1,
        //             "question3": 1,
        //             "question2": 1,
        //             "question1": 1
        //         }
        //     ]
        // });

    });
    it('renders a list of coverage description related to code from the array of object', () => {
        const items = [
            { 'code': 'EE', 'description': 'Test data' }
        ];
        render(<ContentBenefits show={true} onHide={onHide} languageData={{ "sar": "SAR" }} />);
        expect(screen.getByText("Test data")).toBeInTheDocument();
    })

});