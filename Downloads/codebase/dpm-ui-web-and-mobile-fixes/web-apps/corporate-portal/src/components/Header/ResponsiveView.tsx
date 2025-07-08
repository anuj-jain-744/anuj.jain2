import React, { forwardRef, useState, ChangeEvent } from "react";
import {
  Navbar,
  Dropdown,
  DropdownButton,
  Form,
  Button,
} from "react-bootstrap";
import { LoginButton } from "./index";
import { ResponsiveFoldLogo, TabLogo, MobileLogo } from "../../assets/Header";
import LanguageSelectDropdown from "./LanguageSelectDropdown";
import ContactUsDropdown from "./ContactUsDropdown";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { WhiteSearch, LatestHamburger } from "../../assets/Header";

interface ResponsiveHeaderProps {
  isAuthenticated: boolean;
  iconTheme: {
    LoginIcon: string;
    SearchIcon: string;
  };
  navigateTo: (url: string) => void;
  navbarTransparent: boolean;
  shuffle: {
    white: string[];
    org: string[];
  };
  commonLabels?: {
    [key: string]: string;
  };
  currentImageIndex: number;
  categorizedMenuItems: {
    menuItem:
      | false
      | {
          linkName: string;
          childrens?: Array<any>;
        }[];
    contactUsMenu:
      | false
      | {
          linkName: string;
          childrens?: {
            linkName: string;
            link_content: string;
            attributes: {
              class: string[];
            };
            menuUrl: string;
          }[];
        }[];
  };
  isMobile?:boolean;
}

interface CustomToggleProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export const CustomToggle = forwardRef<HTMLDivElement, CustomToggleProps>(
  ({ onClick }, ref) => {
    const [isToggled, setIsToggled] = useState(false);
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsToggled((prev) => !prev);
      if (onClick) onClick(e);
    };

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={`custom-toggle ${isToggled ? "toggled" : ""}`}
        aria-controls="basic-navbar-nav"
        data-testid="custom-toggle"
        role="button" tabIndex={0} onKeyDown={(e) => {
          if (e.key === 'Enter') {
              e.preventDefault();
              handleClick();
          }
      }}
      >
        <img src={LatestHamburger} className="icon open" alt="hamburger" />
        <CloseIcon className="icon close" />
        <div className="navbar-overlay"></div>
      </div>
    );
  }
);

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  isAuthenticated,
  iconTheme,
  navigateTo,
  navbarTransparent,
  shuffle,
  currentImageIndex,
  categorizedMenuItems,
  commonLabels,
  isMobile,
}) => {
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");

  const handleSearchIconClick = () => {
    setDisplaySearchBox((prev) => !prev);
  };
  const handleSearchNavigate = () => {
    navigateTo(`/search?search=${searchKey}`);
  };

  return (
    <div className="responsive-header">
      <div className="navbar-left-wrapper">
        <Navbar.Toggle as={CustomToggle} />
        <Navbar.Brand>
          <img
           src={isMobile? MobileLogo: TabLogo}
            alt="Walaa"
            onClick={() => navigateTo("/")}
          />
        </Navbar.Brand>
      </div>



      <div className="navbar-right-wrapper">
      <div className="searchIcon-resp">
        <React.Fragment>
          <div data-testid="search-wrapper"></div>
          {displaySearchBox ? (
            <div className="search-resp-container">
              <ArrowBackIcon
                className="back-icon"
                onClick={handleSearchIconClick}
              />
              <Button onClick={handleSearchNavigate}>
                <img src={WhiteSearch} alt="searchIcon" />
              </Button>
              <Form.Control
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchKey}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchKey(e.target.value)
                }
              />
              <MicNoneIcon className="mic-icon" />
            </div>
          ) : (
            <img
              src={iconTheme?.SearchIcon}
              onClick={handleSearchIconClick}
              className="search-icon"
            />
          )}
        </React.Fragment>

      </div>
        <DropdownButton
          title={
            <span className="shuffle-item">
              <img src={shuffle?.org[currentImageIndex]} alt="shuffle-image" />
            </span>
          }
          className="shuffle-selector-button"
        >
          <div className="shuffle-option-wrapper walaa-regular-400">
            <Dropdown.Item>
              {categorizedMenuItems?.contactUsMenu &&
                categorizedMenuItems?.contactUsMenu[0]?.childrens?.map(
                  ({ linkName, link_content, attributes, menuUrl }, idx) => (
                    <ContactUsDropdown
                      key={idx}
                      attributes={attributes}
                      link_content={link_content}
                      idx={idx}
                      menuUrl={menuUrl}
                      linkName={linkName}
                      navigateTo={navigateTo}
                    />
                  )
                )}
            </Dropdown.Item>
          </div>
        </DropdownButton>
        {!isAuthenticated && (
          <LoginButton
            navbarTransparent={navbarTransparent}
            iconTheme={iconTheme}
            loginLabel={commonLabels?.login_label}
            navigateTo={navigateTo}
          />
        )}
      </div>
    </div>
  );
};

interface ResponsiveCustomFoldProps {
  languageContent: any;
  setSelectedLanguage: (language: string) => void;
  selectedLanguage: string;
}

export const ResponsiveCustomFold: React.FC<ResponsiveCustomFoldProps> = ({
  languageContent,
  setSelectedLanguage,
  selectedLanguage,
}) => {
  return (
    <div className="responsive-custom-fold">
      <div className="fold-top-section">
        <img
          src={ResponsiveFoldLogo}
          alt="Walaa Logo"
          className="responsive-fold-logo"
        />
      </div>
      <LanguageSelectDropdown
        languageContent={languageContent}
      />
    </div>
  );
};
