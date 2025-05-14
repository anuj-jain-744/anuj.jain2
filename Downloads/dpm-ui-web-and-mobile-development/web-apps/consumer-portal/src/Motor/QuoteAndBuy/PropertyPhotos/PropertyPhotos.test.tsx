import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PropertyPhotos from ".";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import useFilesToBase64 from "@dpm/consumer-portal/src/claims/register/TrackClaim/hooks/useFilesToBase64";

// Mock necessary modules
jest.mock("context/PHQuoteBuyContext");
jest.mock(
  "@dpm/consumer-portal/src/claims/register/TrackClaim/hooks/useFilesToBase64"
);
jest.mock(
  "Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss",
  () => ({
    style: jest.fn(),
  })
);

// Dummy LanguageData for testing
const mockLanguageData = {
  property_pictures: "Property Pictures",
  guidelines_title: "Guidelines",
  guidelines_desc: ["Guideline 1", "Guideline 2"],
  drag_and_drop: "Drag and drop files here",
  supported_file_type: "Supported file types: .jpg, .png, .jpeg",
  or_label: "Or",
  browse_files: "Browse Files",
  property_photos_text: "Property photos text",
};

const mockSetPropertyPhotos = jest.fn();
const mockUseFilesToBase64 = useFilesToBase64 as jest.Mock;
describe("PropertyPhotos Component", () => {
  const setPropertyPhotos = jest.fn();
  const convertFilesToBase64 = jest.fn();
  const setFileData = jest.fn();
  beforeEach(() => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      setPropertyPhotos,
      propertyPhotos: [],
    });
    mockUseFilesToBase64.mockReturnValue({
      fileData: [],
      setFileData,
      convertFilesToBase64,
    });
  });

  it("should render without crashing and display the title", () => {
    render(
      <MemoryRouter initialEntries={["/test-route"]}>
        <PropertyPhotos languageData={mockLanguageData} />
      </MemoryRouter>
    );

    // Check if title renders correctly
    expect(
      screen.getByText(mockLanguageData.property_pictures)
    ).toBeInTheDocument();
  });

  it("should open modal when info icon button is clicked", () => {
    mockUseFilesToBase64.mockReturnValueOnce({
      fileData: [
        new File(["file content"], "example.png", { type: "image/png" }),
      ],
      setFileData,
      convertFilesToBase64,
    });
    render(
      <MemoryRouter initialEntries={["/test-route"]}>
        <PropertyPhotos languageData={mockLanguageData} />
      </MemoryRouter>
    );

    // Click the info icon to open the modal
    fireEvent.click(screen.getByRole("button"));

    // Check if modal opens and contains the guidelines
    expect(
      screen.getByText(mockLanguageData.guidelines_title)
    ).toBeInTheDocument();
    expect(screen.getByText("Guideline 1")).toBeInTheDocument();
    expect(screen.getByText("Guideline 2")).toBeInTheDocument();
  });

  it("should handle file input change", async () => {
    render(
      <MemoryRouter initialEntries={["/test-route"]}>
        <PropertyPhotos languageData={mockLanguageData} />
      </MemoryRouter>
    );

    const fileInput = screen.getByLabelText("Browse Files");
    const file = new File(["file content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(convertFilesToBase64).toHaveBeenCalledWith([file]);
  });

  it("should handle file drop", async () => {
    render(
      <MemoryRouter initialEntries={["/test-route"]}>
        <PropertyPhotos languageData={mockLanguageData} />
      </MemoryRouter>
    );
    const dropZone = screen
      .getByText("Drag and drop files here")
      .closest("div");
    const file = new File(["file content"], "example.png", {
      type: "image/png",
    });

    // Simulate drag-and-drop event
    fireEvent.drop(dropZone!, { dataTransfer: { files: [file] } });
    expect(convertFilesToBase64).toHaveBeenCalledWith([file]);
  });
  it("should remove file when remove button is clicked", async () => {
    mockUseFilesToBase64.mockReturnValueOnce({
      fileData: [
        new File(["file content"], "example.png", { type: "image/png" }),
      ],
      setFileData,
      convertFilesToBase64,
    });
    const mockFile = [
      { name: "test.jpg", base64: "data:image/jpg;base64,..." },
    ];

    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      setPropertyPhotos: mockSetPropertyPhotos,
      propertyPhotos: mockFile,
    });
    render(
      <MemoryRouter initialEntries={["/test-route"]}>
        <PropertyPhotos languageData={mockLanguageData} />
      </MemoryRouter>
    );

    // Click the remove button

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("remove-btnid"));
      // Check if the file removal function was called
      expect(setFileData).toHaveBeenCalledWith([]);
    });
  });
});
