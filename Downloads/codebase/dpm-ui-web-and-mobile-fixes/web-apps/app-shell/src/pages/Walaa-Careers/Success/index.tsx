
import SuccessPage from "@corporate-portal/pages/WalaaCareerMarketing/SuccessPage";
import { useNavigationHandler, useSeo } from "@src/hooks";
import React, { useEffect, useState } from "react";
import { getDefault } from "@src/utils";
import { useCommonContext, generateBreadcrumbs } from "@dpm/shared-module";

import { LoaderOverlay } from "@components/Loader";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { PublicLayout } from "@src/layout";
import { useLocation } from "react-router-dom";

const SuccessWalaa: React.FC = () => {
  const location = useLocation();
  const { state:jobsdetails } = location;
  const [state, setState] = useState({
    siteData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  useEffect(() => {
    setState({
      siteData: jobsdetails?.data ?? {},
      metatags: jobsdetails?.metadata ?? {},
      loading: false,
      error: false,
    });
  }, [jobsdetails]);

  const getContent = () => {
    const data = jobsdetails ?? {};
    return {
      jobsDetailData: data,
      breadcrumbLabel: data?.overviewdata?.breadcrumb,
    };
  };

  const {
    jobsDetailData,
    breadcrumbLabel: breadcrumbLabel,
  } = getContent();

  const breadcrumbsData = generateBreadcrumbs(
    getDefault(breadcrumbLabel),
    currentLanguage
);

  

  const seoTags = useSeo(state.metatags);

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <React.Fragment>
          {seoTags}
          <div className="highligh-view">
            <HighlighterBanner
              showInput={true}
              title={breadcrumbLabel}
              breadcrumbsData={breadcrumbsData}
              classApply={"policy-title"}
              navigateTo={handleNavigate}
            />
          </div>

          <SuccessPage
            jobsDetailData={jobsDetailData}
          />

        </React.Fragment>
      )}
    </PublicLayout>

  );
};

export default SuccessWalaa;