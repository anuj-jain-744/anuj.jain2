import React, { useEffect, useState, useCallback } from "react";
import { ClaimWidget, ClaimCard } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { LoaderOverlay } from "@components/Loader";
import { useNavigationHandler } from "@src/hooks";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData as fetchData, getDefault } from "@src/utils";
import './index.scss';
import { PublicLayout } from "@src/layout";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";

const TrackClaim: React.FC = () => {
  const [state, setState] = useState<any>({
    claimData: {},
    metatags: {},
    loading: true,
    error: false,
    claimConfigData:{},
    claimMetatags:{}
  });

  const handleNavigate = useNavigationHandler();
  const { currentLanguage } = useCommonContext();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const [{ data: claimDataResponse, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["trackclaim"], currentLanguage),
      ]);

      const [{ data: claimConfigDataResponse, metadata: claimMetatags }] = await Promise.all([
        fetchData(cmsAPIRoute["consumerHomepage"], currentLanguage),
      ]);

      setState((prevState) => ({
        ...prevState,
        claimData: claimDataResponse,
        metatags: metatags ?? {},
        loading: false,
        error: false,
        claimConfigData: claimConfigDataResponse,
        claimMetatags: claimMetatags ?? {},
      }));
    } catch (error) {
      console.error("Error fetching claim data:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: true,
      }));
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getContent = () => {
    const commonData = state.claimData?.common_data ?? {};
    return {
      registerClaim: getDefault(commonData.register_claim),
      registerClaimLink: getDefault(commonData.register_claim_link),
      trackYourClaim: getDefault(commonData.track_your_claim),
      trackYourClaimLink: getDefault(commonData.track_your_claim_link),
      trackYourClaimDesc: getDefault(commonData.track_your_claim_desc),
      iconImages: getDefault(commonData.icon_images),
      formInputData: state.claimData?.claim_form?.[0]?.fields || [],
      cardContent: state.claimData?.data?.length > 0 ? state.claimData.data : [],
      breadcrumbLabel: commonData.breadcrumb,
      claimConfigData:state.claimConfigData?.config?.[0]
    };
  };

  const {
    registerClaim,
    registerClaimLink,
    trackYourClaim,
    trackYourClaimLink,
    trackYourClaimDesc,
    iconImages,
    formInputData,
    cardContent,
    breadcrumbLabel,
    claimConfigData
  } = getContent();

  const seoTags = useSeo(state.metatags);
  const breadcrumbsData = generateBreadcrumbs(getDefault(breadcrumbLabel), currentLanguage);

  return (
    <PublicLayout>
      <React.Fragment>
        {state.loading && <LoaderOverlay />}
        {seoTags}
        <HighlighterBanner
          showInput={true}
          title={getDefault(trackYourClaim)}
          breadcrumbsData={breadcrumbsData}
          classApply={"policy-title"}
          navigateTo={handleNavigate}
        />
        <div className="track-claim-wrapper">
          <ClaimWidget
            formHeaderData={{
              registerclaim: registerClaim,
              registerclaimlink: registerClaimLink,
              trackyourclaim: trackYourClaim,
              trackyourclaim_link: trackYourClaimLink,
              trackyourclaimdesc: trackYourClaimDesc,
              iconimages: iconImages,
              formInputData: formInputData,
            }}
            claimConfigData={claimConfigData}
            navigateTo={handleNavigate}
          />
          <ClaimCard
            cardContent={cardContent}
          />
        </div>
      </React.Fragment>
    </PublicLayout>
  );
};

export default TrackClaim;