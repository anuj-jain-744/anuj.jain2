import React from "react";
import { render, screen, fireEvent, getByTestId, getAllByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header, LoginButton } from "../index";
// import { HeaderContent } from '../../content/header';

jest.mock("../../../assets/Header", () => ({
  OrgLogo: "org-logo.png",
  WhiteLogo: "white-logo.png",
  OrgSearch: "org-search.png",
  WhiteSearch: "white-search.png",
  OrgClearSearch: "org-clear-search.png",
  OrgGlobe: "org-globe.png",
  WhiteGlobe: "white-globe.png",
  OrgLogin: "org-login.png",
  WhiteLogin: "white-login.png",
}));

jest.mock("../LanguageSelectDropdown", () => () => (
  <div data-testid="LanguageSelectDropdown">LanguageSelectDropdown</div>
));
jest.mock("../ContactUsDropdown", () => () => (
  <div data-testid="ContactUsDropdown">ContactUsDropdown</div>
));
jest.mock("../menuDropdownTemplate", () => () => (
  <div data-testid="MenuDropdownTemplate">MenuDropdownTemplate</div>
));
jest.mock("../NavDropdown", () => ({
  CustomRenderNavDropdown: () => (
    <div data-testid="CustomRenderNavDropdown">CustomRenderNavDropdown</div>
  ),
}));
jest.mock("../ResponsiveView", () => ({
  ResponsiveCustomFold: () => (
    <div data-testid="ResponsiveCustomFold">ResponsiveCustomFold</div>
  ),
  ResponsiveHeader: () => (
    <div data-testid="ResponsiveHeader">ResponsiveHeader</div>
  ),
}));

const mockNavigateTo = jest.fn();

const mockProps = {
  isSearchEnable: false,
  isAuthenticated: false,
  menuItems: [
    {
      linkName: "Home",
      childrens: [
        {
          linkName: "SubHome",
          link_content: "SubHome Content",
          attributes: { class: ["class1"] },
          menuUrl: "/subhome",
        },
      ],
    },
    {
      linkName: "Contact Us",
      childrens: [
        {
          linkName: "Email",
          link_content: "Email Content",
          attributes: { class: ["class2"] },
          menuUrl: "/contact/email",
        },
      ],
    },
  ],
  isMenuTransparent: true,
  navigateTo: mockNavigateTo,
};

const setMenuTransparency = (isTransparent: boolean) => {
  mockProps.isMenuTransparent = isTransparent;
};

const setSearchEnable = (isSearchEnable: boolean) => {
  mockProps.isSearchEnable = isSearchEnable;
};

describe("Header Component", () => {
  beforeEach(() => {
    window.innerWidth = 1024;
  });

  test("renders Header component", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByAltText("Walaa")).toBeInTheDocument();
  });

  test("shows language dropdown on mouse over", () => {
    render(<Header {...mockProps} />);
    fireEvent.mouseOver(screen.getByText("عربي"));
    expect(screen.getByText("LanguageSelectDropdown")).toBeInTheDocument();
  });

  test("shows shuffle dropdown on mouse over", () => {
    render(<Header {...mockProps} />);
    fireEvent.mouseOver(screen.getByAltText("shuffle-image"));
    expect(screen.getByText("ContactUsDropdown")).toBeInTheDocument();
  });

  test("renders LoginButton when not authenticated", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("does not render LoginButton when authenticated", () => {
    setMenuTransparency(false);
    render(<Header {...mockProps} isAuthenticated={true} />);
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("calls navigateTo on logo click", () => {
    render(<Header {...mockProps} />);
    fireEvent.click(screen.getByAltText("Walaa"));
    expect(mockNavigateTo).toHaveBeenCalledWith("/");
  });

  test("sets isResponsive state based on window width", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByTestId("header")).toHaveClass("navbar-white");

    window.innerWidth = 800;
    window.dispatchEvent(new Event("resize"));
    render(<Header {...mockProps} />);
    expect(screen.getByTestId("ResponsiveHeader")).toBeInTheDocument();
  });

  test("render Search wrapper when search is enabled", () => {
    setSearchEnable(true);
    render(<Header {...mockProps} />);
    expect(screen.getByTestId("search-wrapper")).toBeInTheDocument();
  });

  test("should handle scroll and update navbar transparency", () => {
    const setState = jest.fn();
    const useStateMock: any = (initState: any) => [initState, setState];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    jest.spyOn(React, "useEffect").mockImplementation((f) => f());

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
    render(
      <Header
        isSearchEnable={true}
        isAuthenticated={false}
        menuItems={[]}
        isMenuTransparent={true}
        navigateTo={jest.fn()}
      />
    );

    expect(setState).toHaveBeenCalledWith(true);

    window.scrollY = 500;
    fireEvent.scroll(window);

    expect(setState).toHaveBeenCalledWith(false);
  });


  test('does not render MenuDropdownTemplate when isResponsive is true', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [{ linkName: 'Home', show: true, selectedIndex: 0 }, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
  
    render(<Header {...mockProps} />);
  
    const menuDropdownTemplate = screen.queryByTestId('menu-dropdown-template');
    expect(menuDropdownTemplate).not.toBeInTheDocument();
  });

});
