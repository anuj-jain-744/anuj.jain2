import SearchInput from "../SearchInput";
import BannerVeriation from "../../assets/HighlighterBanner/Vector.svg";
// import BannerVeriation from "../../assets/HighlighterBanner/bannerVeriation.png";
import "./index.scss";
import { Breadcrumbs } from "../Breadcrumbs";
import { placeholders } from "../SearchInfoByKeyword";

interface Item {
  label: string;
  route: string;
}

interface HighlighterBannerProps {
  showInput: boolean;
  searchInput?: string;
  placeholders?: placeholders | null;
  setSearchInput?: (e: string) => void;
  frequentlySearch?: string[];
  otherSearch?: string[];
  handleSearchResult?: (val:string) => void;
  title?: string;
  submitButtonName?: string;
  breadcrumbsData?: Item[];
  navigateTo?: (url: string) => void;
  defaultPage?: boolean;
  classApply?: string;
  isMotor?: boolean;
  hideBanner?: boolean;
}

const HighlighterBanner = ({
  showInput,
  searchInput,
  setSearchInput,
  placeholders,
  frequentlySearch,
  otherSearch,
  title,
  handleSearchResult,
  submitButtonName,
  breadcrumbsData,
  navigateTo,
  defaultPage = true,
  classApply,
  isMotor,
  hideBanner,
}: HighlighterBannerProps) => {

  return (
    <div className={`${hideBanner ? "container-spacing" : ""} content-container`}>
      <img
        src={BannerVeriation}
        data-testid={`bannerVeriation`}
        className={`banner-graphic ${
          isMotor ? "" : showInput ? (hideBanner ? "image-input-height banner-title" : "image-input-height") : "image-title-height"
        } ${isMotor ? "motor-banner" : ""}`}
      />
      <div className={`content-container-padding ${isMotor ? 'is-motor' : ''}`}>
        {breadcrumbsData && (
          <Breadcrumbs items={breadcrumbsData} navigateTo={navigateTo} isMotor={isMotor}/>
        )}
        {title && title !== "" && (
          <h1 data-testid="bannerTitle" className={`walaa-medium-500 bannerTitle ${classApply ? (hideBanner ? `${classApply} title-paddding` : classApply) : "content-header"} ${isMotor ? 'policy-title' : ''}`}>{title}</h1>
        )}
        {showInput &&
          searchInput !== undefined &&
          setSearchInput &&
          placeholders &&
          handleSearchResult && (
            <SearchInput
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              placeholders={placeholders}
              otherSearch={otherSearch}
              frequentlySearch={frequentlySearch}
              handleSearchResult={handleSearchResult}
              submitButtonName={submitButtonName}
              navigateTo={navigateTo}
              defaultPage={defaultPage}
            />
          )}
      </div>
    </div>
  );
};

export default HighlighterBanner;
