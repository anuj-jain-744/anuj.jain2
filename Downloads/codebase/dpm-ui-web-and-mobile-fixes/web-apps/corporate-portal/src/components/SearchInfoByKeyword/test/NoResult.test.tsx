import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import NoResult from "../NoResult";


describe("NoResult Component", () => {
  it("renders correctly with given all props", () => {
    const noResultPlacehoder = { noResultTitle: "No Result Found", noResultSubTitle: "Test Data" }
    render(
      <NoResult noResultPlacehoder={noResultPlacehoder} />
    );
    const title = screen.getByText(noResultPlacehoder?.noResultTitle);
    const subTitle = screen.getByText(noResultPlacehoder?.noResultSubTitle);
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });
});
