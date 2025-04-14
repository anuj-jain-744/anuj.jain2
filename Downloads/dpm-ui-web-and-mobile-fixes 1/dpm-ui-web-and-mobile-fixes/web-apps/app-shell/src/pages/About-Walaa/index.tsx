import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "@corporate-portal/components";
import { AboutWalaa } from "@corporate-portal/pages";
import { PublicLayout } from "@src/layout";
import { LoaderOverlay } from "@components/Loader";
import { getDefault, objectToArray } from "@utils";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData as fetchData } from "@src/utils";
import { generateBreadcrumbs } from "@dpm/shared-module";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const AcadamyWalaaLanding: React.FC = () => {
  const [state, setState] = useState({
    aboutUsData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigation = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: aboutUsData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["aboutWalaa"], currentLanguage),
      ]);

      setState({
        aboutUsData: aboutUsData?.data ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({ aboutUsData: {}, metatags: {}, loading: false, error: true });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getBannerItem = () => {
    const { banner_title, banner_description, banner_image } =
      state.aboutUsData;
    return objectToArray(banner_title, banner_description, banner_image?.url);
  };

  const getAboutUsContent = () => {
    if (state.aboutUsData) {
      return {
        content: getDefault(state.aboutUsData?.content),
        relatedTitle: getDefault(state.aboutUsData?.related_links_title),
        relatedlink: getDefault(state.aboutUsData?.relatedlinks),
        ourJourneyData: getDefault(state.aboutUsData?.our_journey_content),
        ourJourneyVideo: getDefault(state.aboutUsData?.our_journey_video),
        tabs: getDefault(state.aboutUsData?.tabs),
        visionmission: getDefault(
          state.aboutUsData?.our_vision_mission_content
        ),
        quality: getDefault(state.aboutUsData?.quality_policy_content),
        qualityIcons: getDefault(state.aboutUsData?.quality_policy_icons),
        creditTitle: getDefault(state.aboutUsData?.credit_rating_content),
        creditData: getDefault(state.aboutUsData?.credit_rating_data),
      };
    }
    return {};
  };

  const seoTags = useSeo(state.metatags);

  const breadcrumbLabel =
    getDefault(state.aboutUsData?.breadcrumb) ||
    getDefault(state.aboutUsData?.title);
  const breadcrumbsData = breadcrumbLabel
    ? generateBreadcrumbs(breadcrumbLabel, currentLanguage)
    : [];

  const bannerItem = getBannerItem();
  const aboutUsContent = getAboutUsContent();

  const cards = [
    {
      title: state.aboutUsData?.mission_title,
      icon: state.aboutUsData?.mission_image?.url,
      desc: state.aboutUsData?.mission_description,
    },
    {
      title: state.aboutUsData?.vision_title,
      icon: state.aboutUsData?.vision_image?.url,
      desc: state.aboutUsData?.vision_description,
    },
  ];

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}

      {!state.loading && (
        <React.Fragment>
          {seoTags}

          <HeroBanner
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigation}
            heroBanner={bannerItem}
          />

          <AboutWalaa
            content={aboutUsContent.content}
            relatedTitle={aboutUsContent.relatedTitle}
            relatedlink={aboutUsContent.relatedlink}
            tabs={aboutUsContent.tabs}
            visionmission={aboutUsContent.visionmission}
            missionCards={cards}
            quality={aboutUsContent.quality}
            qualityIcons={aboutUsContent.qualityIcons}
            creditTitle={aboutUsContent.creditTitle}
            creditData={aboutUsContent.creditData}
            ourJourneyData={aboutUsContent.ourJourneyData}
            ourJourneyVideo={aboutUsContent.ourJourneyVideo}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default AcadamyWalaaLanding;
