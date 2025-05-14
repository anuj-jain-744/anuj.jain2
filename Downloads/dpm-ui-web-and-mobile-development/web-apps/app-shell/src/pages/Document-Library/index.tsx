import React, { Fragment, useEffect, useState, useCallback } from "react";
import { LoaderOverlay } from "@components/Loader";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { newFetchData as fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { DocumentLibraryLayout } from "@corporate-portal/pages";
import { useCommonContext, generateBreadcrumbs } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";

const DocumentLibraryPage: React.FC = () => {
  const [state, setState] = useState({
    metatags: {},
    documentLibraryData: {},
  });

  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useCommonContext();

  const handleNavigation = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: documentLibraryData, metadata: metatags }] =
        await Promise.all([
          fetchData(cmsAPIRoute["documentLibrary"], currentLanguage),
        ]);
      setState({ documentLibraryData, metatags });
    } finally {
      setLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const { documentLibraryData, metatags } = state;

  const seoTags = useSeo(metatags);

  const breadcrumbLabel =
    documentLibraryData?.data?.breadcrumb || documentLibraryData?.data?.title;

  const breadcrumbsData = breadcrumbLabel
    ? generateBreadcrumbs(breadcrumbLabel, currentLanguage)
    : null;

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}
      {!loading && (
        <Fragment>
          {seoTags}
          {documentLibraryData && documentLibraryData?.data?.banner_title && (
            <HighlighterBanner
              showInput={true}
              title={documentLibraryData?.data?.banner_title}
              breadcrumbsData={breadcrumbsData}
              classApply={"policy-title"}
              navigateTo={handleNavigation}
            />
          )}
          {documentLibraryData && documentLibraryData?.data && (
            <DocumentLibraryLayout
              description={documentLibraryData?.data?.banner_description}
              documents={documentLibraryData?.documents}
              navigateTo={handleNavigation}
            />
          )}
        </Fragment>
      )}
    </PublicLayout>
  );
};

export default DocumentLibraryPage;
