import React, { useState, useEffect, useCallback } from "react";
import { PublicLayout } from "@src/layout";
import { LoaderOverlay } from "@components/Loader";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { HeroBanner } from "@corporate-portal/components";
import EsgWorld from "@corporate-portal/pages/Esg-World/index";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { newFetchData as fetchData } from "@src/utils";
import { generateBreadcrumbs } from "@dpm/shared-module";
import { getDefault, objectToArray } from "@src/utils";

const EsgWorldFrame: React.FC = () => {
  const [state, setState] = useState({
    esgWorldData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchEsgData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: esgWorldData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["esgWorld"], currentLanguage),
      ]);

      setState((prevState) => ({
        ...prevState,
        esgWorldData,
        metatags,
        loading: false,
        error: false,
      }));
    } catch (error) {
      setState({
        esgWorldData: {},
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchEsgData();
  }, [fetchEsgData]);

  const seoTags = useSeo(state.metatags);

  const getContent = () => {
    const commonData = state.esgWorldData?.data ?? {};
    return {
      breadcrumbsLabel: commonData?.breadcrumb,
      bannerTitle: commonData?.banner_title,
      bannerDescription: commonData?.banner_description,
      bannerImage: commonData?.banner_image,
      iframeUrl: commonData?.api_url,
    };
  };

  const { breadcrumbsLabel, iframeUrl } = getContent();

  const getBannerItem = () => {
    if (state.esgWorldData) {
      const { banner_title, banner_description } =
        state.esgWorldData?.data || {};
      const { url } = state.esgWorldData?.data?.banner_image || {};
      return objectToArray(banner_title, banner_description, url);
    }
    return [];
  };

  const breadcrumbsData = generateBreadcrumbs(
    [
      {
        label: commonTexts[currentLanguage].sustainability,
        route: commonTexts["sustainabilityRoute"],
      },
      {
        label: breadcrumbsLabel,
        route: "/section",
      },
    ],
    currentLanguage
  );

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <React.Fragment>
          {seoTags}

          <HeroBanner
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigate}
            heroBanner={getBannerItem() ?? []}
          />

          <EsgWorld iframeUrl={iframeUrl} />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default EsgWorldFrame;
