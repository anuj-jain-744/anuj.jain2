import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserCard from "./UserCard";
import { LanguageData } from "types/languageData";

const mockLanguageData: LanguageData = {
  iqama_no: "Iqama No",
  mobile_number: "Mobile Number",
};

const mockPropsData = {
  ownerDetail: {
    ownerFullNameEnglish: "John Doe",
    ownerFullNameArabic: "جون دو",
  },
  ownerId: "1234567890",
  mobileNumber: "0555555555",
};

test("renders UserCard component with provided data", () => {
  const { getByText, getByAltText } = render(
    <MemoryRouter initialEntries={[{ state: { data: mockPropsData } }]}>
      <Routes>
        <Route path="/" element={<UserCard languageData={mockLanguageData} />} />
      </Routes>
    </MemoryRouter>
  );

  expect(getByAltText("user icon")).toBeInTheDocument();
  expect(getByText("John Doe")).toBeInTheDocument();
  expect(getByText("جون دو")).toBeInTheDocument();
});