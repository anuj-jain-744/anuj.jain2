import React, { useEffect, useState, useCallback } from "react";
import {
  HeroBanner,
  ViewBranches,
  HeadOfficeWidget,
} from "@corporate-portal/components";
import { PublicLayout } from "@src/layout";
import { LoaderOverlay } from "@components/Loader";
import { getDefault, objectToArray } from "@src/utils";
import { Container } from "react-bootstrap";
import { useCommonContext } from "@dpm/shared-module";
import { newFetchData as fetchData } from "@src/utils";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

interface BranchData {
  banner_image?: { url: string };
  banner_title?: string;
  banner_description?: string;
  page_title?: string;
  body?: string;
  headOffice?: any;
}

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const BranchLocatorPage: React.FC = () => {
  const [state, setState] = useState({
    branchData: {} as BranchData,
    metatags: {},
    loading: true,
    mapData: {},
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: branchData, metadata: metatags }, { data: mapData }] =
        await await Promise.all([
          fetchData(cmsAPIRoute["branchLocator"], currentLanguage),
          fetchData(cmsAPIRoute["branches"], currentLanguage),
        ]);

      setState({
        branchData: branchData ?? {},
        metatags: metatags ?? {},
        loading: false,
        mapData: mapData,
      });
    } catch (error) {
      setState({
        branchData: {},
        metatags: {},
        loading: false,
        mapData: {},
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getContent = () => {
    const { branchData } = state;
    const commonData = branchData?.data ?? {};

    return {
      bannerItem: getBannerItem(commonData),
      pageTitle: getDefault(commonData.page_title),
      pageBody: getDefault(commonData.body),
      breadcrumbLabel: getDefault(commonData.breadcrumb),
    };
  };

  const getBannerItem = (commonData: any): string[] => {
    if (commonData?.banner_image) {
      const { banner_title, banner_description, banner_image } = commonData;
      return objectToArray(
        banner_title || "",
        banner_description || "",
        banner_image?.url || ""
      );
    }
    return [];
  };

  const { bannerItem, pageTitle, pageBody, breadcrumbLabel } = getContent();

  const seoTags = useSeo(state.metatags);

  const breadcrumbsData = generateBreadcrumbs(breadcrumbLabel, currentLanguage);

  return (
    <PublicLayout>
      <React.Fragment>
        {state.loading && <LoaderOverlay />}

        {seoTags}

        {!state.loading && (
          <React.Fragment>
            <HeroBanner
              breadcrumbs={breadcrumbsData}
              navigateTo={handleNavigate}
              heroBanner={bannerItem}
            />
            <Container>
              <HeadOfficeWidget
                data={getDefault(state.branchData?.headoffice)}
              />
            </Container>
            <ViewBranches
              title={pageTitle}
              description={pageBody}
              navigateTo={handleNavigate}
              cities={state?.mapData?.cityData || []}
              regions={state?.mapData?.regions || []}
              branchTypes={state?.mapData?.branchTypes || []}
              branches={state?.mapData?.data || []}
              commonLabels={state?.mapData?.common_labels || {}}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default BranchLocatorPage;
