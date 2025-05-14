import React, { useEffect, useState, useCallback } from "react";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler } from "@src/hooks";
import { newFetchData as fetchData, getDefault } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { LoaderOverlay } from "@components/Loader";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";
import SubmitTicket from "@consumer-portal/components/MyTickets/SubmitTicket/SubmitTicket";

const SubmitTicketScreen: React.FC = () => {
  const [state, setState] = useState({
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
        fetchData(cmsAPIRoute["postFeedback"], currentLanguage),
      ]);

      setState({
        siteData: siteData ?? {},
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

  const getContent = () => {
    const data = state.siteData?.data ?? {};
    return {
      bannerTitle: getDefault(data.banner_title),
      breadcrumbsData: generateBreadcrumbs(
        getDefault(data.breadcrumb),
        currentLanguage
      ),
    };
  };

  const breadcrumbsData = [
  {label: 'Dashboard', route: '/Dashboard'},
  {label: 'Submit a Ticket', route: '/'}
];
 
  const seoTags = useSeo(state.metatags);

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <React.Fragment>
          {seoTags}
          <HighlighterBanner
            showInput={true}
            title="Submit a Ticket"
            breadcrumbsData={breadcrumbsData}
            classApply={"policy-title"}
            navigateTo={handleNavigate}
          />
          {state.siteData && <SubmitTicket />}
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default SubmitTicketScreen;