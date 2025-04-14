import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PolicyFooter } from "@consumer-portal/components";
import { LoaderOverlay } from "@components/Loader";
import { getDefault } from "@utils";
import { newFetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { PersonalHomeQuoteAndBuy } from "@consumer-portal/pages/personal/home/quote-buy";
import { navigateTo, fetchData } from "@src/utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { useCommonContext, generateBreadcrumbs } from "@dpm/shared-module";
import { useSeo } from "@src/hooks";
import {PHQuoteBuyProvider} from "@consumer-portal/context/PHQuoteBuyContext";
import { productIDs } from "@corporate-portal/constant";

const HomeQuoteAndBuy: React.FC = () => {
  const [state, setState] = useState({
    consumerportalConfig: {},
    homeConfig: {},
    pageMetaData: {},
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentLanguage } = useCommonContext();

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };

  const fetchAllData = async () => {
    try {
      const [
        { data: consumerportalConfig },
        { data: homeConfig, metadata: pageMetaData },
      ] = await Promise.all([
        newFetchData(cmsAPIRoute["consumerHomepage"], currentLanguage),
        newFetchData(cmsAPIRoute["personal_homeConfig"], currentLanguage),
      ]);
      setState({ consumerportalConfig, homeConfig, pageMetaData });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const { homeConfig, pageMetaData } = state;

  const seoTags = useSeo(pageMetaData);
  const breadcrumbData = generateBreadcrumbs(
    [
      { label: commonTexts[currentLanguage].products, route: commonTexts?.productsRoute },
      {
        label: homeConfig?.config && homeConfig?.config?.breadcrumb,
        route: "/",
      },
    ],
    currentLanguage
  );

  useEffect(() => {
    if (homeConfig?.config) {
      setPageTitle(homeConfig?.config?.title);
    }
  }, [homeConfig]);

  return (
    <PHQuoteBuyProvider>
    <PublicLayout showFooter={false}>
      {loading && <LoaderOverlay />}
      {!loading && (
        <Fragment>
          {seoTags}
          <HighlighterBanner
            showInput={false}
            title={pageTitle ?? ""}
            breadcrumbsData={breadcrumbData}
            classApply={commonTexts?.policyTitle}
            isMotor={true}
          />
          <PersonalHomeQuoteAndBuy
            navigateTo={handleNavigateWithParams}
            configData={homeConfig?.config}
            productName={productIDs.home}
          />
        </Fragment>
      )}
    </PublicLayout>
    </PHQuoteBuyProvider>
  );
};

export default HomeQuoteAndBuy;
