import React, { useEffect, useState } from "react";
import { callAPI, getFullUrl } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay } from "../../components";
import { navigateTo } from "../../utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import ChangeFromCustomCardToVehSeqNo from "@consumer-portal/Motor/ChangeFromCustomCardToVehSeqNo";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const items = [
  { label: "Dashboard", route: "/" },
  { label: "Policies", route: "/policies" },
  { label: "Change from Custom Card No. to Vehicle Sequence No.", route: "#" },
];

interface ChangeCustCardtoVehSeqProps {
  siteData: {
    data: {
      banner_title: string;
      page_title: string;
      page_desc: string;
      form_desc: string;
      complaint_form_desc: string;
      complaint_note: string;
      address_label: string;
      address: string;
      workschedule_label: string;
      working_days: string;
      working_hours: string;
      callus_label: string;
      phone: string;
      email_label?: string;
      email?: string;
    };
    form_fields: {
      webform_name: string;
      fields: {
        field_name: string;
        field_title: string;
        field_type: string;
        field_required: boolean;
        field_placeholder: string;
        field_options: { [key: string]: string };
        field_validation: {
          [key: string]: {
            [key: string]: string;
          };
        };
      }[];
    }[];
  } | null;
  footerData: any;
  headerData: any;
}

const ChangeCustCardtoVehSeq: React.FC = () => {
  const [data, setData] = useState<ChangeCustCardtoVehSeqProps>({
    siteData: null,
    footerData: {},
    headerData: {},
    postFeedback: {},
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (endpoint: string) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      return endpoint === "header-menu"
        ? responseData?.menus
        : endpoint === "corporate-homepage"
        ? responseData?.data
        : responseData ?? {};
    } catch (ex) {
      console.error(ex);
      return {};
    }
  };

  const fetchAllData = async () => {
    const [siteData, footerData, headerData] = await Promise.all([
      fetchData("post-feedback"),
      fetchData("footer-menu"),
      fetchData("header-menu"),
      fetchData("post-feedback"),
    ]);
    setData({ siteData, footerData, headerData, postFeedback });
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const { headerData, postFeedback } = data;

  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
      <Header
        isSearchEnable={true}
        isAuthenticated={false}
        menuItems={headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
      <HighlighterBanner
        showInput={true}
        breadcrumbsData={items}
        title="Change to Vehicle Sequence No."
        classApply={"policy-title"}
        navigateTo={handleNavigate}
      />
      <ChangeFromCustomCardToVehSeqNo />
    </React.Fragment>
  );
};

export default ChangeCustCardtoVehSeq;
