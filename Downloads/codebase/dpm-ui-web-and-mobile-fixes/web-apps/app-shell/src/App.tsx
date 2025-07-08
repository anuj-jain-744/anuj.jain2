import React, { useEffect, Suspense } from "react";
import {
  setDefaultLanguage,
  setLanguage,
  setLanguageLoading,
  setLanguageError,
  slices,
  CommonProvider,
  fetchMotorLanguage
} from "@dpm/shared-module";
import { HelmetProvider } from "react-helmet-async";
import { LoaderOverlay } from "./components";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import StaticRouter from "./routes";
import { useHeaderMenuCms } from "./hooks/cmsData/useHeaderMenuCms";
import { useDashboardLanguageData } from "./hooks/cmsData/useDashboardLanguageData";
import { useFooterMenuCms } from "./hooks/cmsData/useFooterMenuCms";
import { useConsumerLanguageData } from "./hooks/cmsData/useConsumerLanguageData";

const App: React.FC = () => {
  useEffect(() => {
    setDefaultLanguage();
  }, []);

  const dispatch = useDispatch();
  const {
    setHeaderMenuLanguageLoading,
    setHeaderMenuLanguage,
    setHeaderMenuLanguageError,
  } = slices.headerMenuSlice;
  const {
    setFooterMenuLanguage,
    setFooterMenuLanguageLoading,
    setFooterMenuLanguageError,
  } = slices.footerMenuSlice;
  const { setAuth } = slices.auth;
  const userDetails = sessionStorage.getItem("userDetails");
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length !== 0) {
      const { message, isValid, referenceNo, sessionSecretId } = JSON.parse(
        userDetails as string
      );
      const userProfileDetails = JSON.parse(
        userDetails as string
      ).userProfileData;
      dispatch(
        setAuth({
          userInfo: userProfileDetails,
          userToken: null,
          authDetails: {
            message: message,
            isValid: isValid,
            referenceNo: referenceNo,
            sessionSecretId: sessionSecretId,
          },
        })
      );
    }
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["motorLanguage"],
    queryFn: fetchMotorLanguage,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    dispatch(setLanguageLoading(isLoading));

    if (data) {
      dispatch(setLanguage(data));
    }

    if (error) {
      dispatch(
        setLanguageError((error as Error).message || "An error occurred")
      );
    }
  }, [data, error, isLoading]);

  const {
    data: headerMenuCmsData,
    isLoading: headerMenuCmsLoading,
    error: headerMenuCmsError,
  } = useHeaderMenuCms();
  useEffect(() => {
    dispatch(setHeaderMenuLanguageLoading(headerMenuCmsLoading));

    if ( headerMenuCmsData?.menus) {
      dispatch(setHeaderMenuLanguage(headerMenuCmsData));
    }

    if (headerMenuCmsError) {
      dispatch(
        setHeaderMenuLanguageError(
          (headerMenuCmsError as Error).message || "An error occurred"
        )
      );
    }
  }, [headerMenuCmsData, headerMenuCmsError, headerMenuCmsLoading]);

  // footerMenuCms actions updated
  const {
    data: footerMenuCmsData,
    isLoading: footerMenuCmsLoading,
    error: footerMenuCmsError,
  } = useFooterMenuCms();

  useEffect(() => {
    dispatch(setFooterMenuLanguageLoading(footerMenuCmsLoading));

    if (footerMenuCmsData) {
      dispatch(setFooterMenuLanguage(footerMenuCmsData));
    }

    if (footerMenuCmsError) {
      dispatch(
        setFooterMenuLanguageError(
          (footerMenuCmsError as Error).message || "An error occurred"
        )
      );
    }
  }, [footerMenuCmsData, footerMenuCmsError, footerMenuCmsLoading]);

  // dashboardCms actions updated
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboardLanguageData();
  const {
    setDashboardLanguageData,
    setDashboardLanguageDataLoading,
    setDashboardLanguageDataError,
  } = slices.dashboardCms;
  useEffect(() => {
    dispatch(setDashboardLanguageDataLoading(dashboardLoading));
    if (dashboardData) {
      dispatch(setDashboardLanguageData(dashboardData));
    }
    if (dashboardError) {
      dispatch(
        setDashboardLanguageDataError(
          (dashboardError as Error).message || "An error occurred"
        )
      );
    }
  }, [dashboardLoading, dashboardData, dashboardError]);

   //homeconfigCMS action updated
   const {
    data: consumerCmsLangData,
    isLoading: consumerCmsLoading,
    error: consumerCmsError,
  } = useConsumerLanguageData();
  const {
    setConsumerLanguageData,
    setConsumerLanguageLoading,
    setConsumerLanguageError,
  } =   slices.consumerLanguageSlice;
  useEffect(() => {
    dispatch(setConsumerLanguageLoading(consumerCmsLoading));
    if (consumerCmsLangData) {
      dispatch(setConsumerLanguageData(consumerCmsLangData));
    }
    if (consumerCmsError) {
      dispatch(
        setConsumerLanguageError(
          (consumerCmsError as Error).message || "An error occurred"
        )
      );
    }
  }, [consumerCmsLoading, consumerCmsLangData, consumerCmsError]);

  return (
    <CommonProvider>
      <Suspense fallback={<LoaderOverlay />}>
        <HelmetProvider>
          <StaticRouter />
        </HelmetProvider>
      </Suspense>
    </CommonProvider>
  );
};

export default App;
