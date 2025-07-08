import React from "react";
import { render } from "@testing-library/react";
import { EsgScreen } from "./index"; // assuming the file is named EsgScreen.tsx

jest.mock("components/ProductCatelog/ProductTab", () => ({
  __esModule: true,
  default: ({ compData, showTab }: any) => (
    <div>
      {showTab && <div>Tab content</div>}
      <div>{JSON.stringify(compData)}</div>
    </div>
  ),
}));

describe("EsgScreen Component", () => {
  const esgCont = [{ key: "value1" }, { key: "value2" }];
  const esgDataTit = "Test Title";
  const esgDataDisc = "Test description for ESG";

  it("renders the component with correct title and description", () => {
    const { getByText } = render(
      <EsgScreen
        esgCont={esgCont}
        esgDataTit={esgDataTit}
        esgDataDisc={esgDataDisc}
      />
    );

    // Check if title is rendered
    expect(getByText(esgDataTit)).toBeInTheDocument();

    // Check if description is rendered
    expect(getByText(esgDataDisc)).toBeInTheDocument();
  });

  it("renders the ProductTab component with correct data", () => {
    const { getByText } = render(
      <EsgScreen
        esgCont={esgCont}
        esgDataTit={esgDataTit}
        esgDataDisc={esgDataDisc}
      />
    );

    // Check if ProductTab receives the correct `compData`
    expect(
      getByText(JSON.stringify({ personal: esgCont }))
    ).toBeInTheDocument();
  });

  it("renders the ProductTab with no tabs if showTab is false", () => {
    const { queryByText } = render(
      <EsgScreen
        esgCont={esgCont}
        esgDataTit={esgDataTit}
        esgDataDisc={esgDataDisc}
      />
    );

    // Check that the tab content is not rendered (since showTab is false by default)
    expect(queryByText("Tab content")).toBeNull();
  });
});
