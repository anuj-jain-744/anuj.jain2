import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import  TravelInsurance from "@consumer-portal/pages/travel/QuoteAndBuy/index";
import { navigateTo, fetchData } from "@src/utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute } from "@src/constants";
import { QuoteAndBuyProvider } from "../../../../../consumer-portal/src/Motor/QuoteAndBuy/QuoteAndBuyContext";
import { PHQuoteBuyProvider } from "../../../../../consumer-portal/src/context/PHQuoteBuyContext";

interface TravelConfig {
  config: {
    title: string;
    worldwide: boolean;
  };
}

interface State {
  headerData: object;
  travelConfig: TravelConfig;
}

const QuoteAndBuy: React.FC = () => {
  const [state, setState] = useState<State>({
    headerData: {},
    travelConfig: { config: { title: "", worldwide: false } }
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Product", route: "/" },
    { label: "Travel Insurance", route: "/Travel/QuoteAndBuy" },
  ]

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };

  const fetchAllData = async () => {
    const [headerData, travelConfig] = await Promise.all([
      fetchData(cmsAPIRoute['header'], "en"),
      fetchData(cmsAPIRoute.travelConfig, "en"),
    ]);
    setState({headerData, travelConfig})
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);
 

  useEffect(() => {
    if(state?.travelConfig) {
      setPageTitle(state?.travelConfig?.config?.title)
    }
  }, [state?.travelConfig]); 
 
  
  return (
    <PHQuoteBuyProvider>
          <QuoteAndBuyProvider>
    <React.Fragment>
     {loading && <LoaderOverlay />}
     <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={state?.headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
     <HighlighterBanner
        showInput={false}
        title={pageTitle ?? ""}
        breadcrumbsData={breadcrumbData}
        classApply={"policy-title"}
        isMotor={true}
      />
      <TravelInsurance navigateTo={handleNavigateWithParams}/>
   
    
    </React.Fragment>
    </QuoteAndBuyProvider>
    </PHQuoteBuyProvider>
  );
};

export default QuoteAndBuy;