import React, { useEffect, useState } from "react";
import { callAPI, getFullUrl } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import {
  Header,
  ViewBranches,
  HeroBanner,
  Footer,
} from "../../../../corporate-portal/src/components";
import { LoaderOverlay } from "../../components";
import { getDefault,getResponseBasedOnEndpoints,navigateTo } from "../../utils";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const items = [
  { label: "Home", route: "/" },
  { label: "Branches", route: "/iframe-map" },
];

const IFrameMap: React.FC = () => {
  const [siteData, setSiteData] = useState({});
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result = getResponseBasedOnEndpoints(responseData,endpoint) ||
                     responseData||{};
      setter(result);
    } catch (ex) {
      console.log(ex);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("corporate-homepage", setSiteData),
      fetchData("footer-menu", setFooterData),
      fetchData("header-menu", setHeaderData),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

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
      <HeroBanner heroBanner={siteData?.slider || []}  breadcrumbs={items}
        navigateTo={handleNavigate}
      />

      <ViewBranches
        title={getDefault(siteData?.our_branch_title)}
        description={getDefault(siteData?.our_branches_description)}
        displayIframe={false}
        showNavigate={false}
        navigateTo={handleNavigate}
      />
      <ViewBranches
        title={getDefault(siteData?.our_branch_title)}
        description={getDefault(siteData?.our_branches_description)}
        displayIframe={true}
        showNavigate={false}
        navigateTo={handleNavigate}
      />

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

export default IFrameMap;
