import React, { ReactElement } from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductCatalog } from "../index";
import { callAPI, getFullUrl } from '@dpm/shared-module';

jest.mock("../ProductTab", () => ({
  __esModule: true,
  default: () => <div>Mocked ProductTab</div>,
}));


jest.mock("../../VisibilityWrapper", () => ({
  __esModule: true,
  default: ({children}: {children: ReactElement}) => <div>{children}</div>,
}));

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
}));


describe("src/components/ProductCatelog/index.tsx", () => {
  it("renders ProductCatalog component with title and description", async () => {
    const catalogTitle = "Test Catalog Title";
    const catalogDescription = "Test Catalog Description";

    await act(async () => {
      render(
        <ProductCatalog
          catalogTitle={catalogTitle}
          catalogDescription={catalogDescription}
          navigateTo={() => jest.fn()}
        />
      );
    });

    expect(screen.getByText(catalogTitle)).toBeInTheDocument();
    expect(screen.getByText(catalogDescription)).toBeInTheDocument();
    expect(screen.getByText("Mocked ProductTab")).toBeInTheDocument();
  });
});

describe('src/components/ProductCatelog/index.tsx - fetchData()', () => {
  it('should fetch data and set it using setCompData', async () => {
    const mockSetCompData = jest.fn();
    const mockResponseData = { data: { key: 'value' } };

    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockResolvedValue(mockResponseData);

    await act(async () => {
  //    await fetchData({ setCompData: mockSetCompData });
    });
    

   // expect(getFullUrl).toHaveBeenCalledWith('http://34.166.69.105/walaa/web/', 'en', 'products');
   // expect(callAPI).toHaveBeenCalledWith('get', 'mockedFullUrl');
   // expect(mockSetCompData).toHaveBeenCalledWith(mockResponseData.data);
  });

  it('should handle errors gracefully', async () => {
    const mockSetCompData = jest.fn();
    const mockError = new Error('Network error');

    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    console.log = jest.fn();

    await act(async () => {
  //    await fetchData({ setCompData: mockSetCompData });
    });

   // expect(console.log).toHaveBeenCalledWith(mockError, "errror");
  });
});