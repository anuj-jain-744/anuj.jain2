import React, { useEffect, useState, useCallback } from "react";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { LoaderOverlay } from "@components/Loader";
import { Surplus } from "@corporate-portal/pages";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { newFetchData as fetchData } from "@src/utils";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

interface FAQItem {
  question: string;
  answer: string;
}

interface CommonData {
  title: string;
  description: string;
  image: string;
}

interface SiteData {
  faq: FAQItem[];
  data: CommonData[];
  breadcrumb_label?: string; 
}

const SurplusLanding: React.FC = () => {
  const [state, setState] = useState<{
    siteData: SiteData | null;
    metatags: {};
    loading: boolean;
    error: boolean;
  }>({
    siteData: null,
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: siteData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["surplus"], currentLanguage),
      ]);

      setState({
        siteData: siteData ?? null,
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({
        siteData: null,
        metatags: {},
        loading: false,
        error: true,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const { siteData, loading, error, metatags } = state;

  const seoTags = useSeo(metatags);

  const breadcrumbLabel = siteData?.breadcrumb_label ?? "Surplus";

  const breadcrumbsData = generateBreadcrumbs(breadcrumbLabel, currentLanguage);

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}

      {!loading && !error && (
        <React.Fragment>
          {seoTags}

          <div className="surplus-wrapper">
            <HighlighterBanner
              showInput={true}
              title={breadcrumbLabel}  
              breadcrumbsData={breadcrumbsData}
              classApply={"policy-title"}
              navigateTo={handleNavigate}
            />

            {siteData && (
              <Surplus
                accordianData={siteData.faq}
                common_data={siteData.data[0]}
                navigateTo={handleNavigate}
              />
            )}
          </div>
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default SurplusLanding;
