import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Surplus } from "./index";

const mockNavigateTo = jest.fn();

jest.mock("components/Accordians", () => ({
  Accordians: jest.fn(() => <div>Accordians Mock</div>),
}));

jest.mock("components/KnowMoreWidget", () => ({
  KnowMoreWidget: jest.fn(() => <div>KnowMoreWidget Mock</div>),
}));

jest.mock("components/EligibilityCheckWidget", () => ({
  EligibilityCheck: jest.fn(() => <div>EligibilityCheck Mock</div>),
}));

const mockCommonData =
{
  title: "Surplus",
  content: "<h2>Overview</h2><p>The insurance surplus is the process of sharing the subscription and investment income between the insurance operators and the participants in the insurance base, at the end of the policy based on the agreed upon percentage of participation. According to Article 70 (2 e) of the Executive Regulations of the Law on Supervision of Takaful Insurance Companies from the Central Bank of Saudi Arabia, insurance companies are required to distribute 10% of the net surplus from insurance operations to policyholders.</p>",
  sidebar_data: [
    {
      title: "Surplus",
      description: "The insurance surplus is the process of sharing the subscription and investment income, Know more by checking your eligibility.",
      check_eligibility: "Check Eligibility",
      check_eligibility_link: "#",
      image_button: "Click here to know more",
      image_button_link: "#",
      image_description: "Get 10% discount on domestic insurance",
      image_title: "Boost your Domestic Labour Insurance",
      sidebar_image: {
        url: "https://storage.googleapis.com/walaa-bucket/2024-10/image 2_0.png",
        alt: ""
      }
    }
  ]
};

let getByTestId: any;
describe("Surplus Page", () => {
  beforeEach(() => {
    const renderResult = render(
      <Surplus
        common_data={mockCommonData} accordianData={[]} navigateTo={mockNavigateTo} />
    );
    getByTestId = renderResult.getByTestId;

  })

  afterEach(() => {
    cleanup();
  })

  test("renders Heading correctly", () => {
    const headingElement = getByTestId('surplus-title');
    expect(headingElement.innerHTML).toContain('<h2>Overview</h2>');
  })

  test("renders Paragraph correctly", () => {
    const paragraphElement = getByTestId('surplus-title');
    expect(paragraphElement.innerHTML).toContain('<p>The insurance surplus is the process of sharing the subscription and investment income between the insurance operators and the participants in the insurance base, at the end of the policy based on the agreed upon percentage of participation. According to Article 70 (2 e) of the Executive Regulations of the Law on Supervision of Takaful Insurance Companies from the Central Bank of Saudi Arabia, insurance companies are required to distribute 10% of the net surplus from insurance operations to policyholders.</p>');
  })
})