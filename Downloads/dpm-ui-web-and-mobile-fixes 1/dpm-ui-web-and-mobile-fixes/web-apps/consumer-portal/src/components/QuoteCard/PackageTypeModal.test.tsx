import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PackageTypeModal from "./PackageTypeModal";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import DoneIcon from "@mui/icons-material/Done";

jest.mock("assets/QuoteAndBuy/closeIcon.svg", () => "closeIcon");
jest.mock("@mui/icons-material/Done", () => () => <div data-testid="done-icon" />);

const mockPackageData = [
  { itemname: "Package 1" },
  { itemname: "Package 2" },
];

describe("PackageTypeModal", () => {
  test("renders modal when show is true", () => {
    render(
      <PackageTypeModal
        show={true}
        onHide={jest.fn()}
        packageData={mockPackageData}
        title="Test Title"
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByAltText("close icon")).toBeInTheDocument();
    expect(screen.getByText("Package 1")).toBeInTheDocument();
    expect(screen.getByText("Package 2")).toBeInTheDocument();
  });

  test("does not render modal when show is false", () => {
    render(
      <PackageTypeModal
        show={false}
        onHide={jest.fn()}
        packageData={mockPackageData}
        title="Test Title"
      />
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  test("calls onHide when close icon is clicked", () => {
    const onHideMock = jest.fn();
    render(
      <PackageTypeModal
        show={true}
        onHide={onHideMock}
        packageData={mockPackageData}
        title="Test Title"
      />
    );

    fireEvent.click(screen.getByAltText("close icon"));
    expect(onHideMock).toHaveBeenCalledTimes(1);
  });

  test("renders package items correctly", () => {
    render(
      <PackageTypeModal
        show={true}
        onHide={jest.fn()}
        packageData={mockPackageData}
        title="Test Title"
      />
    );

    const packageItems = screen.getAllByTestId("done-icon");
    expect(packageItems).toHaveLength(mockPackageData.length);
    expect(screen.getByText("Package 1")).toBeInTheDocument();
    expect(screen.getByText("Package 2")).toBeInTheDocument();
  });
});