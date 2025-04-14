import React, { useEffect, useState, useCallback } from "react";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { newFetchData as fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { ShariaGovernance } from "@corporate-portal/components/ShariaGovernance";
import { LoaderOverlay } from "@components/Loader";
import { getDefault } from "@src/utils";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const ShariaLanding: React.FC = () => {
  const [state, setState] = useState({
    shariaData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: shariaData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["shariaGovernance"], currentLanguage),
      ]);

      setState({
        shariaData: shariaData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({
        shariaData: {},
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
    const data = state.shariaData?.data?.[0] ?? {};
    const commonData = state.shariaData?.common_data ?? {};

    const breadcrumbLabel =
      getDefault(commonData.breadcrumb) || getDefault(data?.title);

    return {
      title: getDefault(data?.title),
      content: getDefault(data?.content),
      knowMoreTitle: getDefault(data?.related_links_title),
      sidebarDescription: getDefault(data?.sidebar_logo_description),
      websiteLink: getDefault(data?.websiteLink),
      sidebarImage: data?.sidebar_image || {},
      relatedLinks: data?.relatedlinks || [],
      breadcrumbLabel,
    };
  };

  const {
    title,
    content,
    knowMoreTitle,
    sidebarDescription,
    websiteLink,
    sidebarImage,
    relatedLinks,
    breadcrumbLabel,
  } = getContent();

  const seoTags = useSeo(state.metatags);

  const breadcrumbsData = generateBreadcrumbs(breadcrumbLabel, currentLanguage);

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <>
          {seoTags}

          <HighlighterBanner
            showInput={true}
            title={title ?? ""}
            breadcrumbsData={breadcrumbsData}
            classApply={"policy-title"}
            navigateTo={handleNavigate}
          />

          {content && (
            <ShariaGovernance
              content={content}
              knowMoreTitle={knowMoreTitle}
              links={relatedLinks.map((link) => ({
                text: link.page_title,
                route: link.page_link,
              }))}
              sidebarDescription={sidebarDescription}
              websiteLink={websiteLink}
              sidebarImage={sidebarImage}
              navigateTo={handleNavigate}
            />
          )}
        </>
      )}
    </PublicLayout>
  );
};

export default ShariaLanding;
