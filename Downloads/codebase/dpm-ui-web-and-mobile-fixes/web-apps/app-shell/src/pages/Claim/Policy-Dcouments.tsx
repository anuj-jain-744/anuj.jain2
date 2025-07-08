import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import {
  Header
} from "@corporate-portal/components";
import {HeaderData} from "../../types"
import { LoaderOverlay } from "../../components";
import {AcceessPolicyDocuments} from "@consumer-portal/components/PolicyServices";
import { getFullUrl, navigateTo,getResponseBasedOnEndpoints } from "../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
const { VITE_CONTENT_BASE_URI } = import.meta.env;


const PolicyDocument: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/PolicyService/Details" },
    { label: "Policy Related Documents", route: "/Claim/Policy-Dcouments" },
  ];

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData: { menus?: any, data?: any } = await callAPI("get", fullUrl);
      const result = getResponseBasedOnEndpoints(responseData,endpoint) ||
              responseData||{};
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
      menuItems={headerData as HeaderData[]}
      isMenuTransparent={true}
      navigateTo={handleNavigate}
      commonLabels={{}}
    />
     <HighlighterBanner
        showInput={false}
        title={"Policy Related Documents"}
        breadcrumbsData={items}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <AcceessPolicyDocuments navigateTo={handleNavigateWithParams} />
    </React.Fragment>
  );
};

export default PolicyDocument;