import React, { useEffect, useState, useCallback } from "react";
import { PublicLayout } from "@src/layout";
import { PrivacyPolicy } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { getDefault } from "@utils";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { fetchData } from "@src/utils";
import { useNavigationHandler } from "@src/hooks";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const PrivacyLanding: React.FC = () => {
  const [state, setState] = useState({
    privacyData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: privacyData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["privacyPolicy"], currentLanguage),
      ]);

      setState({
        privacyData: privacyData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (ex) {
      console.error("Error fetching privacy policy data:", ex);
      setState({
        privacyData: {},
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getPrivacyContent = () => {
    if (state.privacyData && state.privacyData.length > 0) {
      const data = state.privacyData[0];
      return {
        title: getDefault(data?.title),
        content: getDefault(data?.content),
        relatedTitle: getDefault(data?.related_links_title),
        relatedlink: getDefault(data?.relatedlinks),
        breadcrumbLabel: data?.breadcrumb,
      };
    }
    return {};
  };

  const privacyContent = getPrivacyContent();
  const seoTags = useSeo(state.metatags);
  const breadcrumbsData = generateBreadcrumbs(getDefault(privacyContent.breadcrumbLabel), currentLanguage);

  return (
    <PublicLayout>
      <React.Fragment>
        {state.loading && <LoaderOverlay />}

        {!state.loading && (
          <>
            {seoTags}
            <HighlighterBanner
              showInput={true}
              title={privacyContent.title}
              breadcrumbsData={breadcrumbsData}
              classApply={"policy-title"}
              navigateTo={handleNavigate}
            />

            <PrivacyPolicy
              content={privacyContent.content}
              relatedTitle={privacyContent.relatedTitle}
              relatedlink={privacyContent.relatedlink}
            />
          </>
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default PrivacyLanding;