import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoaderOverlay } from "../../../components";
import { Header } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import CancelPolicyContainer from "@consumer-portal/pages/travel/Policy-services/policyCancellation/CancelPolicyContainer";
import { useCommonContext, generateBreadcrumbs } from "@dpm/shared-module";
import { newFetchData as fetchData } from "@src/utils";
import { navigateTo } from "../../../utils";
import { cmsAPIRoute, commonTexts } from "@src/constants";
interface DataRef {
  consumer: Record<string, string>,
  product: Record<string, string>,
  header: Array<{
    linkName: string,
    childrens?: Array<{
      linkName: string,
      link_content: string,
      attributes: {
        class: string[]
      },
      menuUrl: string
    }>
  }>,
  breadcrumb: Array<{
    label: string,
    route: string
  }>
};

const CancelPolicy: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { currentLanguage } = useCommonContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { productname: productName } = useParams<{ productname: string }>();
  const dataRef = useRef<DataRef>({
    consumer: {},
    product: {},
    header: [],
    breadcrumb: []
  });
  const items = [
    { label: "Dashboard", route: "/Dashboard" },
    { label: "Policy Details", route: "/Motor/Claim/PolicyDashboard" },
    { label: "Cancel Policy", route: "/Home/Claim/Policy-Cancellation" },
  ];

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const [
        { data: { config } },
        { data: { config: productConfig } },
        { data: { menus } }
      ] = await Promise.all([
        fetchData(cmsAPIRoute.consumerHomepage, currentLanguage),
        fetchData(cmsAPIRoute.personal_homeConfig, currentLanguage),
        fetchData(cmsAPIRoute.header, currentLanguage)
      ]);
      dataRef.current.consumer =
        Array.isArray(config) && config[0] instanceof Object ? config[0] : {};
      dataRef.current.product =
        productConfig instanceof Object ? productConfig : {};
      dataRef.current.header = Array.isArray(menus) ? menus : [];
      dataRef.current.breadcrumb = generateBreadcrumbs(
        [
          { label: dataRef.current.consumer.policy_servicing ?? "", route: "/Motor/Claim/PolicyDashboard" },
          { label: dataRef.current.consumer.cancel_policy ?? "", route: "" }
        ],
        currentLanguage
      );
      setLoading(false);
    };
    loadData();
  }, [currentLanguage]);

  const handleNavigate = (url: string) => navigateTo(url, navigate, state);

  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable
        isAuthenticated={false}
        menuItems={dataRef.current.header}
        isMenuTransparent
        navigateTo={handleNavigate}
      />
      <HighlighterBanner
        showInput={false}
        title={dataRef.current.consumer.cancel_policy ?? ""}
        breadcrumbsData={items}
        classApply={commonTexts?.policyTitle}
        isMotor
        navigateTo={handleNavigate}
      />
      <CancelPolicyContainer
        navigateTo={handleNavigate}
        productName={productName}
        langData={dataRef.current}
      />
    </React.Fragment>
  );
};

export default CancelPolicy;
