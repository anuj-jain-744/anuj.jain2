import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TravelerEstimate from "./index"; 
jest.mock("../../../../corporate-portal/src/components/Calendar/fullcalender", () => {
  return {
    __esModule: true,
    FullCalender: () => <div data-testid="mock-fullcalendar">Mock FullCalendar</div>,
  };
});
jest.mock("../../../../corporate-portal/src/components/ThemeCheckButton", () => {
  return {
    __esModule: true,
    default: () => <button data-testid="mock-theme-check-button">Mock Theme Check Button</button>,
  };
});

describe("TravelerEstimate Component", () => {
  const mockData = {
    estimate_description: "Estimate Description",
    estimate_popup: "Popup Info",
    date_of_loss: "Date of Loss",
    traveller_passport_exp_date_placeholder: "Select Date",
    cause_of_loss_text: "Cause of Loss",
    estimated_loss_text: "Estimated Loss",
    travellers_impacted: "Travellers Impacted",
    description_of_loss: "Description of Loss",
    upload_doc_text: "Upload Documents",
    supported_file_type: "Supported file types: PDF, PNG, JPEG",
    estimate_text: "Estimate",
    estimate_upload_msg: "All files uploaded successfully",
    cause_of_loss: [
      { code: "COL1", value: "Cause 1", sub_values: ["Sub 1"] },
      ],
  };

  it("renders the component with initial data", () => {
    render(<TravelerEstimate data={mockData} />);
    expect(screen.getByTestId("estimatemain")).toHaveTextContent(
      "Estimate Description"
    );
    expect(screen.getByText("+ Add Estimate")).toBeInTheDocument();
  });

  it("adds a new accordion when 'Add Estimate' button is clicked", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    expect(screen.getByText("Estimate 1")).toBeInTheDocument();
  });

  it("removes an accordion when the delete button is clicked", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    expect(screen.getByText("Estimate 1")).toBeInTheDocument();
    const deleteButton = screen.getByAltText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Estimate 1")).not.toBeInTheDocument();
  });

  it("disables the 'Add Estimate' button when required fields are missing", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    expect(addButton).toBeDisabled();
  });

  it("handles file upload correctly", async () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: "COL1" } });
    expect(dropdown.value).toBe("COL1");
    const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
    const file = new File(["dummy content"], "example.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0].name).toBe("example.pdf");
    expect(fileInput.files?.[0].type).toBe("application/pdf");
  });

  it("shows an error message for invalid file types", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: "COL1" } });
    expect(dropdown.value).toBe("COL1");
    const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
    const file = new File(["dummy content"], "example.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
  });

  it("shows an error message for files exceeding the maximum size limit", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: "COL1" } });
    expect(dropdown.value).toBe("COL1");
    const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "largeFile.pdf", {
      type: "application/pdf",
    }); 
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(fileInput.value).toBe("");
  });

  it("removes a file and displays a toast message", () => {
    render(<TravelerEstimate data={mockData} />);
    const addButton = screen.getByText("+ Add Estimate");
    fireEvent.click(addButton);
    const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: "COL1" } });
    expect(dropdown.value).toBe("COL1");
    const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
    const file = new File(["dummy content"], "example.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0].name).toBe("example.pdf");

  });
    it("displays the cancel icon when a file is uploaded", () => {
      render(<TravelerEstimate data={mockData} />);
      const addButton = screen.getByText("+ Add Estimate");
      fireEvent.click(addButton);
      const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
      fireEvent.change(dropdown, { target: { value: "COL1" } });
      expect(dropdown.value).toBe("COL1");
      const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
      const file = new File(["dummy content"], "example.pdf", {
        type: "application/pdf",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(fileInput.files).toHaveLength(1);
      expect(fileInput.files?.[0].name).toBe("example.pdf");
      const cancelIcon = screen.getByAltText("cancel_icon");
      expect(cancelIcon).toBeInTheDocument();
    });

    it("removes the file when the cancel icon is clicked", () => {
      render(<TravelerEstimate data={mockData} />);
      const addButton = screen.getByText("+ Add Estimate");
      fireEvent.click(addButton);
      const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
      fireEvent.change(dropdown, { target: { value: "COL1" } });
      expect(dropdown.value).toBe("COL1");
      const fileInput = screen.getByTestId("file-input-0") as HTMLInputElement;
      const file = new File(["dummy content"], "example.pdf", {
        type: "application/pdf",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(fileInput.files).toHaveLength(1);
      expect(fileInput.files?.[0].name).toBe("example.pdf");
      expect(fileInput.value).toBe("");
      expect(screen.getByText("File Removed for Sub 1")).toBeInTheDocument();
      expect(fileInput.value).toBe("");
      expect(screen.getByText("File Removed for Sub 1")).toBeInTheDocument();
    });

    it("does not display the cancel icon when no file is uploaded", () => {
      render(<TravelerEstimate data={mockData} />);
      const addButton = screen.getByText("+ Add Estimate");
      fireEvent.click(addButton);
      const dropdown = screen.getByLabelText("Default select example") as HTMLSelectElement;
      fireEvent.change(dropdown, { target: { value: "COL1" } });
      expect(dropdown.value).toBe("COL1");
      const cancelIcon = screen.queryByAltText("cancel_icon");
       expect(cancelIcon).not.toBeInTheDocument();
    });
     
});
