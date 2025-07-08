import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {SharedCalendar} from './index'
import { Provider } from "react-redux";
import {createStore} from "redux";
import { CommonProvider } from "@dpm/shared-module";
import { waitFor } from "@testing-library/react";


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
 value:"",
 setValue:jest.fn(),
 isOn:false,
 setIsOn:jest.fn(),
 errorMessage:"",
 onFieldChange:jest.fn(),
 showSwitch:false,
 switchLabel:"switch"
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
  


describe("Shared Calender", () => {
  beforeEach(()=>{
    render(    
        <CommonProvider>
          <Provider store={mockStore}>
             <SharedCalendar {...defaultMockProps} />
          </Provider>
          </CommonProvider>);
  })

  it("should render correctly", () => {
   const dateInput=screen.getAllByPlaceholderText("DOB (MM/YYYY)");
   expect(dateInput[0]).toBeInTheDocument();
  });

  it("on change of date field handler is called",async()=>{
    const handleChange=jest.fn();
    const dateInput=screen.getAllByPlaceholderText("DOB (MM/YYYY)")[0];
    fireEvent.change(dateInput,{ target: { value: "03/1997" } });
    await waitFor(() =>expect(defaultMockProps.value).toBe(""));
  })

  it("SwitchButton need to be rendered when showSwitch is true",()=>{
    render(    
        <CommonProvider>
          <Provider store={mockStore}>
             <SharedCalendar {...defaultMockProps } showSwitch={true} />
          </Provider>
          </CommonProvider>);
    const switchButton=screen.getByText("switch");
    expect(switchButton).toBeInTheDocument();
  });

  it("If error message show error",()=>{
    render(    
        <CommonProvider>
          <Provider store={mockStore}>
             <SharedCalendar {...defaultMockProps } errorMessage={"Input error"} />
          </Provider>
          </CommonProvider>
    );
    const errorSpan=screen.getByText("Input error");
    expect(errorSpan).toBeInTheDocument();
  });


});
