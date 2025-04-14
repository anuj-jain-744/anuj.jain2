import React, { useEffect, useState, useCallback } from "react";
import { useNavigationHandler } from "@src/hooks";
import { useCommonContext } from "@dpm/shared-module";
import { LoaderOverlay } from "../../components";
import { PublicLayout } from "@src/layout";
import { RegisterClaim } from "@corporate-portal/pages";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { fetchData, getDefault } from "@src/utils";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const RegisterClaimPage: React.FC = () => {
  const [pageData, setPageData] = useState({
    claimPageData: { data: [], claim_form: {}, common_data: {}, metatags: {} },
    languageData: {},
    homePageData: {}
  });
  const [loading, setLoading] = useState(true);
  const { currentLanguage, setTriggerLogin } = useCommonContext();
  const navigate = useNavigationHandler();
  const [showCardFooter, setShowCardFooter] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [claimPageData, languageData, homePageData] = await Promise.all([
        fetchData(cmsAPIRoute["registerClaim"], currentLanguage),
        fetchData(cmsAPIRoute["consumerConfig"], currentLanguage),
        fetchData(cmsAPIRoute["personal_homeConfig"], currentLanguage)
      ]);
      setPageData({ claimPageData, languageData, homePageData });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleNavigate = useCallback(
    (url: string) => {
      if (url === commonTexts.loginRoute) {
        setTriggerLogin(true);
      } else {
        navigate(url);
      }
    },
    [navigate, setTriggerLogin]
  );

  const getContent = () => {
    const { data, claim_form, common_data } = pageData.claimPageData;
    return {
      data: getDefault(data),
      claim_form: getDefault(claim_form),
      common_data: getDefault(common_data),
    };
  };

  const { data, claim_form, common_data } = getContent();
  const seoTags = useSeo(pageData.claimPageData.metatags);
  const breadcrumbsData = generateBreadcrumbs(
    getDefault(common_data.breadcrumb),
    currentLanguage
  );

  const combinedData = {
    breadcrumbData: breadcrumbsData,
    handleNavigate,
    data,
    claim_form,
    common_data,
  };

  return (
    <PublicLayout>
      <React.Fragment>
        {loading && <LoaderOverlay />}
        {!loading && (
          <>
            {seoTags}
            <RegisterClaim
              {...combinedData}
              showCardFooter={showCardFooter}
              setShowCardFooter={setShowCardFooter}
              languageData={pageData.languageData?.config[0]}
              homeLanguageData={pageData.homePageData?.config}
            />
          </>
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default RegisterClaimPage;