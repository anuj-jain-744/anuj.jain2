import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectCoveragePlanType from '.';
import { CompensationTypeKeys, ICoveragePlanData } from 'types/coverageplan';
import { LanguageData } from 'types/languageData';
import Data from "../../../Mockdata/data.json"
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock('components/hooks/useQuoteAndBuyContext');
(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    setRepairTypeSelected: jest.fn(),
});

const mockLanguageData: LanguageData = {
    // mock language data
};

const mockCoveragePlanData: ICoveragePlanData[] = Data;

const mockOnChange = jest.fn();

describe('SelectCoveragePlanType', () => {
    test('renders without crashing', () => {
        render(
            <SelectCoveragePlanType
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={null}
            />
        );
    });

    test('renders all coverage plan options', () => {
        render(
            <SelectCoveragePlanType
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={null}
            />
        );

        expect(screen.getByLabelText('Basic Plan')).toBeInTheDocument();
        expect(screen.getByLabelText('Premium Plan')).toBeInTheDocument();
    });

    test('calls onChange when a coverage plan is selected', () => {
        render(
            <SelectCoveragePlanType
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={null}
            />
        );

        const basicPlanRadio = screen.getByLabelText('Basic Plan');
        fireEvent.click(basicPlanRadio);

        expect(mockOnChange).toHaveBeenCalled();
    });

    test('checks the correct radio button based on coveragePlanSelected', () => {
        render(
            <SelectCoveragePlanType
                languageData={mockLanguageData}
                coveragePlanData={mockCoveragePlanData}
                onChange={mockOnChange}
                coveragePlanSelected={'premium' as CompensationTypeKeys}
            />
        );

        const premiumPlanRadio = screen.getByLabelText('Premium Plan');
        expect(premiumPlanRadio).toBeChecked();
    });
});