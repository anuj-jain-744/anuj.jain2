import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "@corporate-portal/components";
import { NewsroomScreen } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";
import { getDefault, objectToArray } from "@utils";
import { fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const Newsroom: React.FC = () => {
  const [state, setState] = useState({
    newsData: {} as any,
    loading: true,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [response] = await Promise.all([
        fetchData(cmsAPIRoute["newsListing"], currentLanguage),
      ]);
      setState({
        newsData: response.data,
        loading: false,
      });
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const { newsData, loading } = state;

  const breadcrumbsData = generateBreadcrumbs(
    getDefault(newsData?.breadcrumb),
    currentLanguage
  );

  const getBannerItem = () => {
    if (newsData) {
      const { title, content, banner_image } = newsData;
      return objectToArray(title, content, banner_image?.url);
    }
    return [];
  };

  const highlighterData = {
    title: getDefault(newsData?.subscribe_label),
    placeholder: getDefault(newsData?.placeholder_text),
    label: getDefault(newsData?.subscribe_button),
    read_more: getDefault(newsData?.read_more),
  };

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}
      {!loading && (
        <React.Fragment>
          <HeroBanner
            heroBanner={getBannerItem()}
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigate}
          />

          <NewsroomScreen
            navigateTo={handleNavigate}
            title={getDefault(newsData?.short_description)}
            newsItem={newsData?.news_list || []}
            highlighterData={highlighterData}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default Newsroom;
