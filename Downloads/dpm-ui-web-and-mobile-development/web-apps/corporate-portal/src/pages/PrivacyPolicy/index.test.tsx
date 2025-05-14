import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { PrivacyPolicy } from "./index";  

jest.mock("../../components/RelatedLink", () => ({
  RelatedLink: jest.fn(() => <div>Related Link Component</div>)
}));

describe("PrivacyPolicy Component", () => {
   
  
const defaultProps = {
  content: "<p>Privacy policy content here</p>",
  relatedTitle: "Related Title",
  relatedlink:[ ] //{ page_title:"string", page_link:"string"} 
};

test("renders the PrivacyPolicy component with given props", () => {
  render(<PrivacyPolicy {...defaultProps} />);
  expect(screen.getByText("Privacy policy content here")).toBeInTheDocument();
  expect(screen.getByText("Related Title")).toBeInTheDocument(); 
  expect(screen.getByText("Related Link Component")).toBeInTheDocument();
});

test("renders with empty content", () => {
  const emptyContentProps = { ...defaultProps, content: "" };
  render(<PrivacyPolicy {...emptyContentProps} />);
  expect(screen.queryByText("Privacy policy content here")).toBeNull();
  expect(screen.getByText("Related Title")).toBeInTheDocument();
});

test("renders with empty relatedTitle and link", () => {
  const emptyRelatedProps = { 
    ...defaultProps, 
    relatedTitle: "", 
    relatedlink: [] //{ page_title:"", page_link:""} 
  };
  render(<PrivacyPolicy {...emptyRelatedProps} />);
  expect(screen.queryByText("Related Title")).toBeNull();
  expect(screen.getByText("Related Link Component")).toBeInTheDocument();
});


});
