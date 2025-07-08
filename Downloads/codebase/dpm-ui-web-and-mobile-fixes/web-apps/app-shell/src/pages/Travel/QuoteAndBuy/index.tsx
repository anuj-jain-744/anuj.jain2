import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoaderOverlay } from "../../../components";
import { Header } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { PHQuoteBuyProvider } from "../../../../../consumer-portal/src/context/PHQuoteBuyContext";
import { QuoteAndBuyProvider } from "../../../../../consumer-portal/src/Motor/QuoteAndBuy/QuoteAndBuyContext";
import TravelInsurance from "@consumer-portal/pages/travel/QuoteAndBuy/index";
import { navigateTo, newFetchData as fetchData } from "@src/utils";
import { useCommonContext, RootState } from "@dpm/shared-module";
import { cmsAPIRoute, commonTexts } from "@src/constants";

interface DataRef {
  consumer: Record<string, string>;
  product: Record<string, string>;
  header: Array<{
    linkName: string;
    childrens?: Array<{
      linkName: string;
      link_content: string;
      attributes: {
        class: string[];
      };
      menuUrl: string;
    }>;
  }>;
  breadcrumb: Array<{
    label: string;
    route: string;
  }>;
}

const QuoteAndBuy = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { currentLanguage } = useCommonContext();
  const navigate = useNavigate();
  const dataRef = useRef<DataRef>({
    consumer: {},
    product: {},
    header: [],
    breadcrumb: [],
  });
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const [
        {
          data: { config },
        },
        {
          data: { config: productConfig },
        },
        {
          data: { menus },
        },
      ] = await Promise.all([
        fetchData(cmsAPIRoute.consumerConfig, currentLanguage),
        fetchData(cmsAPIRoute.travelConfig, currentLanguage),
        fetchData(cmsAPIRoute.header, currentLanguage),
      ]);
      const consumer =
        Array.isArray(config) && config[0] instanceof Object ? config[0] : {};
      dataRef.current.consumer = consumer;
      dataRef.current.product =
        productConfig instanceof Object ? productConfig : {};
      dataRef.current.header = Array.isArray(menus) ? menus : [];
      const breadcrumbItems = [
        {
          label: isAuthenticated ? consumer.dashboard : consumer.home,
          route: isAuthenticated ? "/dashboard" : "/",
        },
        {
          label: consumer.products,
          route: "/personal/product/travel",
        },
        { label: consumer.travel_insurance, route: "" },
      ];
      if (isAuthenticated === true) breadcrumbItems.splice(1, 1);

      dataRef.current.breadcrumb = breadcrumbItems;
      setLoading(false);
    };
    loadData();
  }, [currentLanguage]);

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  return (
    <>
      {loading && <LoaderOverlay />}
      {
        <>
          <Header
            isSearchEnable={false}
            isAuthenticated={false}
            menuItems={dataRef.current.header}
            isMenuTransparent
            navigateTo={handleNavigate}
          />
          <HighlighterBanner
            showInput={false}
            title={dataRef.current.consumer.travel_insurance}
            breadcrumbsData={dataRef.current.breadcrumb}
            classApply={commonTexts.policyTitle}
            isMotor
            navigateTo={handleNavigate}
          />
          <PHQuoteBuyProvider>
            <QuoteAndBuyProvider>
              <TravelInsurance langData={dataRef.current} />
            </QuoteAndBuyProvider>
          </PHQuoteBuyProvider>
        </>
      }
    </>
  );
};

export default QuoteAndBuy;
