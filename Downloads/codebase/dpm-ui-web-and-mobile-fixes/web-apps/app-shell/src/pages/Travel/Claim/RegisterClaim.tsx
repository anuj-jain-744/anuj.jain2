import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoaderOverlay } from "../../../components";
import { Header } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import ClaimContent from "@consumer-portal/pages/travel/registerClaim";
import { navigateTo, newFetchData as fetchData } from "@src/utils";
import { useCommonContext, RootState } from "@dpm/shared-module";
import { cmsAPIRoute, commonTexts } from "@src/constants";
import { commonKeywords } from "@consumer-portal/constant";

interface DataRef {
  consumer: Record<string, string>;
  product: Record<string, string>;
  header: Array<{
    linkName: string;
    childrens?: Array<{
      linkName: string;
      link_content: string;
      attributes: {
        class: string[];
      };
      menuUrl: string;
    }>;
  }>;
  breadcrumb: Array<{
    label: string;
    route: string;
  }>;
}

const RegisterClaim = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { currentLanguage } = useCommonContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dataRef = useRef<DataRef>({
    consumer: {},
    product: {},
    header: [],
    breadcrumb: [],
  });
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const locationData = useMemo(() => {
    const result: {
      policies: Array<{ policyNo: string }>;
      userProfileData: Record<string, string>;
    } = {
      policies: [],
      userProfileData: { userName: "" },
    };
    const { policies: policyList, data, userProfileData } = location.state ?? {};
    if (Array.isArray(policyList)) result.policies = policyList;
    else if (data instanceof Object) {
      result.userProfileData = { ...data.userProfileData };
      if (Array.isArray(data.policies)) result.policies = data.policies;
      if (data.policyNo) result.policies = [{ policyNo: data.policyNo }];
      else if (data.policies instanceof Object && data.policies.policyNo)
        result.policies = [{ policyNo: data.policies.policyNo }];
    }
    Object.assign(result.userProfileData, userProfileData);
    if (isAuthenticated === true)
      Object.assign(result.userProfileData, userInfo);
    const englishName =
      isAuthenticated === true
        ? userInfo.name
        : result.userProfileData.insurerNameEN;
    const arabicName: string =
      isAuthenticated === true
        ? userInfo.ownerFullNameArabic
        : result.userProfileData.insurerNameAR;
    if (currentLanguage !== commonKeywords.ar)
      result.userProfileData.userName = englishName ?? "";
    else
      result.userProfileData.userName = (arabicName || englishName) ?? "";
    return result;
  }, [currentLanguage]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const [
        {
          data: { config },
        },
        {
          data: { config: productConfig },
        },
        {
          data: { menus },
        },
      ] = await Promise.all([
        fetchData(cmsAPIRoute.consumerConfig, currentLanguage),
        fetchData(cmsAPIRoute.travelConfig, currentLanguage),
        fetchData(cmsAPIRoute.header, currentLanguage),
      ]);
      const consumer =
        Array.isArray(config) && config[0] instanceof Object ? config[0] : {};
      dataRef.current.consumer = consumer;
      dataRef.current.product =
        productConfig instanceof Object ? productConfig : {};
      dataRef.current.header = Array.isArray(menus) ? menus : [];
      const breadcrumbItems = [
        {
          label: isAuthenticated ? consumer.dashboard : consumer.home,
          route: isAuthenticated ? "/dashboard" : "/",
        },
        {
          label: consumer.claims,
          route: "/register-claim",
        },
        { label: consumer.register_a_claim, route: "" },
      ];
      if (isAuthenticated === true) breadcrumbItems.splice(1, 1);
      dataRef.current.breadcrumb = breadcrumbItems;
      setLoading(false);
    };
    loadData();
  }, [currentLanguage]);

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleBackButton = () => {
    const route = dataRef.current.breadcrumb.at(-2)?.route;
    if (route) navigate(route);
  };

  return (
    <>
      {loading && <LoaderOverlay />}
      {location.state instanceof Object ? (
        <>
          <Header
            isSearchEnable={false}
            isAuthenticated={false}
            menuItems={dataRef.current.header}
            isMenuTransparent
            navigateTo={handleNavigate}
          />
          <HighlighterBanner
            showInput={false}
            title={dataRef.current.consumer.travel_claim_title}
            breadcrumbsData={dataRef.current.breadcrumb}
            classApply={commonTexts.policyTitle}
            isMotor
            navigateTo={handleNavigate}
          />
          <ClaimContent
            langData={dataRef.current}
            backBtnClickHandler={handleBackButton}
            policies={locationData.policies}
            profileData={locationData.userProfileData}
          />
        </>
      ) : (
        <Navigate to={isAuthenticated ? "/dashboard" : "/"} />
      )}
    </>
  );
};

export default RegisterClaim;
