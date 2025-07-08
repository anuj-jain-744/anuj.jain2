import React, { useEffect, useState, useCallback } from "react";
import { useNavigationHandler } from "@src/hooks";
import { useCommonContext,generateBreadcrumbs,RootState,callAPI } from "@dpm/shared-module";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import { PublicLayout } from "@src/layout";
import { RegisterClaim } from "@corporate-portal/pages";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { fetchData, getDefault, getFullUrl,getResponseBasedOnEndpoints } from "@src/utils";
import { useSeo } from "@src/hooks";
import { useSelector } from "react-redux";
import { Header } from "@corporate-portal/components";

const { VITE_CONTENT_BASE_URI } = import.meta.env;


const RegisterClaimPage: React.FC = () => {
  const [pageData, setPageData] = useState({
    claimPageData: { data: [], claim_form: {}, common_data: {}, metatags: {} },
    languageData: {},
    homePageData: {}
  });
  const [loading, setLoading] = useState(true);
  const [headerData, setHeaderData] = useState({});
  const { currentLanguage, setTriggerLogin } = useCommonContext();
  const navigate = useNavigationHandler();
  const [showCardFooter, setShowCardFooter] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );
  const { languageData: headerMenuCmsDataDetails } = useSelector(
    (state: RootState) => state.headerMenuLanguage
  );
  const fetchHeaderData = async (
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

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [claimPageData, languageData, homePageData] = await Promise.all([
        fetchData(cmsAPIRoute["registerClaim"], currentLanguage),
        fetchData(cmsAPIRoute["consumerConfig"], currentLanguage),
        fetchData(cmsAPIRoute["personal_homeConfig"], currentLanguage),
        fetchHeaderData("header-menu", setHeaderData)
      ]);
      setPageData({ claimPageData, languageData, homePageData });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleNavigate = useCallback(
    (url: string) => {
      if (url === commonTexts.loginRoute) {
        setTriggerLogin(true);
      } else {
        navigate(url);
      }
    },
    [navigate, setTriggerLogin]
  );

  const getContent = () => {
    const { data, claim_form, common_data } = pageData.claimPageData;
    return {
      data: getDefault(data),
      claim_form: getDefault(claim_form),
      common_data: getDefault(common_data),
    };
  };

  const { data, claim_form, common_data } = getContent();
  const seoTags = useSeo(pageData.claimPageData.metatags);
  const breadcrumbsData = generateBreadcrumbs(
    getDefault(common_data.breadcrumb),
    currentLanguage
  );
  const loginBreadcrumbs = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Register a Claim", route: "/register-claim" },
  ];


  const combinedData = {
    breadcrumbData: isAuthenticated? loginBreadcrumbs:breadcrumbsData,
    handleNavigate,
    data,
    claim_form,
    common_data,
  };
  if(isAuthenticated){
    return (
      <ProtectedRoute>
        <Header
        isSearchEnable={true}
        isAuthenticated={true}
        menuItems={headerData}
        menuItemsLogin={headerMenuCmsDataDetails}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
        languageData={pageData.languageData}
      />
        <React.Fragment>
          {loading && <LoaderOverlay />}
          {!loading && (
            <>
              {seoTags}
              <RegisterClaim
                {...combinedData}
                showCardFooter={showCardFooter}
                setShowCardFooter={setShowCardFooter}
                languageData={pageData.languageData?.config[0]}
                homeLanguageData={pageData.homePageData?.config}
                handleNavigate={handleNavigate}
              />
            </>
          )}
        </React.Fragment>
      </ProtectedRoute>
    );
  }

  return (
    <PublicLayout showFooter={showCardFooter}>
      <React.Fragment>
        {loading && <LoaderOverlay />}
        {!loading && (
          <>
            {seoTags}
            <RegisterClaim
              {...combinedData}
              showCardFooter={showCardFooter}
              setShowCardFooter={setShowCardFooter}
              languageData={pageData.languageData?.config[0]}
              homeLanguageData={pageData.homePageData?.config}
            />
          </>
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default RegisterClaimPage;