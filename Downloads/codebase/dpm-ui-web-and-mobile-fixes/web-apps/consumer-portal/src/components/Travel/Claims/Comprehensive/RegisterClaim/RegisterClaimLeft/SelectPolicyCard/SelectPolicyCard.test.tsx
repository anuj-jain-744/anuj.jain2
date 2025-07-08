import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectPolicyCard from "./SelectPolicyCard";
import { endorseTypes } from "constant";

jest.mock("./PolicyCard/PoliciesCard", () => (props: any) => (
  <div
    data-testid="policies-card"
    onClick={() => props.onClick(props.policy.policyNo)}
  >
    PolicyNo: {props.policy.policyNo} - Selected: {props.isSelected ? "Yes" : "No"}
  </div>
));

jest.mock("components/ThemeButton/ThemeButton", () => (props: any) => (
  <button
    disabled={props.isDisabled}
    onClick={props.onClickhandler}
    data-testid={`theme-button-${props.iconName}`}
    className={props.classes}
  >
    {props.iconName}
  </button>
));

describe("SelectPolicyCard", () => {
  const today = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const langData = {
    consumer: { someKey: "someValue" },
    product: { select_policy: "Select a policy" },
  };

  const createPolicy = ({
    policyNo,
    effectiveDaysOffset,
    expiryDaysOffset,
    endorsementType,
  }: {
    policyNo: string;
    effectiveDaysOffset: number;
    expiryDaysOffset: number;
    endorsementType?: string;
  }) => ({
    policyNo,
    effectiveDate: new Date(today.getTime() + effectiveDaysOffset * dayMs).toISOString(),
    expiryDate: new Date(today.getTime() + expiryDaysOffset * dayMs).toISOString(),
    endorsementType,
  });

  it("renders header and buttons, disables prev button on start", () => {
    render(
      <SelectPolicyCard
        onPolicySelect={() => {}}
        allPolicy={[]}
        langData={langData}
      />
    );

    expect(screen.getByText(langData.product.select_policy)).toBeInTheDocument();

    const prevButton = screen.getByTestId("theme-button-ChevronLeft");
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByTestId("theme-button-ChevronRight");
    expect(nextButton).toBeDisabled();
  });

  it("filters policies based on dates and endorsementType", () => {
    const policies = [
      createPolicy({ policyNo: "1", effectiveDaysOffset: -1, expiryDaysOffset: 0 }),
      createPolicy({ policyNo: "2", effectiveDaysOffset: -10, expiryDaysOffset: 10, endorsementType: endorseTypes.cancel }),
      { policyNo: "3", effectiveDate: "", expiryDate: new Date(today.getTime() + 5 * dayMs).toISOString() },
      createPolicy({ policyNo: "4", effectiveDaysOffset: -40, expiryDaysOffset: -10 }),
    ];

    render(
      <SelectPolicyCard
        onPolicySelect={() => {}}
        allPolicy={policies as any}
        langData={langData}
      />
    );

    const cards = screen.getAllByTestId("policies-card");
    expect(cards).toHaveLength(2);

    expect(cards[0]).toHaveTextContent("PolicyNo: 1");
    expect(cards[1]).toHaveTextContent("PolicyNo: 4");
  });

  it("allows selecting a policy and calls onPolicySelect callback", () => {
    const policies = [createPolicy({ policyNo: "A", effectiveDaysOffset: -1, expiryDaysOffset: 10 })];
    const onPolicySelect = jest.fn();

    render(
      <SelectPolicyCard
        onPolicySelect={onPolicySelect}
        allPolicy={policies as any}
        langData={langData}
      />
    );

    const card = screen.getByTestId("policies-card");
    fireEvent.click(card);

    expect(onPolicySelect).toHaveBeenCalledWith("A");
    expect(card).toHaveTextContent("Selected: Yes");
  });
});
