import React, {Fragment, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeroBanner,
  GetQuoteWidget,
  ProductCatalog,
  Vision,
  Services,
  InsuranceExperience,
  ViewBranches,
  Support,
  VisibilityWrapper,
} from "@corporate-portal/components";
import { LoaderOverlay } from "@components/Loader";
import { getDefault } from "@utils";
import { newFetchData as fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler, useSeo } from "@src/hooks";

const PublicLanding: React.FC = () => {
  const [state, setState] = useState({
    siteData: {},
    footerData: {},
    productsData: {},
    servicesData: {},
    languageData: {},
    claimPageData: {},
    branchData:{}
  });
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const { currentLanguage } = useCommonContext();
  const navigate = useNavigate();
  const isParallexEnable = true;
  const handleNavigation = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    try {
      const [
        { data: siteData, metadata: siteMetadata },
        { data: footerData },
        { data: productsData },
        { data: servicesData },
        { data: languageData },
        { data: claimPageData },
        { data: branchData }
      ] = await Promise.all([
        fetchData(cmsAPIRoute["corporateHomepage"], currentLanguage),
        fetchData(cmsAPIRoute["footer"], currentLanguage),
        fetchData(cmsAPIRoute["products"], currentLanguage),
        fetchData(cmsAPIRoute["services"], currentLanguage),
        fetchData(cmsAPIRoute["consumerConfig"], currentLanguage),
        fetchData(cmsAPIRoute["registerClaim"], currentLanguage),
        fetchData(cmsAPIRoute["branches"], currentLanguage)
      ]);
  
      setState({ siteData, footerData, productsData, servicesData, languageData, claimPageData, branchData });
  
      if (siteMetadata) {
        setMetadata(siteMetadata);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage]);

  const handleNavigateWithParams = (url: string, data: never) => {
    navigate(url, {
      state:{ data }
    });
  };

  const seoTags = useSeo(metadata);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  const { siteData, footerData, productsData, servicesData, languageData, claimPageData, branchData } = state;

  return (
    <PublicLayout>
     {loading && <LoaderOverlay />}
      {!loading && (
        <Fragment>
          {seoTags}
          <HeroBanner
            heroBanner={siteData?.slider || []}
            isParallex={isParallexEnable}
          />
          {siteData?.quote_form?.data && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <GetQuoteWidget
                disclaimerText={getDefault(
                  siteData?.quote_form?.disclaimer_text
                )}
                products={siteData?.quote_form?.data || []}
                otpInfo={footerData?.otpinfo}
                navigateTo={handleNavigateWithParams}
                tooltip={claimPageData?.common_data.tooltip2}
                refNoTooltip={claimPageData?.common_data.tooltip2}
                languageData={(languageData?.config && languageData?.config.length > 0) ? languageData?.config[0]: {}}
              />
            </VisibilityWrapper>
          )}
          {siteData?.product_catalog_title && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <ProductCatalog
                catalogTitle={getDefault(siteData?.product_catalog_title)}
                catalogDescription={getDefault(
                  siteData?.product_catalog_description
                )}
                navigateTo={handleNavigation}
                carouselData={productsData?.data || {}}
              />
            </VisibilityWrapper>
          )}
          {siteData?.vision_title && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <Vision
                title={getDefault(siteData?.vision_title)}
                description={getDefault(siteData?.vision_description)}
                menu={siteData?.aboutus_menu || {}}
                thankyou={siteData?.thankyou || []}
                navigateTo={handleNavigation}
              />
            </VisibilityWrapper>
          )}
          {siteData?.services_title && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <Services
                title={getDefault(siteData?.services_title)}
                description={getDefault(siteData?.services_description)}
                servicesData={servicesData && servicesData?.policy_servicing?.data}
                navigateTo={handleNavigation}
              />
            </VisibilityWrapper>
          )}
          {siteData &&
            footerData?.blocks &&
            footerData?.blocks?.mobile_slider
              ?.mobile_slider_component_display === "1" && (
              <VisibilityWrapper isParallex={isParallexEnable}>
                <InsuranceExperience
                  title={getDefault(
                    footerData?.blocks?.mobile_slider?.product_label
                  )}
                  description={getDefault(
                    footerData?.blocks?.mobile_slider?.product_subtitle
                  )}
                  downLoadApp={getDefault(
                    footerData?.blocks?.mobile_slider?.download_our_app
                  )}
                  mobileDownload={
                    footerData?.blocks?.mobile_slider?.mobile_app_images || []
                  }
                  sliderData={
                    footerData?.blocks?.mobile_slider?.mobile_slider_banners ||
                    []
                  }
                />
              </VisibilityWrapper>
            )}

          {siteData?.our_branch_title && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <ViewBranches
                title={getDefault(siteData?.our_branch_title)}
                description={getDefault(siteData?.our_branches_description)}
                navigateTo={handleNavigation}
                cities={branchData?.cityData || []}
                regions = {branchData?.regions || []}
                branchTypes = {branchData?.branchTypes || []}
                branches = {branchData?.data || []}
                commonLabels={branchData?.common_labels || {}}
              />
            </VisibilityWrapper>
          )}
          {siteData?.support && (
            <VisibilityWrapper isParallex={isParallexEnable}>
              <Support
                supportData={siteData?.support?.supportData || []}
                title={getDefault(siteData?.support?.title)}
                description={getDefault(siteData?.support?.desc)}
                navigateTo={handleNavigation}
              />
            </VisibilityWrapper>
          )}
        </Fragment>
      )}
    </PublicLayout>
  );
};

export default PublicLanding;
