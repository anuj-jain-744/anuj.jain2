import React, { Fragment, useCallback, useState, useEffect } from "react";
import {
  Header,
  Footer,
  Login,
  LoaderOverlay,
} from "@corporate-portal/components";
import { getDefault, newFetchData as fetchData } from "@src/utils";
import {
  shouldShowAppDownload,
  getCurrentLanguage,
  useCommonContext,
  useURLSearchParams,
} from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";

interface PublicLayoutProps {
  showFooter?: boolean;
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  showFooter = true,
  children,
}) => {
  const [state, setState] = useState({
    footerData: {},
    headerData: {},
    loading: true,
  });
  const handleNavigation = useNavigationHandler();
  const { currentLanguage, setTriggerLogin, triggerLogin } = useCommonContext();
  const refNum = useURLSearchParams('rn');

  const fetchAllData = useCallback(async () => {
    const headerPromise = fetchData(cmsAPIRoute["header"], currentLanguage);
    const footerPromise = showFooter
      ? fetchData(cmsAPIRoute["footer"], currentLanguage)
      : Promise.resolve({ data: {} });

    const [{ data: headerData }, { data: footerData }] = await Promise.all([
      headerPromise,
      footerPromise,
    ]);

    setState({ footerData, headerData, loading: false });
  }, [currentLanguage, showFooter]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(()=>{
    if(refNum){
      setTriggerLogin(true);
    }
  },[refNum])
  
  const { footerData, headerData, loading } = state;

  return (
    <Fragment>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable={true}
        isAuthenticated={false}
        menuItems={headerData?.menus || []}
        commonLabels={headerData?.common_labels || {}}
        isMenuTransparent={true}
        navigateTo={handleNavigation}
        currentLanguage={getCurrentLanguage()}
      />
      {children}
      {showFooter && (
        <Footer
          companyInfo={getDefault(footerData?.blocks?.companyinfo)}
          footerMenus={footerData?.menus || []}
          copyRight={getDefault(footerData?.blocks?.copyright)}
          downloadApp={footerData?.blocks?.download || []}
          privacy={footerData?.blocks?.Privacy || []}
          socialHandles={footerData?.blocks?.socialLinks || []}
          showAppDownload={shouldShowAppDownload(footerData)}
          navigateTo={handleNavigation}
        />
      )}
    </Fragment>
  );
};

export default PublicLayout;
