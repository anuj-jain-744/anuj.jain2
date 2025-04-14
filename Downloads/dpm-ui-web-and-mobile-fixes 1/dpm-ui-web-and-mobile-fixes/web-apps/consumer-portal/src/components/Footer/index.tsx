import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./PolicyFooter.module.scss";
import { useApiCall } from "@dpm/shared-module";
import {  FooterData } from "types/languageData";

const PolicyFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData>();

  const { data, makeApiCall } = useApiCall(
    1,
    "footer-menu",
    "get"
  );

  const navigateTo = (url: string) => {
    if (/^(http|https|mailto|tel):/.test(url)) {
      if (url.startsWith("http") || url.startsWith("https") ) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    }
  };

  useEffect(() => {
    makeApiCall();
  }, []); 

  useEffect(() => {
    if (data) {
      setFooterData(data?.blocks);
    }
  }, [data]);

  
  return (
    <div className={`${style.container}`}>
      <div className={style.contents}>
        <div className={style.text}>{footerData?.copyright}</div>
        <div className={style.frame}>
          {footerData?.Privacy?.data?.length > 0 &&
            footerData?.Privacy?.data.map((item: { linkName: string, menuUrl?: string }, index: number) => (
              <button
                className={style.links}
                key={index}
                onClick={() => item?.menuUrl && navigateTo(item?.menuUrl)}
              >
                <span className={style.linksText}>{item.linkName}</span>
              </button>
          ))}         
        </div>
      </div>
    </div>
  );
};

export default PolicyFooter;
