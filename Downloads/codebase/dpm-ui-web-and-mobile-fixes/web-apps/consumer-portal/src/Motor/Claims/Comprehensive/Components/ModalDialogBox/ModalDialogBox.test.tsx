import { render, screen, fireEvent } from "@testing-library/react";
import ModalDialogBox from "."; 
import { DataContext } from "../../../../../DataContext"; 

// Mock the ThemeButton component as needed for the test
jest.mock("components/ThemeComponents/ThemeButton", () => ({
  __esModule: true,
  default: ({ onClickhandler, title }: { onClickhandler: () => void; title: string }) => (
    <button onClick={onClickhandler}>{title}</button>
  ),
}));

const mockData = {
  claim_registration_details: "Claim Registration Details",
  popup_subtitle_one: "<b>Subtitle One</b>",
  popup_body_content_one: [
    { value: "Item 1" },
    { value: "Item 2" },
  ],
  popup_subtitle_two: "<b>Subtitle Two</b>",
  popup_body_content_two: [
    { value: "Item A" },
    { value: "Item B" },
  ],
  https_motorclaims_walaa_co: "https://example.com",
  walaa_com: "Walaa.com",
  ok: "OK",
};

describe("ModalDialogBox", () => {
  it("renders the modal and displays content", () => {
    // Render the component with the DataContext provider
    render(
      <DataContext.Provider value={mockData}>
        <ModalDialogBox isModal={true} handleClose={jest.fn()} />
      </DataContext.Provider>
    );

    // Check if the modal header content is displayed correctly
    expect(screen.getByText(mockData.claim_registration_details)).toBeInTheDocument();
    
    // Check if subtitle one and its HTML is displayed correctly
    expect(screen.getByText("Subtitle One")).toBeInTheDocument();
    
    // Check if list items are rendered correctly
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    
    // Check if subtitle two and its HTML are displayed correctly
    expect(screen.getByText("Subtitle Two")).toBeInTheDocument();
    
    // Check if second list items are rendered correctly
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    
    // Check if the link is present
    expect(screen.getByText("Walaa.com")).toHaveAttribute('href', 'https://example.com');
    
    // Check if the OK button is rendered
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("calls handleClose when the OK button is clicked", () => {
    const handleCloseMock = jest.fn();

    // Render the component with the mock handleClose function
    render(
      <DataContext.Provider value={mockData}>
        <ModalDialogBox isModal={true} handleClose={handleCloseMock} />
      </DataContext.Provider>
    );

    // Simulate a click on the OK button
    fireEvent.click(screen.getByText("OK"));
    
    // Ensure that handleClose is called
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does not display modal when isModal is false", () => {
    // Render the component with isModal set to false
    render(
      <DataContext.Provider value={mockData}>
        <ModalDialogBox isModal={false} handleClose={jest.fn()} />
      </DataContext.Provider>
    );

    // Ensure the modal is not rendered
    expect(screen.queryByText(mockData.claim_registration_details)).toBeNull();
  });
});
