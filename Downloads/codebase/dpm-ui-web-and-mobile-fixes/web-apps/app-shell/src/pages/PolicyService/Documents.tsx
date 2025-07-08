import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Header,
} from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "@components/index";
import {AcceessPolicyDocuments} from "@consumer-portal/Motor/Policy-services";
import { getFullUrl, navigateTo, getResponseBasedOnEndpoints } from "@utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { BlueFormFooter } from "@consumer-portal/components/BlueFormFooter";
const { VITE_CONTENT_BASE_URI } = import.meta.env;


const PolicyDocument: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

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

  const goBack=()=>{
    navigate(-1)
  }

  return (
    <ProtectedRoute>
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
        title={"Policy Related Documents"}
        breadcrumbsData={items}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <AcceessPolicyDocuments navigateTo={handleNavigateWithParams} />
      <BlueFormFooter backBtnClickHandler={goBack} isVisibleSubmitButton={false}/>
    </React.Fragment>
    </ProtectedRoute>
  );
};

export default PolicyDocument;
