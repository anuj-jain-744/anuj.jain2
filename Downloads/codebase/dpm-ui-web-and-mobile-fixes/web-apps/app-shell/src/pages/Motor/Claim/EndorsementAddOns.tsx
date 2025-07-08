import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";

import { 
  Header, 
  Footer
} from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import Endorsement from "@consumer-portal/Motor/Endorsement/endorsement";
import {getDefault, navigateTo,getResponseBasedOnEndpoints } from "../../../utils";
const { VITE_CONTENT_BASE_URI } = import.meta.env;


const EndorsementAddOns: React.FC = () => {
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const responseData = await callAPI("get", VITE_CONTENT_BASE_URI);
      const result = getResponseBasedOnEndpoints(responseData,endpoint) ||
                     responseData||{};
      setter(result);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
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
        isSearchEnable={true}
        isAuthenticated={false}
        menuItems={headerData}
        isMenuTransparent={false}
        navigateTo={handleNavigate}
      />
      <Endorsement />
      <Footer
        companyInfo={getDefault(footerData?.blocks?.companyinfo)}
        footerMenus={footerData?.menus || []}
        copyRight={getDefault(footerData?.blocks?.copyright)}
        downloadApp={footerData?.blocks?.download || []}
        privacy={footerData?.blocks?.Privacy || []}
        socialHandles={footerData?.blocks?.socialLinks || []}
        showAppDownload={
          footerData?.blocks?.mobile_slider?.mobile_slider_component_display ===
            "1"
            ? true
            : false
        }
        navigateTo={handleNavigate}
      />
    </React.Fragment>
  );
};

export default EndorsementAddOns;
