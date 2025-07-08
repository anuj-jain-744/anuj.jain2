import React, { useEffect, useState, useCallback } from "react";
import { useCommonContext, generateBreadcrumbs } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { newFetchData as fetchData, getDefault } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { BoardofDirector } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";

const BoardofDirectorsLanding: React.FC = () => {
  const [state, setState] = useState({
    boardofdirectorsData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: boardofdirectorsData, metadata: metatags }] =
        await Promise.all([
          fetchData(cmsAPIRoute["BoardofDirectors"], currentLanguage),
        ]);

      setState({
        boardofdirectorsData: boardofdirectorsData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({
        boardofdirectorsData: {},
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getContent = () => {
    const data = state.boardofdirectorsData?.data ?? {};
    const commonData = state.boardofdirectorsData?.common_data ?? {};
    return {
      boardDirectorsData: { content: getDefault(data) },
      teamHeading: {
        walaa_team_title: getDefault(commonData.walaa_team_title),
      },
      titleBoardofDirector: {
        slider_title: getDefault(commonData.slider_title),
      },
      breadcrumbLabel: commonData.breadcrumb,
    };
  };

  const {
    boardDirectorsData,
    teamHeading,
    titleBoardofDirector,
    breadcrumbLabel,
  } = getContent();

  const seoTags = useSeo(state.metatags);

  const breadcrumbsData = generateBreadcrumbs(
    getDefault(breadcrumbLabel),
    currentLanguage
  );

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state?.loading && (
        <React.Fragment>
          {seoTags}

          <HighlighterBanner
            showInput={true}
            title={titleBoardofDirector.slider_title}
            breadcrumbsData={breadcrumbsData}
            classApply={"policy-title"}
            navigateTo={handleNavigate}
          />

          <BoardofDirector
            directorsData={boardDirectorsData}
            teamHeading={teamHeading}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default BoardofDirectorsLanding;
