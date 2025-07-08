import React, { useEffect, useState, useCallback } from "react";
import { generateBreadcrumbs, useCommonContext, useApiCall } from "@dpm/shared-module";
import { useNavigationHandler } from "@src/hooks";
import { PublicLayout } from "@src/layout";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { PrivacyCookieNotice } from "@corporate-portal/components/PrivacyCookieNotice";
import { LoaderOverlay } from "@components/Loader";
import { getDefault } from "@src/utils";
import { useSeo } from "@src/hooks";


const PrivacyNotice: React.FC = () => {
  const [state, setState] = useState({
    privacyData: {},
    metatags: {},
    loading: true,
    error: false,
  });

  const { currentLanguage } = useCommonContext();
  const handleNavigate = useNavigationHandler();

  const { makeApiCall, isLoading, errors, data  } = useApiCall(1, "privacy-notice", "get");
  
  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(()=>{
    if(data){
      setState({
        privacyData: data?.data[0] ?? {},
        metatags: data?.metadata ?? {},
        loading: isLoading,
        error: false,
      });
      getContent();
    }    
  }, [isLoading, data, errors ])

  const getContent = () => {
    const data = state.privacyData ?? {};
    console.log(data);

     const breadcrumbLabel =
       getDefault(data?.breadcrumb) || getDefault(data?.title);

    return {
      title: getDefault(data?.title),
      content: getDefault(data?.content),
      subTitle: getDefault(data?.sub_title),
      sidebarContent: getDefault(data?.sidebar_content),
      breadcrumbLabel,
    };
  };

  const {
    title,
    content,
    subTitle,
    sidebarContent,
    breadcrumbLabel
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
            breadcrumbsData={breadcrumbsData ?? ""}
            classApply={"policy-title"}
            navigateTo={handleNavigate}
          />

          {content && (
            <PrivacyCookieNotice
              content={content}
              sidebarContent={sidebarContent}
              subTitle={subTitle}
              navigateTo={handleNavigate}
            />
          )}
        </>
      )}
    </PublicLayout>
  );
};

export default PrivacyNotice;
