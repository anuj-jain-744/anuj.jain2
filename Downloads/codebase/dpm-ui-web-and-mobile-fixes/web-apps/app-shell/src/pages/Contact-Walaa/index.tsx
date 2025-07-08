import React, { useEffect, useState, useCallback } from "react";
import {
  useCommonContext,
  callAPI,
  useApiCall,
  generateBreadcrumbs,
  RootState,
} from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { newFetchData as fetchData, getDefault, getFullUrl,getResponseBasedOnEndpoints } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { ContactWalaaScreen } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";
import { useSeo } from "@src/hooks";
import {
  ContactWalaaProps,
  formFieldData,
} from "@corporate-portal/pages/ContactWalaa";
import { useSelector } from "react-redux";
import { Header } from "@corporate-portal/components";
import { ProtectedRoute } from "@components/ProtectedRoute";
import { VITE_CONTENT_BASE_URI } from "@corporate-portal/constant";
import { PolicyFooter } from "@consumer-portal/components";

interface WalaScreenType {
  loading: boolean;
  handleNavigate: (url: string, data?: { [key: string]: unknown }) => void;
  seoTags: React.ReactNode;
  bannerTitle: string;
  breadcrumbsData: {
    label: string;
    route: string;
  }[];
  siteData: ContactWalaaProps[] | null;
  languageData?: unknown;
}

const WithAuthContactWalaa: React.FC<WalaScreenType> = ({
  bannerTitle,
  breadcrumbsData,
  handleNavigate,
  seoTags,
  siteData,
  languageData,
}) => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result = getResponseBasedOnEndpoints(responseData,endpoint) ||
                     responseData||{};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };
  const { languageData: headerMenuCmsDataDetails } = useSelector(
    (state: RootState) => state.headerMenuLanguage
  );

  const fetchAllData = async () => {
    await Promise.all([fetchData("header-menu", setHeaderData)]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);


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

      <WalaaScreen
        seoTags={seoTags}
        bannerTitle={bannerTitle}
        breadcrumbsData={breadcrumbsData}
        handleNavigate={handleNavigate}
        loading={loading}
        siteData={siteData}
      />
      <PolicyFooter />
    </ProtectedRoute>
  );
};
const WalaaScreen: React.FC<WalaScreenType> = ({
  loading,
  handleNavigate,
  seoTags,
  bannerTitle,
  breadcrumbsData,
  siteData,
}) => {
  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
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
          {siteData && <ContactWalaaScreen sitedata={siteData} />}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
const ContactWalaa: React.FC = () => {
  const [state, setState] = useState({
    siteData: null,
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );
  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const { data: siteData, metadata: metatags } = await fetchData(cmsAPIRoute["postFeedback"], currentLanguage)
      if (siteData && isAuthenticated) {
        const authenticatedFields = [
          "product_type",
          "phone_number",
          "message",
          "attachment",
          "email",
        ];
        if (siteData?.form_fields.length > 2) {
          siteData?.form_fields.pop();
        }
        const fieldArr = siteData?.form_fields?.map(
          (fieldTag: { webform_name: string; fields: formFieldData[] }) =>
            fieldTag.fields?.filter((fieldObj) =>
              authenticatedFields.includes(fieldObj.field_name)
            )
        );

        if (siteData?.form_fields?.length > 0) {
          siteData.form_fields[0].fields = fieldArr[0];
          siteData.form_fields[1].fields = fieldArr[1];
        }
      }

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

  const { makeApiCall, data: cmsData } = useApiCall(
    1,
    "consumerportal-config",
    "get"
  );
  const languageData = cmsData?.config[0];

  useEffect(() => {
    fetchAllData();
    makeApiCall();
  }, [fetchAllData]);

  const getContent = () => {
    const data = state?.siteData?.data ?? {};
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

  if (isAuthenticated) {
    // Render the wrapped component if authenticated
    return (
      <WithAuthContactWalaa
        seoTags={seoTags}
        bannerTitle={bannerTitle}
        breadcrumbsData={breadcrumbsData}
        handleNavigate={handleNavigate}
        loading={state.loading}
        siteData={state.siteData}
        languageData={languageData}
      />
    );
  }
  return (
    <PublicLayout>
      <WalaaScreen
        seoTags={seoTags}
        bannerTitle={bannerTitle}
        breadcrumbsData={breadcrumbsData}
        handleNavigate={handleNavigate}
        loading={state.loading}
        siteData={state.siteData}
      />
    </PublicLayout>
  );
};
export default ContactWalaa;
