import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Footer } from "@corporate-portal/components";
import { PolicyFooter } from '@consumer-portal/components';
import { LoaderOverlay } from "../../components";
import { PolicyContainer } from "@consumer-portal/components/PolicyServices";
import { getFullUrl, getDefault, navigateTo } from "../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const items = [
  { label: "Dashboard", route: "/Dashboard" },
  { label: "Policy Details", route: "/Claim/PolicyDashboard" },
];

const DashboardPolicy: React.FC = () => {
  const [siteData, setSiteData] = useState({});
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result = endpoint === "header-menu"
        ? responseData?.menus
        : endpoint === "consumer-portal"
          ? responseData?.data
          : responseData ?? {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

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
  }, []);

  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
      <HighlighterBanner
        showInput={false}
        title={"Policy Details"}
        breadcrumbsData={items}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <PolicyContainer navigateTo={handleNavigateWithParams} />
      <PolicyFooter />
    </React.Fragment>
  );
};

export default DashboardPolicy;