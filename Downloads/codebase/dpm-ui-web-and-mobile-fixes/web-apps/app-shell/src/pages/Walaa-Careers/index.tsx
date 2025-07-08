import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PublicLayout } from "@src/layout";
import { LoaderOverlay } from "@components/Loader";
import { useNavigationHandler } from "@src/hooks";
import { useCommonContext, useApiCall } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { newFetchData as fetchData, getDefault } from "@src/utils";
import { useSeo } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { WalaaCareerMarketing } from "@corporate-portal/pages/WalaaCareerMarketing";

const WalaaCareers: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state:jobDetails } = location;

    const { makeApiCall, data: jobData, isLoading } = useApiCall(
    1,
    `${cmsAPIRoute["jobsDetails"]}/${jobDetails?.jobId}`,
    "get"
    );


    const [state, setState] = useState({
        siteData: {},
        metatags: {},
        loading: true,
        error: false,
    });

    useEffect(() => {
        if (jobDetails?.jobId) {
            makeApiCall();
        } else {
            navigate("/Careers");
        }
    }, [jobDetails, makeApiCall]);
    const { currentLanguage } = useCommonContext();
    const handleNavigate = useNavigationHandler();

    useEffect(() => {
        if (jobData) {
            setState({
                siteData: jobData.data ?? {},
                metatags: jobData.metadata ?? {},
                loading: isLoading,
                error: false,
            });
        }
    }, [jobData, isLoading]);

    const getContent = () => {
        const data = jobData ?? {};
        return {
            jobsDetailData: data,
            breadcrumbLabel: data?.overviewdata?.breadcrumb,
        };
    };

    const {
        jobsDetailData,
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

                    <div className="page-title">
                        <HighlighterBanner
                            showInput={true}
                            title={breadcrumbLabel}
                            breadcrumbsData={breadcrumbsData}
                            classApply={"policy-title"}
                            navigateTo={handleNavigate}
                        />
                    </div>

                    <WalaaCareerMarketing
                        jobsDetailData={jobsDetailData}
                    />
                </React.Fragment>
            )} 
        </PublicLayout>

    );
};

export default WalaaCareers;