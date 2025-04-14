import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Header,
} from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../../components";
import { getFullUrl, navigateTo } from "../../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import EndosementContainer from "@consumer-portal/Motor/Endorsement/endorsementcontainer";
import HomeEndosementContainer from "@consumer-portal/Home/Endorsement/";
import { PRODUCTS_NAMES, HOME } from "@consumer-portal/constant";
const { VITE_CONTENT_BASE_URI } = import.meta.env;

const Endorsement: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const items = [
    { label: "Dashboard", route: "/" },
    { label: "Policy Servicing", route: "/Motor/Claim/PolicyDashboard" },
    { label: "Endorsement", route: "/Motor/Claim/Endorsement" },
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
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <ProtectedRoute>
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
          title={`Endorsement - ${PRODUCTS_NAMES[state?.data?.productCode]}`}
          breadcrumbsData={items}
          classApply={"policy-title"}
          isMotor={true}
          navigateTo={handleNavigate}
        />
        {state?.data?.productCode?.toLocaleLowerCase() === HOME?.toLocaleLowerCase() ? <HomeEndosementContainer navigateTo={handleNavigate} /> : <EndosementContainer navigateTo={handleNavigate} />}
        {/* <IEndorsement /> */}
      </React.Fragment>
    </ProtectedRoute>
  );
};

export default Endorsement;