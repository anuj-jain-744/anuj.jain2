import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderBranchCard } from "../renderBranchCard";
import {
  getCurrentDay,
  transformData,
  getWorkingHoursForDay,
} from "utils/formatOpeningHours";



jest.mock("utils/formatOpeningHours");

jest.mock("../../../constant", () => ({
  VITE_CONTENT_BASE_URI: "mockedBaseUri",
  VITE_BACKEND_BASE_URL: "mockedBaseUri2",
  VITE_GOOGLE_MAPS_EMBED_API_KEY: "mockedBaseUri3",
  VITE_GOOGLE_MAPS_API_KEY: "mockedBaseUri4",
}));



describe("renderBranchCard function", () => {
  const mockHandleCardClick = jest.fn();
  const commonLabels = {
    working_hours_label: "Working Hours",
    workschedule_label: "Work Schedule",
  };

  const title = "Branch Title";
  const address = "123 Main St";
  const phone = "123-456-7890";
  const email = "test@example.com";
  const working_hours = "9:00 AM - 5:00 PM";
  const working_days = "Monday - Friday";
  const working_hours_data = JSON.stringify([
    { day: "Monday", workingHour: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", workingHour: "9:00 AM - 5:00 PM" },
  ]);
  const bIndex = 0;
  const activeCardIndex = 0;

  beforeEach(() => {
    (getCurrentDay as jest.Mock).mockReturnValue("Monday");
    (transformData as jest.Mock).mockReturnValue([
      { day: "Monday", workingHour: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", workingHour: "9:00 AM - 5:00 PM" },
    ]);
    (getWorkingHoursForDay as jest.Mock).mockReturnValue([
      { day: "Monday", workingHour: "9:00 AM - 5:00 PM" },
    ]);
  });



  it("calls handleCardClick with correct index on card click", () => {
    render(
      renderBranchCard(
        title,
        address,
        phone,
        email,
        working_hours,
        working_days,
        working_hours_data,
        bIndex,
        commonLabels,
        activeCardIndex,
        mockHandleCardClick
      )
    );

    fireEvent.click(screen.getByText(title));
    expect(mockHandleCardClick).toHaveBeenCalledWith(bIndex);
  });

  it("renders without email if email is undefined", () => {
    render(
      renderBranchCard(
        title,
        address,
        phone,
        undefined,
        working_hours,
        working_days,
        working_hours_data,
        bIndex,
        commonLabels,
        activeCardIndex,
        mockHandleCardClick
      )
    );

    expect(screen.queryByText(email)).not.toBeInTheDocument();
  });

  
});
