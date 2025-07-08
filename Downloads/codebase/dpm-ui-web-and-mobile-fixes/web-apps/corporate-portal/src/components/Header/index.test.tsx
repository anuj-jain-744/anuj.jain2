import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {Header} from './index'
import { Provider } from "react-redux";
import {createStore} from "redux";
import { CommonProvider } from "@dpm/shared-module";
import { commonKeywords } from '../../constant';



jest.mock('../../constant', () => ({
  }));
  jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(),
    getCurrencySymbol:jest.fn(),
    getCurrencySymbolForSR:jest.fn()
}));

const calendarValidation=jest.fn();

jest.mock('components/Login/index', () => ({
  __esModule: true,
  default: () => <div data-testid="Login">Login Component</div>,
}));

jest.mock('components/Notification/index', () => ({
    __esModule: true,
    default: () => <div data-testid="Notification">Notification Component</div>,
  }));

const defaultMockProps={
  isSearchEnable:true,
  isAuthenticated:false,
  menuItems:[{linkName:"Products",menuUrl:"/Products"}],
  menuItemsLogin : [],
  isMenuTransparent:false,
  navigateTo:jest.fn(),
}
const mockStore = createStore(
  (state: RootState) => state,
  {auth:{
   isAuthenticated:true,
   userInfo:{}
  },headerMenuLanguage:"en",
  consumerCmsLanguageData:""}
);

jest.mock("../../constant", () => ({
    __esModule: true,
    commonKeywords: {
      contactUs: "Contact Us",
      arabicContactUs: "اتصل بنا (Mocked)",
      englishLabel: "Mocked English",
      arabicLabel: "Mocked Arabic",
      dashboard: "Mocked Dashboard",
      user: "Mocked User",
    },
  }));



describe("Header", () => {
  beforeEach(()=>{
    render(
        <CommonProvider>
          <Provider store={mockStore}>
             <Header {...defaultMockProps} />
          </Provider>
          </CommonProvider>);
  })

  it("should render correctly", () => {
    expect(commonKeywords.contactUs).toBe("Contact Us")
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("navigation work correctly",()=>{
    const productNav=screen.getByText("Products");
    fireEvent.click(productNav);
    expect(defaultMockProps.navigateTo).toHaveBeenCalled();
  });

  it("login button should be rendered",()=>{
    const loginElements = screen.getAllByText(/login/i);
expect(loginElements).toHaveLength(1); // Assert that only one "Login" element exists
expect(loginElements[0]).toBeInTheDocument(); // Assert on the first matching element
// expect(loginElements[1]).toBeInTheDocument();
})
});
