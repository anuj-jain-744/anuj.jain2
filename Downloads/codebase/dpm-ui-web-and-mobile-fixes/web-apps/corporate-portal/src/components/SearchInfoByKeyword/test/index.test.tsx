import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SearchInfoByKeyword, fetchData, fetchSearchData } from "..";
import { callAPI, getFullUrl } from '@dpm/shared-module';
import { act } from "react";

jest.mock('../../../constant', () => ({
  VITE_CONTENT_BASE_URI: 'http://34.166.69.105/walaa/web/',
}));

jest.mock('../../HighlighterBanner', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="highlighterBanner" />),
}));

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
}));

describe("SearchInfoKeyword " ,() => {
  const mockSetLoading = jest.fn();
  it("SearchInfoKeyword with all props", async () => {
    await act(async () => {
      render(
        <SearchInfoByKeyword 
          setLoading={mockSetLoading}  
          paramField={"Walaa"}
        />
      );
    });

    expect(screen.getByTestId('highlighterBanner')).toBeInTheDocument();
  });
});

describe("SearchInfoKeyword api call" , () => {
  it("Test fetch search data", async () => {
    const mockResponseData: any[] = [];
    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockResolvedValue(mockResponseData);
    const mockSetCompData = jest.fn();
    const searchkey = "Walaa";
    await act(async () => {
      await fetchSearchData({searchkey: searchkey, setSearchResult: mockSetCompData});
    });
  
    expect(getFullUrl).toHaveBeenCalledTimes(3);

    expect(getFullUrl).toHaveBeenCalledWith('http://34.166.69.105/walaa/web/', 'en', `search-en/"${searchkey}"`);

    expect(callAPI).toHaveBeenCalledWith('get', 'mockedFullUrl');
  
    expect(mockSetCompData).toHaveBeenCalledWith(mockResponseData);  
  });

  it('should handle errors gracefully', async () => {
    const mockSetCompData = jest.fn();
    const mockError = new Error('Network error');

    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    console.log = jest.fn();

    await act(async () => {
      await fetchSearchData({searchkey: "Walaa", setSearchResult: mockSetCompData});
    });

    expect(console.log).toHaveBeenCalledWith(mockError, "errror");
  });
  it("Test fetch placeholder and keywords api", async () => {
    const mockResponseData = {common: "Test"};
    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockResolvedValue(mockResponseData);
    const mockSetCompData = jest.fn();
    const mockSetSearchInfoData = jest.fn();
  
    await act(async () => {
      await fetchData({setSearchInfoData: mockSetSearchInfoData, setPlaceHolders: mockSetCompData});
    });
  
    expect(getFullUrl).toHaveBeenCalledWith('http://34.166.69.105/walaa/web/', 'en', 'search-keywords');

    expect(callAPI).toHaveBeenCalledWith('get', 'mockedFullUrl');
  
    expect(mockSetCompData).toHaveBeenCalledWith(mockResponseData?.common);  
  });

  it('should handle errors gracefully', async () => {
    const mockSetCompData = jest.fn();
    const mockError = new Error('Network error');
    const mockSetSearchInfoData = jest.fn();

    (getFullUrl as jest.Mock).mockReturnValue('mockedFullUrl');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    console.log = jest.fn();

    await act(async () => {
      await fetchData({setSearchInfoData: mockSetSearchInfoData, setPlaceHolders: mockSetCompData});
    });

    expect(console.log).toHaveBeenCalledWith(mockError, "errror");
  });
});