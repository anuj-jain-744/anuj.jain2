import React from "react";
import { render } from "@testing-library/react";
import RightContainer from "./RightContainer";

// Mock the child components
jest.mock("../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo", () => () => <div>ClaimVehicleInfo</div>);
jest.mock("./DownloadDocLink/DownloadDocLink", () => () => <div>DownloadDocLink</div>);
jest.mock("./ContactCard/ContactCard", () => () => <div>ContactCard</div>);

describe("RightContainer", () => {
  it("renders correctly with given languageData", () => {
    const mockLanguageData = { key1: "value1", key2: "value2" };

    const { getByText } = render(<RightContainer languageData={mockLanguageData} />);

    expect(getByText("ClaimVehicleInfo")).toBeInTheDocument();
    expect(getByText("DownloadDocLink")).toBeInTheDocument();
    expect(getByText("ContactCard")).toBeInTheDocument();
  });
});
