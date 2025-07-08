import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "@corporate-portal/components";
import { PublicLayout } from "@src/layout";
import { Acadamy } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";
import { getDefault, objectToArray } from "@src/utils";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData as fetchData } from "@src/utils";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const AcadamyLanding: React.FC = () => {
  const [state, setState] = useState({
    acadamyData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: acadamyData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["walaaAcademy"], currentLanguage),
      ]);

      setState({
        acadamyData: acadamyData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setState({
        acadamyData: {},
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getBannerItem = () => {
    const { acadamyData } = state;
    if (acadamyData && acadamyData?.data?.length > 0) {
      const { title, short_desc, banner_image } = acadamyData.data[0];
      return objectToArray(title, short_desc, banner_image?.url);
    }
    return [];
  };

  const getAcadamyContent = () => {
    const { acadamyData } = state;
    if (acadamyData && acadamyData?.data?.length > 0) {
      const data = acadamyData.data[0];
      return {
        content: getDefault(data?.content),
        relatedTitle: getDefault(data?.related_stories_title),
        relatedlink: getDefault(data?.relatedlinks?.news),
        trainingdiscription: getDefault(data?.campaign_description),
        trainingimageurl: getDefault(data?.campaign_image?.url),
        trainingimagealt: getDefault(data?.campaign_image?.alt),
        visiontitle: getDefault(data?.vision_title),
        visiondiscription: getDefault(data?.vision_description),
        missiontitle: getDefault(data?.mission_title),
        missiondiscription: getDefault(data?.mission_description),
        aimtitle: getDefault(data?.aim_title),
        aimdiscription: getDefault(data?.aim_description),
        visionimageurl: getDefault(data?.vision_image?.url),
        visionimagealt: getDefault(data?.vision_image?.alt),
        missionimageurl: getDefault(data?.mission_image?.url),
        missionimagealt: getDefault(data?.mission_image?.alt),
        aimimageurl: getDefault(data?.aim_image?.url),
        aimimagealt: getDefault(data?.aim_image?.alt),
        breadcrumb: getDefault(data?.breadcrumb),
        objectivesTitle: getDefault(data?.objectives_title), // Add this line for objectives title
        objectivesPoints: getDefault(data?.objectives_points), // Add this line for objectives points
        sidebarTitle: getDefault(data?.sidebar_title),
        sidebarButton: getDefault(data?.sidebar_button),
        sidebarImage: getDefault(data?.sidebar_image?.url),
        sidebar_button_link: getDefault(data?.sidebar_button_link),
      };
    }
    return {};
  };

  const bannerItem = getBannerItem();
  const acadamyContent: {
    content: string;
    relatedTitle: string;
    relatedlink: string;
    trainingdiscription: string;
    trainingimageurl: string;
    trainingimagealt: string;
    visiontitle: string;
    visiondiscription: string;
    visionimageurl: string;
    visionimagealt: string;
    missiontitle: string;
    missiondiscription: string;
    missionimageurl: string;
    missionimagealt: string;
    aimtitle: string;
    aimdiscription: string;
    aimimageurl: string;
    aimimagealt: string;
    objectivesTitle: string; // Dynamic objectives title
    objectivesPoints: any; // Dynamic objectives points
    sidebarTitle: string;
    sidebarButton: string;
    sidebarImage: string;
    sidebar_button_link: string;
  }
  = getAcadamyContent();

  const seoTags = useSeo(state.metatags);
  const breadcrumbsData = generateBreadcrumbs(
    getDefault(acadamyContent.breadcrumb),
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
            heroBanner={bannerItem}
          />
          <Acadamy
            content={acadamyContent.content}
            relatedTitle={acadamyContent.relatedTitle}
            relatedlink={acadamyContent.relatedlink}
            trainingdiscription={acadamyContent.trainingdiscription}
            trainingimageurl={acadamyContent.trainingimageurl}
            trainingimagealt={acadamyContent.trainingimagealt}
            visiontitle={acadamyContent.visiontitle}
            visiondiscription={acadamyContent.visiondiscription}
            visionimageurl={acadamyContent.visionimageurl}
            visionimagealt={acadamyContent.visionimagealt}
            missiontitle={acadamyContent.missiontitle}
            missiondiscription={acadamyContent.missiondiscription}
            missionimageurl={acadamyContent.missionimageurl}
            missionimagealt={acadamyContent.missionimagealt}
            aimtitle={acadamyContent.aimtitle}
            aimdiscription={acadamyContent.aimdiscription}
            aimimageurl={acadamyContent.aimimageurl}
            aimimagealt={acadamyContent.aimimagealt}
            objectivesTitle={acadamyContent.objectivesTitle} // Passing dynamic objectives title
            objectivesPoints={acadamyContent.objectivesPoints} // Passing dynamic objectives points
            sidebarTitle={acadamyContent.sidebarTitle}
            sidebarButton={acadamyContent.sidebarButton}
            sidebarImage={acadamyContent.sidebarImage}
            sidebar_button_link={acadamyContent.sidebar_button_link}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default AcadamyLanding;
