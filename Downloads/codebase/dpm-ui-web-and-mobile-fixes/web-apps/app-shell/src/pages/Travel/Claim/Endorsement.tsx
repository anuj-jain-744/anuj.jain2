import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header} from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import { getFullUrl, navigateTo,getResponseBasedOnEndpoints } from "../../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import EndosementContainer from "@consumer-portal/components/Travel/Endorsement/endorsementcontainer";
import useTravelData from  "@consumer-portal/Motor/Policy-services/AccessPolicyDocuments/hooks/useTravelData";

const { VITE_CONTENT_BASE_URI } = import.meta.env;


const Endorsement: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Travel cms data call
  const {travelData} = useTravelData();

  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/Travel/Claim/PolicyDashboard" },
    { label: "Endorsement", route: "/Travel/Claim/Endorsement" },
  ];

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
        title={"Endorsement - Travel"}
        breadcrumbsData={items}
        classApply={"policy-title"}
        isMotor={true}
        navigateTo={handleNavigate}
      />
      <EndosementContainer travelData={travelData} navigateTo={handleNavigate}/>
      {/* <IEndorsement /> */}
    </React.Fragment>

  );
};

export default Endorsement;