import React, { useEffect, useState } from "react";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler, useSeo } from "@src/hooks";
import { fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { LearnMore } from "@corporate-portal/components";
import { LoaderOverlay } from "@components/Loader";
import { getDefault } from "@src/utils";
import { useParams } from "react-router-dom";
import { generateBreadcrumbs } from "@dpm/shared-module";

const LearnMoreLanding: React.FC = () => {
  const [state, setState] = useState({
    learnmoreData: {},
    loading: true,
    error: false,
    metatags: {},
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();
  const { learnmore_id } = useParams<{ learnmore_id: string }>();

  const fetchAllData = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [learnMoreResponse] = await Promise.all([
        fetchData(cmsAPIRoute["feature"] + `/${learnmore_id}`, currentLanguage),
      ]);
      setState((prevState) => ({
        ...prevState,
        learnmoreData: learnMoreResponse,
        metatags: learnMoreResponse?.metatags || {},
        loading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: true,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [learnmore_id, currentLanguage]);

  const getLearnMoreContent = () => {
    if (state.learnmoreData && state.learnmoreData.data && state.learnmoreData.data.length > 0) {
      const data = state.learnmoreData.data[0];
      return {
        title: getDefault(data?.title),
        content: getDefault(data?.content),
        relatedLinksTitle: getDefault(state.learnmoreData?.relatedLinkTitle),
        relatedLInks: state.learnmoreData?.relatedLInks || [],
      };
    }
    return null;
  };

  const learnmoreContent = getLearnMoreContent();
  const seoTags = useSeo(state.metatags);
  const breadcrumbsData = generateBreadcrumbs(
    getDefault(learnmoreContent?.title),
    currentLanguage
  );

  return (
    <PublicLayout>
      {state.loading && <LoaderOverlay />}
      {!state.loading && (
        <React.Fragment>
          {seoTags}
          {learnmoreContent && (
            <>
              <HighlighterBanner
                showInput={true}
                title={learnmoreContent.title}
                breadcrumbsData={breadcrumbsData}
                classApply={"policy-title"}
                navigateTo={handleNavigate}
              />
              <LearnMore
                content={learnmoreContent.content}
                relatedLinksTitle={learnmoreContent.relatedLinksTitle}
                links={learnmoreContent.relatedLInks.map((link) => ({
                  text: link.page_title,
                  route: link.page_link,
                }))}
                navigateTo={handleNavigate}
              />
            </>
          )}
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default LearnMoreLanding;