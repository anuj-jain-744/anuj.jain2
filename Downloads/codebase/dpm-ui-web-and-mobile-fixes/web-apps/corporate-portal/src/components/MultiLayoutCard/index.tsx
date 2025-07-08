import {
    DownloadFileIcon
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
        <div className="card-content d-flex" onClick={() => navigateTo(link)} role="button" tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigateTo(link)
        }
    }}><img src={DownloadFileIcon} alt="icon" />
          <span className="card-label walaa-medium-500">{label}</span>
        </div>
      </div>
    );
  };
