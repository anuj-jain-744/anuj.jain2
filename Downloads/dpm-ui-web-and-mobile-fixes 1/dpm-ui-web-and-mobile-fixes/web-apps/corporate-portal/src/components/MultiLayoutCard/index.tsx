import {
    DownloadFileIcon,
    LeftOrnament,
    RightOrnament,
  } from "../../assets/common";
  import { MultiLayoutCardProps } from "./types";
  
  import "./index.scss";
  
  export const MultiLayoutCard: React.FC<MultiLayoutCardProps> = ({
    label,
    link,
    layout,
    navigateTo,
  }) => {
    return (
      <div className={`${layout} multi-layout-wrapper`}>
        <img src={LeftOrnament} className="top-element" alt="ornament" />
        <div className="card-content d-flex" onClick={() => navigateTo(link)}>
          <img src={DownloadFileIcon} alt="icon" />
          <span className="card-label walaa-medium-500">{label}</span>
        </div>
        <img src={RightOrnament} className="bottom-element" alt="ornament" />
      </div>
    );
  };
  