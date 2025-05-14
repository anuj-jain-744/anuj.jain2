import React, { useState, useEffect } from "react";
import { callAPI, getFullUrl } from "@dpm/shared-module";

import HighlighterBanner from "../../components/HighlighterBanner";
import { VITE_CONTENT_BASE_URI, commonKeywords } from "../../constant";
import { SearchbarProps, SearchInfoData } from "./types";
import { Item } from "../../components/Breadcrumbs";
import { placeholders } from "../../components/SearchInfoByKeyword";
import { useCommonContext } from "@dpm/shared-module";



export const handleSearchResult = () => {};

export const Searchbar: React.FC<SearchbarProps> = ({
  navigateTo,
  setLabel,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchData, setSearchData] = useState<{
    placeholders: placeholders | null;
    searchInfoData: SearchInfoData;
  }>({
    placeholders: null,
    searchInfoData: {},
  });
  const [error, setError] = useState<string | null>(null);
  const {currentLanguage} = useCommonContext();

  const breadcrumbData: Item[] = [
    { label: commonKeywords[currentLanguage].home , route: "/" },
    { label: commonKeywords[currentLanguage].faq, route: "/" },
  ];

  const fetchSearchData = async () => {
    try {
      const fullUrl = getFullUrl(
        VITE_CONTENT_BASE_URI,
        currentLanguage,
        "search-keywords"
      );
      const respData = await callAPI("get", fullUrl);
      setSearchData({
        placeholders: respData?.common,
        searchInfoData: respData,
      });
      setLabel({
        title: respData?.common?.faq_topics,
        faq: respData?.common?.faqs,
      });
    } catch (ex) {
      setError("Failed to fetch search data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSearchData();
  }, [currentLanguage]);

  return (
    <div className="search-box">
      <HighlighterBanner
        showInput={true}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        placeholders={searchData.placeholders}
        frequentlySearch={searchData.searchInfoData?.data?.popular}
        otherSearch={searchData.searchInfoData?.data?.others}
        handleSearchResult={handleSearchResult}
        submitButtonName={searchData.placeholders?.search}
        breadcrumbsData={breadcrumbData}
        navigateTo={navigateTo}
        defaultPage={false}
      />
    </div>
  );
};
