import React, { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "@corporate-portal/components";
import { PublicLayout } from "@src/layout";
import { LoaderOverlay } from "@components/Loader";
import { CareerScreen } from "@corporate-portal/pages";
import { useNavigationHandler } from "@src/hooks";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute, isParallexEnabled } from "@src/constants";
import { newFetchData as fetchData, getDefault } from "@src/utils";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const ProductMotor: React.FC = () => {
  const [state, setState] = useState({
    siteData: {},
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
        fetchData(cmsAPIRoute["jobsListing"], currentLanguage),
      ]);
      setState({
        siteData: siteData ?? {},
        metatags: metatags ?? {},
        loading: false,
        error: false,
      });
    } catch (error) {
      setState({
        siteData: {},
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
    const data = state.siteData?.data ?? {};
    return {
      heroBanner: data.slider ?? [],
      buttonLabel: data.button_text,
      buttonLink: data.button_link,
      support: data.support,
      compData: data.cardsData,
      jobsdata: data,
      commonlables: state?.siteData?.common_lables,
      breadcrumbLabel: data.breadcrumb,
    };
  };

  const {
    heroBanner,
    buttonLabel,
    buttonLink,
    support,
    compData,
    jobsdata,
    commonlables,
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
      {!state.loading && (
        <React.Fragment>
          {seoTags}
          <HeroBanner
            heroBanner={heroBanner}
            buttonLabel={buttonLabel}
            buttonLink={buttonLink}
            breadcrumbs={breadcrumbsData}
            navigateTo={handleNavigate}
            isParallex = {isParallexEnabled}
          />
          <CareerScreen support={support} 
          compData={compData}
          jobsdata ={jobsdata}
          commonlables={commonlables}
           />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default ProductMotor;
