import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterClaimModalDialog from ".";
import { DataContext } from "../../../../../DataContext"; 

// Mock the ThemeButton component as needed for the test
jest.mock("components/ThemeComponents/ThemeButton", () => ({
  __esModule: true,
  default: ({ onClickhandler, title }: { onClickhandler: () => void; title: string }) => (
    <button onClick={onClickhandler}>{title}</button>
  ),
}));

// Mocked data for DataContext
const mockData = {
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
};

describe("RegisterClaimModalDialog", () => {
  it("renders the modal and displays content when showRegModal is true", () => {
    // Render the component with the DataContext provider
    render(
      <DataContext.Provider value={mockData}>
        <RegisterClaimModalDialog showRegModal={true} setShowRegModal={jest.fn()} />
      </DataContext.Provider>
    );
    })
      it("closes the modal when the Ok button is clicked", async () => {
        const setShowRegModalMock = jest.fn();
    
        // Render the component with the DataContext provider
        render(
          <DataContext.Provider value={mockData}>
            <RegisterClaimModalDialog showRegModal={true} setShowRegModal={setShowRegModalMock} />
          </DataContext.Provider>
        );
    
        // Simulate a click on the Ok button
        fireEvent.click(screen.getByText("Ok"));
    
        // Check if the handleClose function is called and modal closes
        await waitFor(() => {
          expect(setShowRegModalMock).toHaveBeenCalledWith(false);
        });
      });
})

