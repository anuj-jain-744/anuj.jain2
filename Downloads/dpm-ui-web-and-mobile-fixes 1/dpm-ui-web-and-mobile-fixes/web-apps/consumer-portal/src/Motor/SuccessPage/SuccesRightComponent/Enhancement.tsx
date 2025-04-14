import React from "react";

  
  interface EnhancementProps {
    flag?: boolean;
    footerData: any;
    mockData?: {[key: string]: string} | undefined;
  }


const Enhancement:React.FC<EnhancementProps> = ({ flag, footerData , mockData}) => {
    const GooglePlayImage =
        footerData?.blocks?.mobile_slider?.mobile_app_images[1]?.app_image_url;
    const AppStoreImage =
        footerData?.blocks?.mobile_slider?.mobile_app_images[2]?.app_image_url;
    const AppGalleryImage =
        footerData?.blocks?.mobile_slider?.mobile_app_images[3]?.app_image_url;
  
    return (
      <div
        className={`right-card-containerr ${flag ? "background-color-none" : ""}`}
      >
        <div className="right-card-body">
        <div className="header">
            <div className="content-header walaa-medium-500">
                {mockData?.["experience"] ?? ""}
            </div>
            <div className="content walaa-regular-400">
                {mockData?.["download"] ?? ""}
            </div>
        </div>
          <div className="footer">
            <div className="content walaa-medium-500">
                {mockData?.["download-app"] ?? ""}
            </div>
            <div className="footer-images">
              <div className="imgs">
                <div>
                  <img src={GooglePlayImage} alt="Google Play" />
                </div>
                <div>
                  <img src={AppStoreImage} alt="App Store" />
                </div>
                <div>
                  <img src={AppGalleryImage} alt="App Gallery" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Enhancement;