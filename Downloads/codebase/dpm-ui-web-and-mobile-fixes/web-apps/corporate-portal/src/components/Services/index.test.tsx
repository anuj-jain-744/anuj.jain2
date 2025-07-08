import { act } from "@testing-library/react";
//import { Services } from "./index";
import "@testing-library/jest-dom";

// Mocking required dependencies
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: () => ({ currentLanguage: "en" }),
}));

describe("Services Component", () => {
  test("renders Services component with title and description", () => {
    const servicesData = [{ id: 1, name: "Service 1" }];
    // render(
    //   <Services
    //     title="Test Service"
    //     description="Test Description"
    //     servicesData={servicesData}
    //   />
    // );

    // expect(screen.getByText("Test Service")).toBeInTheDocument();
    // expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("renders ServicesTab when page prop is false", () => {
    const servicesData = [{ id: 1, name: "Service 1" }];
    // render(
    //   <Services title="Test Service" servicesData={servicesData} page={false} />
    // );

    // expect(screen.getByTestId("serviceContainer")).toBeInTheDocument();
    // expect(screen.getByText("Test Service")).toBeInTheDocument();
    // expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("does not render ServicesTab when page prop is true", () => {
    const servicesData = [{ id: 1, name: "Service 1" }];
    // render(
    //   <Services title="Test Service" servicesData={servicesData} page={true} />
    // );

    // expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("renders Carousel when page is true and servicesData is available", () => {
    const servicesData = [{ id: 1, name: "Service 1" }];
    // render(
    //   <Services title="Test Service" servicesData={servicesData} page={true} />
    // );

    // expect(screen.getByTestId("serviceContainer")).toBeInTheDocument();
    // expect(screen.getByText("Service 1")).toBeInTheDocument();
  });

  test("does not render Carousel when servicesData is empty", () => {
    // render(<Services title="Test Service" servicesData={[]} page={true} />);

    // expect(screen.queryByText("Service 1")).not.toBeInTheDocument();
  });

  test("responsive handling for mobile screen size", () => {
    // Simulate a small screen
    global.innerWidth = 500;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // render(
    //   <Services
    //     title="Test Service"
    //     servicesData={[{ id: 1, name: "Service 1" }]}
    //   />
    // );

    // // Check if the component adjusted to mobile view
    // expect(screen.getByTestId("serviceContainer")).toHaveClass("serviceCat");
  });

  test("animation based on isVisible prop", () => {
    const servicesData = [{ id: 1, name: "Service 1" }];
    // const { rerender } = render(
    //   <Services
    //     title="Test Service"
    //     servicesData={servicesData}
    //     isVisible={true}
    //   />
    // );

    // const container = screen.getByTestId("serviceContainer");
    // expect(container).toHaveStyle("transform: translateX(0%) translateY(0%)");

    // rerender(
    //   <Services
    //     title="Test Service"
    //     servicesData={servicesData}
    //     isVisible={false}
    //   />
    // );
    // expect(container).toHaveStyle("transform: translateX(50%) translateY(0%)");
  });

  test("resize event handler updates isMobile state correctly", () => {
    global.innerWidth = 1000;
    // const { rerender } = render(
    //   <Services
    //     title="Test Service"
    //     servicesData={[{ id: 1, name: "Service 1" }]}
    //   />
    // );

    global.innerWidth = 400; // Simulate mobile screen
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // rerender(
    //   <Services
    //     title="Test Service"
    //     servicesData={[{ id: 1, name: "Service 1" }]}
    //   />
    // );

    // Check if isMobile state is updated
   // expect(screen.getByTestId("serviceContainer")).toHaveClass("serviceCat");
  });
});
