import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import PolicyHistoryContainer from "@consumer-portal/Motor/Policy-services/PolicyHistory/PolicyHistoryContainer";
import { getFullUrl, navigateTo,getResponseBasedOnEndpoints } from "../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
const { VITE_CONTENT_BASE_URI } = import.meta.env;

const CancelPolicies: React.FC = () => {
  const [, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/PolicyService/Details" },
    { label: "Policy History", route: "/PolicyService/History" },
  ];

  const fetchData = async (
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

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate,state);
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
    <ProtectedRoute>
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
          title={"Policy History"}
          breadcrumbsData={items}
          classApply={"policy-title"}
          isMotor={true}
          navigateTo={handleNavigate}
        />
        <PolicyHistoryContainer navigateTo={handleNavigate}/>
    </ProtectedRoute>
  );
};

export default CancelPolicies;
