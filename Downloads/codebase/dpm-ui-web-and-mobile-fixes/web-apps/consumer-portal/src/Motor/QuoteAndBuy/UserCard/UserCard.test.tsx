import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserCard from "./UserCard";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
}));

const mockUseLocation = jest.requireMock("react-router-dom").useLocation;

describe("UserCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
});
    it("renders correctly with valid props", () => {
        mockUseLocation.mockReturnValue({
            state: {
                data: {
                    ownerDetail: {
                        ownerFullNameEnglish: "John Doe",
                        ownerFullNameArabic: "جون دو",
                        gender: "male",
                    },
                    ownerId: "123456789",
                    mobileNumber: "9876543210",
                },
            },
        });

        const languageData = {
            mobile_number: "Mobile Number",
        };

        const { getByText, getByAltText } = render(
            <MemoryRouter>
                <UserCard languageData={languageData} />
            </MemoryRouter>
        );

        expect(getByText("John Doe")).toBeInTheDocument();
        expect(getByText("جون دو")).toBeInTheDocument();
        expect(getByText("Mobile Number")).toBeInTheDocument();
        expect(getByText("9876543210")).toBeInTheDocument();
        expect(getByAltText("user icon")).toBeInTheDocument();
    });

    it("renders correctly with null languageData", () => {
        mockUseLocation.mockReturnValue({
            state: {
                data: {
                    ownerDetail: {
                        ownerFullNameEnglish: "Jane Doe",
                        ownerFullNameArabic: "جين دو",
                        gender: "female",
                    },
                    ownerId: "987654321",
                    mobileNumber: "1234567890",
                },
            },
        });

        const { getByText } = render(
            <MemoryRouter>
                <UserCard languageData={null} />
            </MemoryRouter>
        );

        expect(getByText("Jane Doe")).toBeInTheDocument();
        expect(getByText("جين دو")).toBeInTheDocument();
        expect(getByText("1234567890")).toBeInTheDocument();
    });

    it("renders correctly with undefined propsData", () => {
        mockUseLocation.mockReturnValue({
            state: {
                data: undefined,
            },
        });

        const { container } = render(
            <MemoryRouter>
                <UserCard languageData={null} />
            </MemoryRouter>
        );

        expect(container).toBeInTheDocument();
    });

    it("handles missing state gracefully", () => {
      mockUseLocation.mockReturnValue({
          state: null,
      });

      const { container } = render(
          <MemoryRouter>
              <UserCard languageData={null} />
          </MemoryRouter>
      );

      expect(container).toBeInTheDocument();
  });
});