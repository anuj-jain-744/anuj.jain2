import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ActionLinks from "./ActionLinks"; // Assuming ActionLinks is in the same directory
import Download from "assets/SuccessPage/Download.svg";
import Share from "assets/SuccessPage/Share.svg";

const mockLanguageData = {
  download_policy: "Download Policy",
  download_payment_receipt: "Download Payment Receipt",
  share: "Share",
};

const mockHandleDownloadPolicy = jest.fn();

describe("ActionLinks Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid side effects
  });

  test("should render ActionLinks component with correct text and icons", () => {
    render(
      <ActionLinks languageData={mockLanguageData} handleDownloadPolicy={mockHandleDownloadPolicy} />
    );

    // Check if the correct texts are displayed
    expect(screen.getByText(/Download Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Payment Receipt/i)).toBeInTheDocument();
    expect(screen.getByText(/Share/i)).toBeInTheDocument();

    // Check if the correct icons are rendered (this will check if the img src is correct)
    const downloadIcons = screen.getAllByAltText(/Download Policy/i);
    expect(downloadIcons[0].src).toContain(Download);

    const shareIcon = screen.getByAltText(/Share/i);
    expect(shareIcon.src).toContain(Share);
  });

  test("should call handleDownloadPolicy when download policy is clicked", () => {
    render(
      <ActionLinks languageData={mockLanguageData} handleDownloadPolicy={mockHandleDownloadPolicy} />
    );

    // Click on the 'Download Policy' link
    const downloadPolicyLink = screen.getByText(/Download Policy/i);
    fireEvent.click(downloadPolicyLink);

    // Ensure the handleDownloadPolicy function was called
    expect(mockHandleDownloadPolicy).toHaveBeenCalledTimes(1);
  });

  test("should not render ActionLinks component when languageData is missing", () => {
    const languageData = {};

    render(<ActionLinks languageData={languageData as any} />);

    // Check if none of the action links are rendered
    expect(screen.queryByText(/Download Policy/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download Payment Receipt/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Share/i)).not.toBeInTheDocument();
  });
});
