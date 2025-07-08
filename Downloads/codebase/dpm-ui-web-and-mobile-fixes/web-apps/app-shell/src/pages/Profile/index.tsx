import React, { useEffect, useState } from "react";
import { callAPI, useApiCall } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import { getFullUrl, navigateTo,getResponseBasedOnEndpoints } from "../../utils";
const { VITE_CONTENT_BASE_URI } = import.meta.env;
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import MyProfile from "@consumer-portal/pages/myProfile";
import { PolicyFooter } from "@consumer-portal/components";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  
  const [loading, setLoading] = useState(true);
  const [headerData, setHeaderData] = useState({}); 
  const [pageTitle] = useState("My Profile");
  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "My Profile", route: "/profile" }
  ]

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

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
  } = useApiCall(1, "consumerportal-config", "get");

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData)
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    makeApiCall();
  }, []);

  return (
    <ProtectedRoute>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable={true}
        isAuthenticated={true}
        menuItems={headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
      <HighlighterBanner
        showInput={false}
        title={pageTitle ?? ""}
        breadcrumbsData={breadcrumbData}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <MyProfile />
      <PolicyFooter />
    </ProtectedRoute>
  );
};

export default Profile;