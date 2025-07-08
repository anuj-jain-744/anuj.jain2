import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  ResponsiveHeader,
  ResponsiveCustomFold,
  CustomToggle,
} from "../ResponsiveView";

jest.mock("react-bootstrap", () => ({
  Navbar: {
    Toggle: jest.fn(() => <div>Mocked Navbar.Toggle</div>),
    Brand: jest.fn(({ children }) => <div>{children}</div>),
  },
  DropdownButton: jest.fn(({ title, children }) => (
    <div>
      {title}
      {children}
    </div>
  )),
  Dropdown: {
    Item: jest.fn(({ children }) => <div>{children}</div>),
  },
}));

jest.mock("../index.tsx", () => ({
  LoginButton: jest.fn(({ navbarTransparent, iconTheme }) => (
    <div>Mocked LoginButton</div>
  )),
}));

jest.mock("../../../assets/Header", () => ({
  ResponsiveFoldLogo: "mocked-responsive-fold-logo",
  ResponsiveLogo: "mocked-responsive-logo",
}));

jest.mock("../LanguageSelectDropdown", () =>
  jest.fn(() => <div>Mocked LanguageSelectDropdown</div>)
);
jest.mock("../ContactUsDropdown", () =>
  jest.fn(({ linkName }) => <div>{linkName}</div>)
);

describe("src/components/Header/ResponsiveView.tsx - ResponsiveHeader.tsx", () => {
  const defaultProps = {
    isAuthenticated: false,
    iconTheme: { LoginIcon: "mocked-logo", SearchIcon: "" },
    navigateTo: jest.fn(),
    navbarTransparent: true,
    shuffle: { white: ["white1", "white2"], org: ["org1", "org2"] },
    currentImageIndex: 0,
    categorizedMenuItems: {
      menuItem: [
        {
          linkName: "Child Link 1",
          childrens: [
            {
              linkName: "Grandchild Link 1",
              attributes: { class: ["icon-class-1"] },
              menuUrl: "/grandchild-link-1",
            },
          ],
        },
      ],
      contactUsMenu: [
        {
          linkName: "Child Link 1",
          childrens: [
            {
              linkName: "Contact 1",
              link_content: "Content 1",
              attributes: { class: ["class1"] },
              menuUrl: "/contact1",
            },
          ],
        },
      ],
    },
  };

  it("renders the ResponsiveHeader component", () => {
    render(<ResponsiveHeader {...defaultProps} />);
    expect(screen.getByAltText("Walaa")).toBeInTheDocument();
    expect(screen.getByAltText("shuffle-image")).toBeInTheDocument();
    expect(screen.getByText("Mocked LoginButton")).toBeInTheDocument();
  });

  it("calls navigateTo when logo is clicked", () => {
    render(<ResponsiveHeader {...defaultProps} />);
    fireEvent.click(screen.getByAltText("Walaa"));
    expect(defaultProps.navigateTo).toHaveBeenCalledWith("/");
  });

  it("renders ContactUsDropdown items", () => {
    render(<ResponsiveHeader {...defaultProps} />);
    expect(screen.getByText("Contact 1")).toBeInTheDocument();
  });
});

describe("src/components/Header/ResponsiveView.tsx - ResponsiveCustomFold.tsx", () => {
  const defaultProps = {
    languageContent: {},
    setSelectedLanguage: jest.fn(),
    selectedLanguage: "en",
  };

  it("renders the ResponsiveCustomFold component", () => {
    render(<ResponsiveCustomFold {...defaultProps} />);
    expect(screen.getByAltText("Walaa Logo")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked LanguageSelectDropdown")
    ).toBeInTheDocument();
  });

  it("Custom Toggle - toggles class on click", () => {
    const { getByTestId } = render(<CustomToggle />);
    const toggleDiv = getByTestId("custom-toggle");
    expect(toggleDiv).not.toHaveClass("toggled");
    fireEvent.click(toggleDiv);
    expect(toggleDiv).toHaveClass("toggled");
    fireEvent.click(toggleDiv);
    expect(toggleDiv).not.toHaveClass("toggled");
  });

});
