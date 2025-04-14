import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "@corporate-portal/components";
import { PublicLayout } from "@src/layout";
import { BoardofManagement } from "@corporate-portal/pages";
import { LoaderOverlay } from "../../components";
import { getDefault, objectToArray } from "../../utils";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData as fetchData } from "@src/utils";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const BoardofManagementLanding: React.FC = () => {
  const [state, setState] = useState({
    metatags: {},
    boardofmanagementData: {},
    loading: true,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: boardofmanagementData, metadata: metatags }] =
        await Promise.all([
          fetchData(cmsAPIRoute["BoardofManagement"], currentLanguage),
        ]);

      setState((prevState) => ({
        ...prevState,
        boardofmanagementData,
        metatags,
        loading: false,
      }));
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

  const getContent = () => {
    const data = state.boardofmanagementData?.bom_data ?? {};
    const commonData = state.boardofmanagementData?.common_data ?? {};
    return {
      boardManagementData: { content: getDefault(data) },
      teamHeading: {
        walaa_team_title: getDefault(commonData.walaa_team_title),
      },
      titleBoardofManagement: {
        slider_title: getDefault(commonData.slider_title),
      },
      breadcrumbLabel: commonData.breadcrumb,
    };
  };

  const { boardManagementData, teamHeading, breadcrumbLabel } = getContent();

  const seoTags = useSeo(state.metatags);

  const breadcrumbsData = generateBreadcrumbs(
    getDefault(breadcrumbLabel),
    currentLanguage
  );

  const getBannerItem = () => {
    if (state.boardofmanagementData) {
      const { slider_title, slider_description, slider_image_url } =
        state.boardofmanagementData?.common_data || {};
      return objectToArray(slider_title, slider_description, slider_image_url);
    }
    return [];
  };

  const bannerItem = getBannerItem();

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <>
          {seoTags}

          <HeroBanner
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigate}
            heroBanner={bannerItem || []}
          />

          <BoardofManagement
            managementData={boardManagementData}
            teamHeading={teamHeading}
          />
        </>
      )}
    </PublicLayout>
  );
};

export default BoardofManagementLanding;
