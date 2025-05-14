import React, { useEffect, useState } from "react";
import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { callAPI, getFullUrl, useApiCall } from "@dpm/shared-module";
import { processTransactionId } from "utils/paymentUtils";
import mockData from "./../success.json";
import { useParams } from "react-router-dom";
import DomesticLabourCard from "../DomesticLabour";
import { LanguageData } from "types/languageData";
import Enhancement from "./Enhancement";
import { PRODUCTCODE_HOME, PRODUCTSAPI } from 'constant';
import { CmsPayment, DomesticCardProps } from "components/PaymentOptions/types/cmsPayment";

interface cardProps {
  sidebar_image: string;
  sidebar_image_title: string;
  sidebar_image_desc: string;
  sidebar_image_buttontext: string;
  sidebar_image_link: string;
}

interface TravelAPIResponse {
  config: LanguageData;
}

function SuccesRightComponent({ flag = false, paymentLang }: Readonly<{ flag?: boolean; paymentLang: CmsPayment }>) {
  const { VITE_CONTENT_BASE_URI } = import.meta.env;
  const { transactionid } = useParams<{
    transactionid: string;
  }>();

  const [domesticCardData, setDomesticCardData] = useState<cardProps | null>(null)
  const processData = processTransactionId(transactionid ?? "");
  const [footerData, setFooterData] = useState({});
  const [loading, setLoading] = useState(true);

 const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        endpoint === "header-menu"
          ? responseData?.menus
          : endpoint === "corporate-homepage"
            ? responseData?.data
            : responseData ?? {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchData("footer-menu", setFooterData)]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const [travelData, setTravelData] = useState<LanguageData>();

  const { data, makeApiCall } = useApiCall<TravelAPIResponse, undefined>(
    1,
    "travel-config",
    "get"
  );
  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    if (data) {
      setTravelData(data?.config);
    }
  }, [data]);

  useEffect(() => {
    if(paymentLang) {
      const product =  PRODUCTSAPI[processData.productCode]?.productName;
      const data = paymentLang?.field_successRight?.[processData?.quotationNo ? "quote": "endo"] ?? [];
      const dataCard = data?.find((val: DomesticCardProps) => val.product === product)
      if(dataCard)
        setDomesticCardData({
          sidebar_image: dataCard?.sidebar_image,
          sidebar_image_title: dataCard?.sidebar_image_title,
          sidebar_image_desc: dataCard?.sidebar_image_desc,
          sidebar_image_buttontext: dataCard?.sidebar_image_buttontext,
          sidebar_image_link: dataCard?.sidebar_image_link,
        })
    }
  }, [paymentLang]);

  return (
    <div className="right-card-containers">
      {((flag && processData?.quotationNo) || ( flag && processData?.endrosmentNo && processData?.productCode !== PRODUCTCODE_HOME)) && <DomesticLabourCard data={travelData} domesticCardData={domesticCardData}/>}
      <Enhancement flag={flag} footerData={footerData} mockData={mockData} />
    </div>
  );
}

export default SuccesRightComponent;
