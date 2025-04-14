import React from "react";
import { render } from "@testing-library/react";
import DidYouKnowPlain from ".";
import { LanguageData } from "types/languageData";

describe("DidYouKnowPlain Component", () => {
  it("should render without crashing", () => {
    const languageData: LanguageData = { did_you_know: "Did you know" };
    const { getByText } = render(
      <DidYouKnowPlain languageData={languageData} />
    );
    expect(getByText(/Did you know/i)).toBeInTheDocument();
  });

  it("should display the correct text from languageData", () => {
    const languageData: LanguageData = { did_you_know: "Interesting Fact" };
    const { getByText } = render(
      <DidYouKnowPlain languageData={languageData} />
    );
    expect(getByText(/Interesting Fact/i)).toBeInTheDocument();
  });

  it("should display dummy text content", () => {
    const languageData: LanguageData = { did_you_know: "Did you know" };
    const { getByText } = render(
      <DidYouKnowPlain languageData={languageData} />
    );
    expect(getByText(/Lorem ipsum/i)).toBeInTheDocument();
  });
});
