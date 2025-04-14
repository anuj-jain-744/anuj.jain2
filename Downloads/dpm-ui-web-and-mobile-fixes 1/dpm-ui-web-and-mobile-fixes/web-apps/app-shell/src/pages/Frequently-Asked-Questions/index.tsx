import React, { useEffect, useState, useCallback } from "react";
import { FAQScreen } from "@corporate-portal/pages";
import { LoaderOverlay } from "@components/Loader";
import { newFetchData as fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { useNavigationHandler, useSeo } from "@src/hooks";

const FAQhelp: React.FC = () => {
  const [state, setState] = useState({
    faqData: {},
    metatags: {},
    loading: true,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const fetchAllData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const [{ data: faqData, metadata: metatags }] = await Promise.all([
        fetchData(cmsAPIRoute["faqListing"], currentLanguage),
      ]);

      setState({
        faqData,
        metatags,
        loading: false,
      });
    } catch (error) {
      setState({
        faqData: {},
        metatags: {},
        loading: false,
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const seoTags = useSeo(state.metatags);

  const { faqData, loading } = state;

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}

      {!loading && (
        <React.Fragment>
          {seoTags}

          <FAQScreen
            categories={faqData?.categories || []}
            accordianData={faqData?.data || []}
            navigateTo={handleNavigate}
          />
        </React.Fragment>
      )}
    </PublicLayout>
  );
};

export default FAQhelp;
