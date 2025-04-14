import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner, HighlighterCard } from "@corporate-portal/components";
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
        imageurl: getDefault(data?.vision_image?.url),
        imagealt: getDefault(data?.vision_image?.alt),
        breadcrumb: getDefault(data?.breadcrumb), 
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
    imageurl: string;
    imagealt: string;
    breadcrumb: string; 
  } = getAcadamyContent();

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
            imageurl={acadamyContent.imageurl}
            imagealt={acadamyContent.imagealt}
          />
          <HighlighterCard
            type="default"
            cardContent={
              state.acadamyData &&
              state.acadamyData?.data?.length > 0 &&
              getDefault(state.acadamyData?.data[0])
            }
            navigateTo={handleNavigate}
            relatedContent={acadamyContent.relatedlink}
            relatedTitle={acadamyContent.relatedTitle}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default AcadamyLanding;