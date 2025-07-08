import { PolicyFooter } from "@consumer-portal/components";
import SuccessPage from "@corporate-portal/pages/ContactWalaa/SuccessPage";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
  useCommonContext,
  callAPI,
  useApiCall,
  generateBreadcrumbs,
  RootState,
} from "@dpm/shared-module";
import { ProtectedRoute } from "@components/ProtectedRoute";
import { LoaderOverlay } from "@components/Loader";
import { Header } from "@corporate-portal/components";
import { getFullUrl } from "@corporate-portal/utils";
import { VITE_CONTENT_BASE_URI } from "@corporate-portal/constant";
import { fetchData, getDefault,getResponseBasedOnEndpoints } from "@utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute } from "@src/constants";

export interface SuccessContactWalaaProps {
  heading?: string;
  title?: string;
  description?: string;
  dashboardBtnLabel?: string;
  TicketBtnLabel?: string;
  handleDashboardButton?: () => void;
  handleTicketButton?: () => void;
}

const SuccessContactWalaa: React.FC<SuccessContactWalaaProps> = () => {
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState({});
  const [state, setState] = useState({
    siteData: null,
    metatags: {},
    loading: true,
    error: false,
  });
  const handleNavigate = useNavigationHandler();
  const { currentLanguage } = useCommonContext();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );
  const { makeApiCall, data: cmsData,loading:successLoading } = useApiCall(
    1,
    "consumerportal-config",
    "get"
  );
  const languageData = cmsData?.config[0];

  const fetchDataHeaderMenu = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result=getResponseBasedOnEndpoints(responseData,endpoint)|| 
                   responseData||{};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };
  const { languageData: headerMenuCmsDataDetails } = useSelector(
    (state: RootState) => state.headerMenuLanguage
  );
  const fetchAllDataForBreadCumb = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const { data: siteData, metadata: metatags } = await fetchData(cmsAPIRoute["postFeedback"], currentLanguage);
      

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

  const fetchAllData = async () => {
    await fetchDataHeaderMenu("header-menu", setHeaderData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllDataForBreadCumb();
  }, [fetchAllDataForBreadCumb]);
  useEffect(() => {
    fetchAllData();
    makeApiCall();
  }, []);

  const successContent = {
    heading: languageData?.thankyou_contact_us,
    title: languageData?.thank_success_ticket_msg,
    description: languageData?.you_can_track_ticket,
    dashboardBtnLabel: languageData?.goto_dashboard,
    TicketBtnLabel: languageData?.goto_my_ticket,
    handleDashboardButton: () => {
      handleNavigate("/dashboard");
    },
    handleTicketButton: () => {
      handleNavigate("/my-ticket");
    },
  };
  const getContent = () => {
    const data = state?.siteData ?? {};
    return {
      bannerTitle: getDefault(
        isAuthenticated ? data?.loggedin_title : data.banner_title
      ),
      breadcrumbsData: generateBreadcrumbs(
        getDefault(
          isAuthenticated ? data?.loggedin_breadcrumb : data.breadcrumb
        ),
        currentLanguage
      ),
    };
  };

  const { bannerTitle, breadcrumbsData } = getContent();

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
      {!loading && (
        <React.Fragment>
          {seoTags}
          <HighlighterBanner
            showInput={true}
            title={bannerTitle}
            breadcrumbsData={breadcrumbsData}
            classApply={"policy-title"}
            navigateTo={handleNavigate}
          />
          {!successLoading && <SuccessPage {...successContent} />}
          <PolicyFooter />
        </React.Fragment>
      )}
    </ProtectedRoute>
  );
};

export default SuccessContactWalaa;
