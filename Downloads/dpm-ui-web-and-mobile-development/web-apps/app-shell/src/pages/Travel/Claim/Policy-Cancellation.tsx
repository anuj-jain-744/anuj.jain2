import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import CancelPolicyContainer from "@consumer-portal/pages/travel/Policy-services/policyCancellation/CancelPolicyContainer";
import { getFullUrl, getDefault, navigateTo } from "../../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
const { VITE_CONTENT_BASE_URI } = import.meta.env;

const CancelPolicies: React.FC = () => {
  const [siteData, setSiteData] = useState({});
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/Motor/Claim/PolicyDashboard" },
    { label: "Cancel Policy", route: "/Travel/Claim/Policy-Cancellation" },
  ];

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        endpoint === "header-menu"
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

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
      fetchData("footer-menu", setFooterData),
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
        isSearchEnable={true}
        isAuthenticated={false}
        menuItems={headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
       <HighlighterBanner
        showInput={false}
        title={"Cancel Policy"}
        breadcrumbsData={items}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <CancelPolicyContainer navigateTo={handleNavigate}/>
    </React.Fragment>
  );
};

export default CancelPolicies;
