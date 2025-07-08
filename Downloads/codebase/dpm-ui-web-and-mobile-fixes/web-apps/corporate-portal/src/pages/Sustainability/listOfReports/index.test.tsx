import { render, screen, fireEvent } from "@testing-library/react";
import { ListOfReports } from "./index"; 
import { LORProps } from "./listOfReports.types";

describe("ListOfReports Component", () => {
  const mockNavigateTo = jest.fn();

  const mockProps: LORProps = {
    commonKeywords: {
      list_of_reports: "List of Reports",
      no_results_found: "No Results Found",
      no_result_found_description: "Try searching with different filters",
    },
    financialYears: ["2022", "2023", "2024"],
    reportData: [
      { financial_year: "2022", report_type: "Annual", file_name: "Report 2022", file_url: "/reports/2022" },
      { financial_year: "2023", report_type: "Annual", file_name: "Report 2023", file_url: "/reports/2023" },
    ],
    navigateTo: mockNavigateTo,
  };

  it("should render the header correctly", () => {
    render(<ListOfReports {...mockProps} />);
    expect(screen.getByText("List of Reports")).toBeInTheDocument();
  });

  it("should render the dropdown with financial years", () => {
    render(<ListOfReports {...mockProps} />);
    const dropdownButton=screen.getByRole('button');
    fireEvent.click(dropdownButton)
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("should update report selection on dropdown item click", () => {
    render(<ListOfReports {...mockProps} />);
    const dropdownButton=screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const dropdownItem = screen.getByText("2023");
    fireEvent.click(dropdownItem);
    expect(screen.getByText("Annual - Report 2023")).toBeInTheDocument();
  });

  it("should show a 'No Results Found' message when no reports exist for a year", () => {
    render(<ListOfReports {...mockProps} />);
    const dropdownButton=screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const dropdownItem = screen.getByText("2024");
    fireEvent.click(dropdownItem);
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });
});
