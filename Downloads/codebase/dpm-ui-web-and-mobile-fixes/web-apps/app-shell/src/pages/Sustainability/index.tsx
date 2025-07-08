import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useNavigationHandler } from "@src/hooks";
import { HeroBanner } from "@corporate-portal/components";
import { LoaderOverlay } from "@components/Loader";
import { navigateTo } from "@utils";
import { fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { SustaibabilityPage } from "@corporate-portal/pages";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const SustainabilityLanding: React.FC = () => {
  const [state, setState] = useState({
    sustainabilityData: {},
    newsData: {},
    metatags: {},
  });
  const [loading, setLoading] = useState(true);
  const { currentLanguage, setTriggerLogin } = useCommonContext();
  const navigate = useNavigationHandler();

  const handleNavigate = useCallback(
    (url: string) => {
      if (url === commonTexts.loginRoute) {
        setTriggerLogin(true);
      } else {
        navigateTo(url, navigate);
      }
    },
    [navigate, setTriggerLogin]
  );

  const fetchAllData = useCallback(async () => {
    const [sustainabilityData, newsData] = await Promise.all([
      fetchData(cmsAPIRoute["sustainability"], currentLanguage),
      fetchData(cmsAPIRoute["newsListing"], currentLanguage),
    ]);

    const metatags = sustainabilityData?.metadata || {};
    setState({ sustainabilityData, newsData, metatags });
    setLoading(false);
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const { sustainabilityData, newsData, metatags } = state;
  const bannerItem = sustainabilityData?.data?.banner_video;
  const esgContent = sustainabilityData?.data?.esg_data;

  const formattedBannerItem = bannerItem
    ? [
        {
          slider_title: sustainabilityData?.data?.banner_title || "",
          slider_description:
            sustainabilityData?.data?.banner_description || "",
          slider_video_url: bannerItem || "",
          slider_type: "Video",
        },
      ]
    : [];

  const seoTags = useSeo(metatags);

  const breadcrumbLabel = sustainabilityData?.data?.breadcrumb;

  const breadcrumbsData =
    breadcrumbLabel && generateBreadcrumbs(breadcrumbLabel, currentLanguage);

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}
      {!loading && (
        <Fragment>
          {seoTags}

          <HeroBanner
            heroBanner={formattedBannerItem}
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigate}
          />
          <SustaibabilityPage
            content={sustainabilityData}
            newsData={newsData}
            navigateTo={handleNavigate}
            esgContent={esgContent}
          />
        </Fragment>
      )}
    </PublicLayout>
  );
};

export default SustainabilityLanding;
