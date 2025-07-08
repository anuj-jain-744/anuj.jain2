import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Header,
} from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "../../components";
import { getFullUrl, navigateTo,getResponseBasedOnEndpoints } from "../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import EndosementContainer from "@consumer-portal/Motor/Endorsement/endorsementcontainer";
import HomeEndosementContainer from "@consumer-portal/Home/Endorsement/";
import TravelEndosementContainer from "@consumer-portal/components/Travel/Endorsement/endorsementcontainer";
import useTravelData from  "@consumer-portal/Motor/Policy-services/AccessPolicyDocuments/hooks/useTravelData";
import { PRODUCTS_NAMES, HOME, TRAVEL } from "@consumer-portal/constant";
const { VITE_CONTENT_BASE_URI } = import.meta.env;

const Endorsement: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  // Travel cms data call
  const {travelData} = useTravelData();

  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/PolicyService/Details" },
    { label: "Endorsement", route: "/PolicyService/Endorsement" },
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
    navigateTo(url, navigate, state);
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

  const getEndorsementComponent = () => {
    let endorsementComponent;

    switch (state?.data?.productCode?.toLocaleLowerCase()) {
      case HOME?.toLocaleLowerCase():
        endorsementComponent = <HomeEndosementContainer navigateTo={handleNavigate} />;
        break;
      case TRAVEL?.toLocaleLowerCase():
        endorsementComponent = <TravelEndosementContainer travelData={travelData} navigateTo={handleNavigate} />;
        break;
      default:
        endorsementComponent = <EndosementContainer navigateTo={handleNavigate} />;
        break;
    }
    return endorsementComponent;
  }

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
        {getEndorsementComponent()}
        {/* <IEndorsement /> */}
      </React.Fragment>
    </ProtectedRoute>
  );
};

export default Endorsement;