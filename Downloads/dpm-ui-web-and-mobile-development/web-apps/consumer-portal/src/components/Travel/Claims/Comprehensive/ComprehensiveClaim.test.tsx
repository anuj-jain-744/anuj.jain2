import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ComprehensiveClaim from ".";

const ClaimsInfo = {
  refNo: "RD0202231954",
  ownerId: "2526837972",
  SourceType: 2,
};

const claimCheckData = {
  
      "status": null,
      "referenceNo": "1729623190426",
      "sequenceNo": "600367710",
      "claimRequestType": "OD",
      "caseReportId": null,
      "ownerId": null,
      "vehicleOwnerDob": null,
      "vehicleOwnerDobArabicH": null,
      "liability": "100",
      "mobileNo": "966551025396",
      "feedback": null
 
}

describe("RegisterClaim", () => {
  it("1. load component", () => {
    render(
        <ComprehensiveClaim
          type="OD"
          module="motor"
          claimCheckData={claimCheckData}
          claimsInfo={ClaimsInfo}
        />
    );

    expect(screen.getByTestId("registerclaim-test")).toBeInTheDocument();
  });
});
