import React, {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  useMemo,
} from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  useCommonContext,
  RootState,
  clearSessionStorage,
  capitalizeNameFirstLetter,
  slices,
} from "@dpm/shared-module";
import "./index.scss";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";

import {
  WhiteLogo,
  WhiteSearch,
  OrgClearSearch,
  WhiteGlobe,
  OrgLogin,
  WhiteLogin,
  Notification,
  NotificationEllipse,
  IconDefaultUserImg,
  BlueLogo,
  BlueSearch,
  BlueGlobe,
  BlueNotification,
} from "../../assets/Header";
import { IconsSet } from "../../utils/icons";

import { HeaderContent } from "../../content/header";
import MenuDropdownTemplate from "./menuDropdownTemplate";
import { CustomRenderNavDropdown } from "./NavDropdown";
import ContactUsDropdown from "./ContactUsDropdown";
import { ResponsiveCustomFold, ResponsiveHeader } from "./ResponsiveView";
import CommonOffCanvas from "./../CommonOffCanvas";
import { Login } from "../Login";

import {
  LoginButtonProps,
  HeaderProps,
  DropdownStateProps,
  CategorizedMenuItems,
} from "./types/index.types";
import ShuffleDropdown from "./supportDropdown";
import { commonKeywords } from "../../constant";
import NotificationComponent from "./../Notification";
import { ItemEnum } from "./types/common.types";
import TypographyComponent from "components/Typography";
import { HiddenButtonWrapper } from "components/HiddenButtonWrapper";

export const LoginButton: React.FC<LoginButtonProps> = React.memo(
  ({ navbarTransparent, iconTheme, loginLabel, navigateTo }) => {
    return (
      <Button
        className="login-selector"
        variant={`outline-secondary login-button ${
          navbarTransparent ? "theme-transparent" : "theme-original"
        }`}
        onClick={() => navigateTo("/login")}
      >
        <img src={iconTheme.LoginIcon} alt="Login" />
        <span>{loginLabel ? loginLabel : "Login"}</span>
      </Button>
    );
  }
);

export const Header: React.FC<HeaderProps> = ({
  isSearchEnable,
  isAuthenticated,
  menuItems,
  menuItemsLogin = [],
  isMenuTransparent,
  navigateTo,
  loginData,
  languageData = {},
  commonLabels,
  pageName,
  mobile_app_images = [],
}) => {
  const { triggerLogin, setTriggerLogin, currentLanguage, changeLanguage } =
    useCommonContext();
  const [dropdownStates, setDropdownStates] = useState<DropdownStateProps>({
    linkName: "",
    show: false,
    selectedIndex: 0,
  });
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const { shuffle, languageContent } = HeaderContent;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 1200);
  const [activeProduct, setActiveProduct] = useState(0);
  const [showDropdown, setShowDropdown] = useState({
    language: false,
    shuffle: false,
    profileMenu: false,
  });
  const { languageData: headerMenuCmsDataDetails } = useSelector(
    (state: RootState) => state.headerMenuLanguage
  );
  const { languageData: homeLanguageData } = useSelector(
    (state: RootState) => state?.consumerCmsLanguageData,
    shallowEqual
  );
  const homeLangData = homeLanguageData?.config[0];
  const policyData = useSelector((state: RootState) => state.policy);
  const [showNotification, setShowNotification] = useState(false);
  const [isNotification, setIsNotification] = useState(true);
  const [loggedInMenu, setLoggedInMenu] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();

  const handleScroll = () => {
    if (window.scrollY > 400 && !isResponsive) {
      setNavbarTransparent(false);
    } else {
      setNavbarTransparent(true);
    }
  };

  const handleNotificationModel = () => {
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const updateNavbarTransparency = () => {
    setNavbarTransparent(isMenuTransparent);
  };

  useEffect(() => {
    updateNavbarTransparency();
  }, [isMenuTransparent]);

  useEffect(() => {
    if (isMenuTransparent) {
      if (!isResponsive) {
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      } else {
        setNavbarTransparent(false);
      }
    }
  }, [isResponsive, isMenuTransparent]);

  const getIcon = useCallback(
    (transparentIcon: string, defaultIcon: string) => {
      return navbarTransparent && !dropdownStates?.show
        ? transparentIcon
        : defaultIcon;
    },
    [navbarTransparent, dropdownStates?.show]
  );

  const iconTheme = useMemo(() => {
    const isBlueState = dropdownStates?.show || !navbarTransparent;
    return {
      Logo: isBlueState ? BlueLogo : WhiteLogo,
      LoginIcon: isBlueState ? OrgLogin : WhiteLogin,
      GlobeIcon: isBlueState ? BlueGlobe : WhiteGlobe,
      SearchIcon: isBlueState ? BlueSearch : WhiteSearch,
      DefaultUserIcon: IconDefaultUserImg,
    };
  }, [navbarTransparent, dropdownStates?.show]);

  const {
    contactUs,
    arabicContactUs,
    englishLabel,
    arabicLabel,
    dashboard,
    user,
    policyServicing,
  } = commonKeywords;
  const { clearAuthData } = slices.auth;

  const userDetails = sessionStorage.getItem("userDetails");
  const isUserAuthenticated =
    userDetails && Object.keys(userDetails).length !== 0 ? true : false;

  if (
    isUserAuthenticated &&
    Array.isArray(headerMenuCmsDataDetails) &&
    headerMenuCmsDataDetails.length > 0
  ) {
    menuItems = (headerMenuCmsDataDetails as { linkName: string }[])?.filter(
      (menu) => menu?.linkName !== user
    );
  }

  const categorizedMenuItems: CategorizedMenuItems = {
    menuItem:
      menuItems?.length > 0 &&
      menuItems?.filter(
        (item) =>
          item.linkName !== contactUs && item.linkName !== arabicContactUs
      ),
    contactUsMenu:
      menuItems?.length > 0 &&
      menuItems?.filter(
        (item) =>
          item.linkName === contactUs || item.linkName === arabicContactUs
      ),
  };

  useEffect(() => {
    if (
      Array.isArray(headerMenuCmsDataDetails) &&
      headerMenuCmsDataDetails.length > 0
    ) {
      setLoggedInMenu(
        (headerMenuCmsDataDetails as [])?.filter(
          (menu) => menu.linkName === user
        )[0]?.childrens
      );
    }
  }, [headerMenuCmsDataDetails]);

  const handleDropdownEvent = useCallback(
    (linkName: string, show: boolean, selectedIndex: number) => {
      setDropdownStates({ linkName, show, selectedIndex });
    },
    []
  );

  const handleSearchIconClick = () => {
    setDisplaySearchBox((prev) => !prev);
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchIconClick();
    }
  };

  const handleSearchNavigate = () => {
    navigateTo(`/search?search=${searchKey}`);
  };

  const handleNavigate = (navTo: string | undefined) => {
    switch (navTo) {
      //Trigger Login when route equals /login
      case commonKeywords.loginRoute:
        setTriggerLogin(true);
        break;
      //Trigger on click on logout and clear the session and localstorage
      case commonKeywords.logoutRoute:
        clearSessionStorage();
        dispatch(clearAuthData());
        navigateTo(`/`);
        break;
      case commonKeywords.preferences: //Need to remove the case once Preference page is implemented.
        break;
      default:
        //Navigate to Sthe given url
        navigateTo(`/` + navTo);
        break;
    }
  };

  const handleDropdownMouseOver = (item: ItemEnum, show: boolean) => {
    const updatedShowDropdown: {
      language: boolean;
      shuffle: boolean;
      profileMenu: boolean;
    } = {
      language: false,
      shuffle: false,
      profileMenu: false,
    };
    updatedShowDropdown[item] = show;
    setShowDropdown(updatedShowDropdown);
    if (window.scrollY < 400 && !isResponsive) {
      setNavbarTransparent(!show);
    }
  };

  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    if (userDetails) {
      const userName =
        JSON.parse(userDetails).userProfileData?.name?.split(" ")[0];
      setUserName(userName);
    }
  }, []);

  const onChangeLanguage = () => {
    const language = languageContent?.find((lng) => lng.key != currentLanguage);
    changeLanguage(language?.key);
  };

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
    };
    handleResize();
  }, []);

  return (
    <React.Fragment>
      <Navbar
        expand="lg"
        className={`fixed-top shared-navbar ${
          navbarTransparent && !dropdownStates?.show ? "navbar-transparent" : ""
        }`}
        data-testid="header"
      >
        <Container
          fluid
          className={`container-fluid ${
            dropdownStates?.show || !navbarTransparent
              ? "navbar-background"
              : ""
          }`}
        >
          {isResponsive ? (
            <ResponsiveHeader
              isAuthenticated={isAuthenticated}
              iconTheme={iconTheme}
              navigateTo={navigateTo}
              navbarTransparent={navbarTransparent}
              shuffle={shuffle}
              currentImageIndex={currentImageIndex}
              categorizedMenuItems={categorizedMenuItems}
              commonLabels={commonLabels}
              isMobile={isMobile}
            />
          ) : (
            <Navbar.Brand>
              <HiddenButtonWrapper onClick={() => navigateTo("/")}>
                <img src={iconTheme?.Logo} alt="Walaa" />
              </HiddenButtonWrapper>
            </Navbar.Brand>
          )}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="shared-navbar-collapse"
          >
            {pageName && (
              <TypographyComponent variant="h5" content={pageName} />
            )}
            <Nav className="header-menu-gap me-auto">
              {isResponsive && (
                <ResponsiveCustomFold
                  languageContent={languageContent}
                  setSelectedLanguage={setSelectedLanguage}
                  selectedLanguage={selectedLanguage}
                />
              )}
              {categorizedMenuItems?.menuItem &&
                categorizedMenuItems?.menuItem?.map((parent, pIdx) => (
                  <CustomRenderNavDropdown
                    key={pIdx}
                    parent={parent}
                    pIdx={pIdx}
                    dropdownStates={dropdownStates}
                    handleDropdownEvent={handleDropdownEvent}
                    navbarTransparent={
                      navbarTransparent && !dropdownStates?.show
                    }
                    activeProduct={activeProduct}
                    setActiveProduct={setActiveProduct}
                    navigateTo={navigateTo}
                  />
                ))}
            </Nav>
            <div
              className={`d-flex align-items-center side-tag ${
                isResponsive ? "d-none" : "gap-3"
              }`}
            >
              {isSearchEnable && (
                <React.Fragment>
                  <div data-testid="search-wrapper"></div>
                  {displaySearchBox ? (
                    <div className="search-input-container">
                      <Form.Control
                        type="text"
                        placeholder={commonLabels?.search_label}
                        className="search-input"
                        value={searchKey}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSearchKey(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearchNavigate();
                          }
                        }}
                      />
                      <img
                        src={OrgClearSearch}
                        className="close-icon"
                        onClick={() => {
                          setSearchKey("");
                          handleSearchIconClick();
                        }}
                        alt="clearIcon"
                      />
                      <Button onClick={handleSearchNavigate}>
                        <img src={WhiteSearch} alt="searchIcon" />
                      </Button>
                    </div>
                  ) : (
                    <HiddenButtonWrapper
                      onClick={handleSearchIconClick}
                      onKeyDown={handleSearchKeyDown}
                      tabIndex={0}
                    >
                      <img
                        src={iconTheme?.SearchIcon}
                        className="search-icon"
                        alt="search-icon"
                      />
                    </HiddenButtonWrapper>
                  )}
                </React.Fragment>
              )}
              {isUserAuthenticated && (
                <HiddenButtonWrapper onClick={handleNotificationModel}>
                  <div className="notification p-2">
                    <img
                      src={
                        dropdownStates?.show ? BlueNotification : Notification
                      }
                      alt="Notification"
                      className="notification-icon"
                    />
                    {policyData?.showNotification?.length !== 0 && (
                      <img
                        src={NotificationEllipse}
                        alt="Active-Notification"
                        className="notification-ellipse-icon"
                      />
                    )}
                  </div>
                </HiddenButtonWrapper>
              )}
              {showNotification && (
                <CommonOffCanvas
                  className="custom-offcanvas"
                  setShowCanvas={handleCloseNotification}
                  placement="end"
                  title={languageData?.my_notifications ?? "My Notifications"}
                  showCanvas={showNotification}
                >
                  {isNotification && (
                    <NotificationComponent
                      languageData={homeLangData}
                      setShowNotification={setShowNotification}
                    />
                  )}
                </CommonOffCanvas>
              )}
              <DropdownButton
                title={
                  <span
                    className={`language-selector walaa-regular-400 ${
                      navbarTransparent && !dropdownStates?.show
                        ? "theme-transparent"
                        : "lang-selector-color"
                    }`}
                  >
                    <img src={iconTheme.GlobeIcon} alt="Call" />
                    {currentLanguage === "ar" ? englishLabel : arabicLabel}
                  </span>
                }
                className="header-option-button language-selector-button"
                show={showDropdown?.language}
                data-testid="language-selector"
                onClick={onChangeLanguage}
                children={undefined}
              ></DropdownButton>
              <ShuffleDropdown
                navbarTransparent={navbarTransparent}
                dropdownStates={dropdownStates}
                handleDropdownMouseOver={handleDropdownMouseOver}
                showDropdown={showDropdown}
              >
                <div className="shuffle-option-wrapper walaa-regular-400">
                  <Dropdown.Item>
                    {Array.isArray(categorizedMenuItems?.contactUsMenu) &&
                      categorizedMenuItems?.contactUsMenu.length > 0 &&
                      categorizedMenuItems?.contactUsMenu[0]?.childrens?.map(
                        (
                          { linkName, link_content, attributes, menuUrl },
                          idx
                        ) => (
                          <React.Fragment key={idx}>
                            <ContactUsDropdown
                              attributes={attributes}
                              link_content={link_content}
                              idx={idx}
                              menuUrl={menuUrl}
                              linkName={linkName}
                              navigateTo={navigateTo}
                            />
                          </React.Fragment>
                        )
                      )}
                  </Dropdown.Item>
                </div>
              </ShuffleDropdown>
              {isUserAuthenticated && (
                <DropdownButton
                  align="end"
                  title={
                    <button
                      className={`login-selector arr-specific walaa-regular-400 ${
                        navbarTransparent && !dropdownStates?.show
                          ? "theme-transparent"
                          : "theme-original"
                      }`}
                    >
                      <img src={iconTheme.DefaultUserIcon} alt="userIcon" />
                      <span>
                        {" "}
                        {capitalizeNameFirstLetter(userName)}
                        {!showDropdown?.profileMenu ? (
                          <ExpandMoreIcon />
                        ) : (
                          <ExpandLessIcon />
                        )}
                      </span>
                    </button>
                  }
                  className="login-down-arrrow header-option-button login-selector-button"
                  onMouseLeave={() =>
                    handleDropdownMouseOver("profileMenu", false)
                  }
                  show={showDropdown?.profileMenu}
                  data-testid="login-selector"
                  onClick={() => handleDropdownMouseOver("profileMenu", true)}
                >
                  <div className="login-option-wrapper walaa-medium-500">
                    <Dropdown.Item className="">
                      {loggedInMenu &&
                        loggedInMenu?.map(
                          (
                            {
                              linkName,
                              attributes,
                            }: {
                              linkName: string;
                              attributes: { class?: string[] };
                            },
                            idx
                          ) => (
                            <React.Fragment key={linkName}>
                              <button
                                onClick={() =>
                                  handleNavigate(attributes?.class?.[0])
                                }
                                onKeyDown={() =>
                                  handleNavigate(attributes?.class?.[0])
                                }
                                tabIndex={0}
                              >
                                <img
                                  src={
                                    IconsSet[
                                      attributes?.class?.[0] || "default"
                                    ]
                                  }
                                  alt="shuffle-icon"
                                />
                                {linkName}
                              </button>
                            </React.Fragment>
                          )
                        )}
                    </Dropdown.Item>
                  </div>
                </DropdownButton>
              )}
              {!isUserAuthenticated && (
                <>
                  {commonLabels?.login_label && (
                    <LoginButton
                      navbarTransparent={
                        navbarTransparent && !dropdownStates?.show
                      }
                      iconTheme={iconTheme}
                      loginLabel={commonLabels?.login_label}
                      navigateTo={() =>
                        handleNavigate(commonKeywords.loginRoute)
                      }
                    />
                  )}
                  {triggerLogin && (
                    <Login
                      showModalStatus={triggerLogin}
                      ShowLoginModalStatus={setTriggerLogin}
                      navigateTo={handleNavigate}
                      mobile_app_images={mobile_app_images}
                    />
                  )}
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container
        fluid
        className={`${
          dropdownStates?.show ? "active" : ""
        } menu-dropdown-container`}
      >
        {!isResponsive && dropdownStates?.show && (
          <MenuDropdownTemplate
            activeNavItem={dropdownStates}
            // @ts-ignore
            activeMenuDropdown={
              categorizedMenuItems.menuItem &&
              categorizedMenuItems.menuItem[dropdownStates?.selectedIndex]
            }
            handleOnMouse={handleDropdownEvent}
            navigateTo={navigateTo}
            isUserAuthenticated={isUserAuthenticated}
          />
        )}
      </Container>
      {(dropdownStates?.show ||
        Object.values(showDropdown).some((value) => value === true)) && (
        <div className="overlay"></div>
      )}
    </React.Fragment>
  );
};
