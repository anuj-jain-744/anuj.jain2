import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HighlighterCard, HighlighterDataProps } from "../index";
import { CardContentProps } from "../RegisterLinks";
import {cardContent,highlighterData} from './testData';

// Mock the NewsLetter and RegisterLink components
jest.mock("../NewsLetter", () => {
  return {
    __esModule: true,
    default: ({
      highlighterData,
    }: {
      highlighterData: HighlighterDataProps;
    }) => <div data-testid="newsletter-mock"></div>,
  };
});

jest.mock("../RegisterLinks", () => {
  return {
    __esModule: true,
    default: ({
      cardContent,
      navigateTo,
    }: {
      cardContent: CardContentProps;
      navigateTo: (url: string) => void;
    }) => <div data-testid="registerlink-mock"></div>,
  };
});

describe("HighlighterCard Component", () => {

  it("renders NewsLetter component when type is 'newsletter'", () => {
    render(
      <HighlighterCard type="newsletter" highlighterData={highlighterData} />
    );
    expect(screen.getByTestId("newsletter-mock")).toBeInTheDocument();
  });

  it("renders RegisterLink component when type is 'default'", () => {
    render(
      <HighlighterCard
        type="default"
        cardContent={cardContent}
        navigateTo={() => {}}
      />
    );
    expect(screen.getByTestId("registerlink-mock")).toBeInTheDocument();
  });
});
