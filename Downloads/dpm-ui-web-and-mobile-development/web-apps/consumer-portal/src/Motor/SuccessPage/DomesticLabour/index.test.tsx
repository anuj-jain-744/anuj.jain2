import React from "react";
import { render } from "@testing-library/react";
import DomesticLabourCard from "./index";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import { LanguageData } from "types/languageData";

jest.mock("Motor/Endorsement/sharedComponent/ThemeButton", () => jest.fn(() => <button>ThemeButton</button>));

describe("DomesticLabourCard", () => {
  const defaultProps: LanguageData = {
    boost_your_domestic_image_url: "test-url",
    boost_your_domestic_labour: "Boost Your Domestic Labour",
    add_domestic_labour_insura: "Add Domestic Labour Insurance",
    check_on_domestic_insuranc: "Check on Domestic Insurance",
  };

  test("renders DomesticLabourCard component", () => {
    const { getByText, getByTestId } = render(<DomesticLabourCard data={defaultProps} />);
    expect(getByTestId("domestic-img")).toHaveAttribute("src", "test-url");
    expect(getByText("Boost Your Domestic Labour")).toBeInTheDocument();
    expect(getByText("Add Domestic Labour Insurance")).toBeInTheDocument();
    expect(getByText("ThemeButton")).toBeInTheDocument();
  });

  test("renders ThemeButton with correct props", () => {
    render(<DomesticLabourCard data={defaultProps} />);
    expect(ThemeButton).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Check on Domestic Insurance",
        classes: "btn-class",
      }),
      {}
    );
  });

  test("renders correctly with no data", () => {
    const { container } = render(<DomesticLabourCard data={null} />);
    expect(container).toMatchSnapshot();
  });
});