import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import {
  Header,
  Footer
} from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import TrackClaim from "@consumer-portal/Motor/Claims/TrackYourClaim/TrackYourClaim";
import { PolicyFooter } from '@consumer-portal/components';
import { getFullUrl, getDefault, navigateTo } from "../../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
const { VITE_CONTENT_BASE_URI } = import.meta.env;


const TrackClaims: React.FC = () => {
  const [siteData, setSiteData] = useState({});
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [languageData, setLanguageData] = useState<LanguageData>();
  const [trackClaimInfo, setTrackClaimInfo] = useState<{ [key: string]: string } | null>(null);
  const navigate = useNavigate();

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
          : endpoint === "consumerportal-config"
            ? responseData?.config[0]
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
      fetchData("consumerportal-config", setTrackClaimInfo),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);


  const items = [
    { label: "Home", route: "/" },
    { label: "Claims", route: "/Motor/Claim/Track-Your-Claim" },
    { label: "Track Your Claim", route: "Motor/Claim/Track-Your-Claim" },
  ];

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
      title={trackClaimInfo?.track_your_claim}
      breadcrumbsData={items}
      classApply={"policy-title"}
      isMotor={true}
      navigateTo={handleNavigate}
      />
      {trackClaimInfo && <TrackClaim trackClaimInfo={trackClaimInfo} headerData={headerData} />}

      <PolicyFooter />
    </React.Fragment>
  );
};

export default TrackClaims;