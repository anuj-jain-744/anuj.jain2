import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { callAPI, useApiCall, RootState } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import PersonalDashboard from "@consumer-portal/pages/personalDesktop/PersonalDashboard";
import { getFullUrl, getDefault, navigateTo,getResponseBasedOnEndpoints } from "../../utils";
import { Footer } from "@consumer-portal/components/Dashboard/dashboardFooterPage";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const items = [
//   { label: "Dashboard", route: "/" }
];

const Dashboard: React.FC = () => {
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const {
    makeApiCall,
    data: cmsData,
  } = useApiCall(1, "consumerportal-config", "get");
  const { languageData : headerMenuCmsDataDetails }  = useSelector((state: RootState) => state.headerMenuLanguage);
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

  const shouldShowAppDownload = (footerData: any) => {
    return (
      footerData?.blocks?.mobile_slider?.mobile_slider_component_display === "1"
    );
  };

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
          languageData = {languageData}
        />
        <PersonalDashboard navigateTo={handleNavigateWithParams}/>

      <Footer
        companyInfo={getDefault(footerData?.blocks?.companyinfo)}
        footerMenus={footerData?.menus ?? []}
        copyRight={getDefault(footerData?.blocks?.copyright)}
        downloadApp={footerData?.blocks?.download ?? []}
        privacy={footerData?.blocks?.Privacy ?? []}
        socialHandles={footerData?.blocks?.socialLinks ?? []}
        showAppDownload={shouldShowAppDownload(footerData)}
        navigateTo={handleNavigate}
      />
    </ProtectedRoute>
  );
};

export default Dashboard;