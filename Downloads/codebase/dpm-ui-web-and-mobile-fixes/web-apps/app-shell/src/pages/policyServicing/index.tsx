import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { callAPI, useApiCall, RootState, useCommonContext } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import PersonalDashboard from "@consumer-portal/pages/personalDesktop/PersonalDashboard";
import { getFullUrl, getDefault, navigateTo, getResponseBasedOnEndpoints } from "../../utils";
import { Footer } from "@consumer-portal/components/Dashboard/dashboardFooterPage";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData } from "@src/utils";
import { useSeo } from "@src/hooks";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const PolicyServicing: React.FC = () => {
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    siteData: null,
    metatags: {},
    loading: true,
    error: false,
  });
  const navigate = useNavigate();
  const { currentLanguage } = useCommonContext();

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result = getResponseBasedOnEndpoints(responseData,endpoint)||
                     responseData||{};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const fetchFeedbackData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: siteData, metadata: metatags }] = await Promise.all([
        newFetchData(cmsAPIRoute["postFeedback"], currentLanguage),
      ]);
      setState({
        siteData: siteData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({
        siteData: null,
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  const {
    makeApiCall,
    data: cmsData,
  } = useApiCall(1, "consumerportal-config", "get");
  const { languageData: headerMenuCmsDataDetails } = useSelector((state: RootState) => state.headerMenuLanguage);
  const { languageData: dashboardCmsDataDetails } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const languageData = cmsData?.config[0];

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
      fetchData("footer-menu", setFooterData)
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    makeApiCall();
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const shouldShowAppDownload = (footerData: any) => {
    return (
      footerData?.blocks?.mobile_slider?.mobile_slider_component_display === "1"
    );
  };

  const seoTags = useSeo(state.metatags);

  return (
    <ProtectedRoute>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable={true}
        isAuthenticated={true}
        menuItems={headerData}
        menuItemsLogin={headerMenuCmsDataDetails}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
        languageData={languageData}
      />
      {seoTags}
      <HighlighterBanner
        showInput={true}
        title={dashboardCmsDataDetails?.policy_servicing}
        breadcrumbsData={dashboardCmsDataDetails?.breadcrumb_links}
        classApply={"policy-title"}
        navigateTo={handleNavigate}
        hideBanner={true}
      />
      <PersonalDashboard navigateTo={handleNavigateWithParams} hideBanner={true} />
      <Footer
        companyInfo={getDefault(`${footerData?.blocks?.companyinfo.split("</li>")[0]}</li></ul>`)}
        footerMenus={footerData?.menus ?? []}
        copyRight={getDefault(footerData?.blocks?.copyright)}
        downloadApp={footerData?.blocks?.download ?? []}
        privacy={footerData?.blocks?.Privacy ?? []}
        socialHandles={footerData?.blocks?.socialLinks ?? []}
        showAppDownload={shouldShowAppDownload(footerData)}
        navigateTo={handleNavigate}
        hideBanner={true}
      />
    </ProtectedRoute>
  );
};

export default PolicyServicing;