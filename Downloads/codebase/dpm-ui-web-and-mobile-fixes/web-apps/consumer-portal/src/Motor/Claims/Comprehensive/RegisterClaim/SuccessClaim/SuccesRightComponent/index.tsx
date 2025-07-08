import React, { useEffect, useState } from "react";
import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { callAPI, getFullUrl } from "@dpm/shared-module";
import { Card } from "react-bootstrap";
import mockData from "./../success.json";
import { VITE_CONTENT_BASE_URI } from "constant";
import { getResponseBasedOnEndpoints } from "@app-shell/utils";

function SuccesRightComponent() {
  const [footerData, setFooterData] = useState({});

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        getResponseBasedOnEndpoints(responseData, endpoint) ||
        responseData ||
        {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchData("footer-menu", setFooterData)]);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const GooglePlayImage =
    footerData?.blocks?.mobile_slider?.mobile_app_images[1]?.app_image_url;
  const AppStoreImage =
    footerData?.blocks?.mobile_slider?.mobile_app_images[2]?.app_image_url;
  const AppGalleryImage =
    footerData?.blocks?.mobile_slider?.mobile_app_images[3]?.app_image_url;

  return (
    <Card className="right-card-container">
      <div className="right-card-body">
        <div className="header">
          <div className="content-header walaa-medium-500">
            {mockData["experience"]}
          </div>
          <div className="content walaa-regular-400">
            {mockData["download"]}
          </div>
        </div>
        <div className="footer">
          <div className="content walaa-medium-500">
            {mockData["download-app"]}
          </div>
          <div className="footer-images">
            <div className="imgs">
              <div>
                <img src={GooglePlayImage} alt={mockData["Google-Play"]} />
              </div>
              <div>
                <img src={AppStoreImage} alt={mockData["App-Store"]} />
              </div>
              <div>
                <img src={AppGalleryImage} alt={mockData["App-Gallery"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SuccesRightComponent;
