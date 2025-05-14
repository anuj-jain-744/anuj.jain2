import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Template } from "@corporate-portal/templates";
import { Errorpage, LoaderOverlay } from "@src/components";
import { newFetchData as fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import {
  useCommonContext,
  generateBreadcrumbs,
} from "@dpm/shared-module";
import { productType, cmsAPIRoute, commonTexts } from "@src/constants";
import { useNavigationHandler, useSeo } from "@src/hooks";

const SMEProductLanding: React.FC = () => {
  const { product_name } = useParams<{ product_name: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState({
    productData: {},
    faqData: {},
    servicesData: {},
    footerData: {},
    metatags: {},
    languageData: {},
    claimPageData: {},
    error: false,
  });
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useCommonContext();

  const handleNavigate = useNavigationHandler();
  const seoTags = useSeo(state.metatags);

  const trimmedStr = state?.productData?.data?.breadcrumb.trimStart();
  const breadcrumbData = generateBreadcrumbs(
    [
      { label: commonTexts[currentLanguage].products, route: "/" },
      {
        label:
          trimmedStr, 
        route: "/section",
      },
    ],
    currentLanguage
  );

  const handleNavigateWithParams = useCallback((url: string, data: never) => {
    navigate(url, {
      state:{ data }
    });
  }, [navigate]);

  const fetchAllData = useCallback(async () => {
    const [
      { data: productData, metadata: metatags },
      { data: faqData },
      { data: servicesData },
      { data: footerData },
      { data: claimPageData },
      { data: languageData },
    ] = await Promise.all([
      fetchData(
        `${cmsAPIRoute["smeProduct"]}${product_name}`,
        currentLanguage
      ),
      fetchData(cmsAPIRoute["faqListing"], currentLanguage),
      fetchData(cmsAPIRoute["services"], currentLanguage),
      fetchData(cmsAPIRoute["footer"], currentLanguage),
      fetchData(cmsAPIRoute["registerClaim"], currentLanguage),
      fetchData(cmsAPIRoute["consumerConfig"], currentLanguage),
    ]);
    const isError = typeof productData === "string" || productData === null;

    setState({
      productData,
      metatags,
      faqData,
      servicesData,
      footerData,
      languageData,
      claimPageData,
      error: isError,
    });
    setLoading(false);
  }, [currentLanguage, product_name]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const { servicesData, footerData, languageData, claimPageData } = state;
  const faqProductListing =
    productType[product_name as keyof typeof productType];
  const faqContent =
    state?.faqData?.product_faq &&
    state?.faqData?.product_faq[faqProductListing];
  const { services } = state?.productData || {};

  const combinedData = useMemo(
    () => ({
      ...state,
      breadcrumbData,
      handleNavigate,
      faqContent,
      servicesData,
      services,
      footerData,
      claimPageData,
      languageData,
      handleNavigateWithParams,
    }),
    [
      state,
      breadcrumbData,
      handleNavigate,
      faqContent,
      servicesData,
      services,
      footerData,
      languageData,
      claimPageData,
      handleNavigateWithParams,
    ]
  );

  if (state.error) {
    return <Errorpage />;
  }
  

  return (
    <PublicLayout>
      <React.Fragment>
        {loading && <LoaderOverlay />}
        {!loading && (
          <React.Fragment>
            {seoTags}
            <Template templateType="smeProduct" data={combinedData} />
          </React.Fragment>
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default SMEProductLanding;
