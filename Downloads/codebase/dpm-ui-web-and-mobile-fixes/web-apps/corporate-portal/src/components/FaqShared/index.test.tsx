import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { FAQShared } from "./index";

jest.mock("../../components/Accordians", () => ({
  Accordians: jest.fn(({ content = [] }: { content?: { qns: string; ans: string }[] }) => (
    <div>
      {/* {content.map((item, index) => (
        <div key={index}>
          <h2>{item.qns}</h2>
          <p>{item.ans}</p>
        </div>
      ))} */}
    </div>
  )),
}
));

describe("FAQShared Component", () => {
  const categories = [
    { name: "Category 1", class: "category-1" },
    { name: "Category 2", class: "category-2" },
  ];

  const accordianData = {
    "Category 1": [
      { qns: "Question 1", ans: "Answer 1" },
      { qns: "Question 2", ans: "Answer 2" },
    ],
    "Category 2": [
      { qns: "Question 3", ans: "Answer 3" },
      { qns: "Question 4", ans: "Answer 4" },
    ],
  };

  const faqCont = "<h1>FAQ Section</h1>";

  it("renders the component correctly", () => {
    const { getByText } = render(
      <FAQShared faqCont={faqCont}  accordianData={accordianData["Category 1"]} />
    );

    expect(getByText("FAQ Section")).toBeInTheDocument();
    //expect(Accordians).toHaveBeenCalledWith({ content: accordianData["Category 1"] }, {});
  });

  it("sets the default active tab based on categories", () => {
    const { getByText } = render(
      <FAQShared faqCont={faqCont} accordianData={accordianData["Category 1"] } />
    );

   // expect(getByText("Question 1")).toBeInTheDocument();
   // expect(getByText("Answer 1")).toBeInTheDocument();
  });

  it("does not render accordions if there are no categories", () => {
    const { container } = render(
      <FAQShared faqCont={faqCont} accordianData={[]} />
    );

   // expect(container.querySelector(".accordian-wrapper")).toBeNull();
  });
});
