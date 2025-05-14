import React, { useEffect, useState, useCallback, ChangeEvent, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
  OrgLogo,
  WhiteLogo,
  OrgSearch,
  WhiteSearch,
  OrgClearSearch,
  OrgGlobe,
  WhiteGlobe,
  OrgLogin,
  WhiteLogin,
  Notification,
  NotificationEllipse,
  IconDefaultUserImg
} from "../../assets/Header";
import { IconsSet } from "../../utils/icons";

import { HeaderContent } from "../../content/header";
import MenuDropdownTemplate from "./menuDropdownTemplate";
import { CustomRenderNavDropdown } from "./NavDropdown";
import ContactUsDropdown from "./ContactUsDropdown";
import LanguageSelectDropdown from "./LanguageSelectDropdown";
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

export const LoginButton: React.FC<LoginButtonProps> = React.memo(({
  navbarTransparent,
  iconTheme,
  loginLabel,
  navigateTo
}) => {

  return (
    <>
    <Button
      className="login-selector"
      variant={`outline-secondary login-button ${
        navbarTransparent ? "theme-transparent" : "theme-original"
      }`}
      onClick={()=>navigateTo("/login")}
    >
      <img src={iconTheme.LoginIcon} alt="Login" />
      <span>{loginLabel ? loginLabel : "Login"}</span>
    </Button>
    </>
  );
});

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
}) => {
  const { triggerLogin, setTriggerLogin, currentLanguage }= useCommonContext();
  const [dropdownStates, setDropdownStates] = useState<DropdownStateProps>({
    linkName: "",
    show: false,
    selectedIndex: 0,
  });
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const { shuffle, languageContent } = HeaderContent;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 992);
  const [activeProduct, setActiveProduct] = useState(0);
  const [showDropdown, setShowDropdown] = useState({
    language: false,
    shuffle: false,
    profileMenu: false,
  });
  const { languageData : headerMenuCmsDataDetails }  = useSelector((state: RootState) => state.headerMenuLanguage);
  const {languageData: homeLanguageData} = useSelector((state:RootState) => state?.consumerCmsLanguageData, shallowEqual);
  const homeLangData = homeLanguageData?.config[0];
  const policyData = useSelector((state: RootState) => state.policy);
  const [showNotification, setShowNotification] = useState(false);
  const [isNotification, setIsNotification] = useState(true);
  const [loggedInMenu, setLoggedInMenu] = useState([]);

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

  const getIcon = useCallback((transparentIcon: string, defaultIcon: string) => {
    return (navbarTransparent && !dropdownStates?.show) ? transparentIcon : defaultIcon;
  }, [navbarTransparent, dropdownStates?.show]);

  const iconTheme = useMemo(() => ({
    Logo: getIcon(WhiteLogo, OrgLogo),
    LoginIcon: getIcon(WhiteLogin, OrgLogin),
    GlobeIcon: getIcon(WhiteGlobe, OrgGlobe),
    SearchIcon: getIcon(WhiteSearch, OrgSearch),
    DefaultUserIcon: getIcon(IconDefaultUserImg, IconDefaultUserImg),
  }), [getIcon]);

  const {contactUs, arabicContactUs, englishLabel, arabicLabel, dashboard, user} = commonKeywords;
  const { clearAuthData } = slices.auth;

  const userDetails = sessionStorage.getItem("userDetails");;
  const isUserAuthenticated = userDetails && Object.keys(userDetails).length !== 0 ? true : false;

  if(isUserAuthenticated && Array.isArray(headerMenuCmsDataDetails) && headerMenuCmsDataDetails.length > 0){
    menuItems = (headerMenuCmsDataDetails as { linkName: string }[])?.filter((menu)=>(menu?.linkName === dashboard || menu.linkName === contactUs));
  }


  const categorizedMenuItems: CategorizedMenuItems = {
    menuItem:
      menuItems?.length > 0 &&
      menuItems?.filter((item) => (item.linkName !== contactUs && item.linkName !== arabicContactUs)),
    contactUsMenu:
      menuItems?.length > 0 &&
      menuItems?.filter((item) => (item.linkName === contactUs || item.linkName === arabicContactUs)),
  };

  useEffect(() => {
    if(Array.isArray(headerMenuCmsDataDetails) && headerMenuCmsDataDetails.length > 0){
      setLoggedInMenu((headerMenuCmsDataDetails as [])?.filter((menu)=>(menu.linkName === user))[0]?.childrens);
    }
  },[headerMenuCmsDataDetails]);

  const handleDropdownEvent = useCallback(
    (linkName: string, show: boolean, selectedIndex: number) => {
      setDropdownStates({ linkName, show, selectedIndex });
    },
    []
  );

  const handleSearchIconClick = () => {
    setDisplaySearchBox((prev) => !prev);
  };

  const handleSearchNavigate = () => {
    navigateTo(`/search?search=${searchKey}`);
  };

  const handleNavigate = (navTo:string | undefined) => {
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
        navigateTo(`/`+navTo);
        break;
    }
  }

  const handleDropdownMouseOver = (
    item: ItemEnum,
    show: boolean
  ) => {
    const updatedShowDropdown: { language: boolean; shuffle: boolean; profileMenu:boolean } = {
      language: false,
      shuffle: false,
      profileMenu: false
    };
    updatedShowDropdown[item] = show;
    setShowDropdown(updatedShowDropdown);
    if(window.scrollY < 400 && !isResponsive){
      setNavbarTransparent(!show);
    }
  };

  const [userName, setUserName] = useState<string>('');
  useEffect(() => {
    if(userDetails){
      const userName = JSON.parse(userDetails).userProfileData.name.split(" ")[0];
      setUserName(userName);
    }
  },[]);

  return (
    <React.Fragment>
      <Navbar
        expand="lg"
        className={`fixed-top shared-navbar ${
          (navbarTransparent && !dropdownStates?.show) ? "navbar-transparent" : "navbar-white"
        }`}
        data-testid="header"
      >
        <Container fluid>
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
            />
          ) : (
            <Navbar.Brand>
              <img
                src={iconTheme?.Logo}
                alt="Walaa"
                onClick={() => navigateTo("/")}
              />
            </Navbar.Brand>
          )}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="shared-navbar-collapse"
          >
            {pageName && <TypographyComponent variant="h5" content={pageName} />}
            <Nav className="me-auto">
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
                    navbarTransparent={(navbarTransparent && !dropdownStates?.show)}
                    activeProduct={activeProduct}
                    setActiveProduct={setActiveProduct}
                    navigateTo={navigateTo}
                  />
                ))}
            </Nav>
            <div
              className={`d-flex align-items-center side-tag ${
                isResponsive ? "d-none" : ""
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchNavigate();
                          }
                        }}
                      />
                      <img
                        src={OrgClearSearch}
                        className="close-icon"
                        onClick={handleSearchIconClick}
                        alt="clearIcon"
                      />
                      <Button onClick={handleSearchNavigate}>
                        <img src={WhiteSearch} alt="searchIcon" />
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={iconTheme?.SearchIcon}
                      onClick={handleSearchIconClick}
                      className="search-icon"
                    />
                  )}
                </React.Fragment>
              )}
              {isUserAuthenticated && (
              <div onClick={handleNotificationModel} className="notification">
                <img
                  src={Notification}
                  alt="Notification"
                  className="notification-icon"
                />
                {policyData?.showNotification?.length !== 0 &&
                  <img
                    src={NotificationEllipse}
                    alt="Active-Notification"
                    className="notification-ellipse-icon"
                  />
                }
              </div>
              )}
              {showNotification && (
                <CommonOffCanvas
                  className="custom-offcanvas"
                  setShowCanvas={handleCloseNotification}
                  placement="end"
                  title={languageData?.my_notifications ?? "My Notifications"}
                  showCanvas={showNotification}
                >
                  <NotificationComponent
                    onClose={handleCloseNotification}
                    isNotification={isNotification}
                    languageData = {homeLangData}
                    navigateTo={navigateTo}
                    setShowNotification={setShowNotification}
                  />
                </CommonOffCanvas>
              )}
              <DropdownButton
                title={
                  <span
                    className={`language-selector walaa-regular-400 ${
                      navbarTransparent && !dropdownStates?.show
                        ? "theme-transparent"
                        : "theme-original"
                    }`}
                  >
                    <img src={iconTheme.GlobeIcon} alt="Call" />{currentLanguage === 'ar' ? englishLabel : arabicLabel }
                  </span>
                }
                className="header-option-button language-selector-button"
                onMouseOver={() => handleDropdownMouseOver("language", true)}
                onMouseLeave={() => handleDropdownMouseOver("language", false)}
                show={showDropdown?.language}
                data-testid="language-selector"
              >
                <LanguageSelectDropdown
                  languageContent={languageContent}
                />
              </DropdownButton>
              <ShuffleDropdown
                navbarTransparent={navbarTransparent}
                dropdownStates={dropdownStates}
                handleDropdownMouseOver={handleDropdownMouseOver}
                showDropdown={showDropdown}
              >
                <div className="shuffle-option-wrapper walaa-regular-400">
                  <Dropdown.Item>
                    {Array.isArray(categorizedMenuItems?.contactUsMenu) &&
                    (categorizedMenuItems?.contactUsMenu.length) > 0 &&
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
                align = "end"
                title={
                  <button
                    className={`login-selector walaa-regular-400 ${
                      navbarTransparent && !dropdownStates?.show
                        ? "theme-transparent"
                        : "theme-original"
                    }`}
                  >
                    <img src={iconTheme.DefaultUserIcon} alt="userIcon" />
                    <span> {capitalizeNameFirstLetter(userName)}
                    {!showDropdown?.profileMenu ?  <ExpandMoreIcon /> : <ExpandLessIcon /> }
                    </span>
                  </button>
                }
                className="header-option-button login-selector-button"
                onMouseOver={() => handleDropdownMouseOver("profileMenu", true)}
                onMouseLeave={() => handleDropdownMouseOver("profileMenu", false)}
                show={showDropdown?.profileMenu}
                data-testid="login-selector"
              >
                  <div className="login-option-wrapper walaa-medium-500">
                    <Dropdown.Item
                      className=""
                    >
                      {loggedInMenu && loggedInMenu?.map(({ linkName, attributes }, idx) => (
                          <React.Fragment key={linkName}>
                            <button
                              onClick={() => handleNavigate(attributes?.class?.[0])}
                              onKeyDown={() => handleNavigate(attributes?.class?.[0])}
                              tabIndex={0}
                            >
                              <img src={IconsSet[attributes?.class?.[0]]} alt="shuffle-icon" />
                              {linkName}
                            </button>
                          </React.Fragment>
                        ))
                      }
                    </Dropdown.Item>
                  </div>
              </DropdownButton>
              )}
              {!isUserAuthenticated && (
                <>
                  <LoginButton
                      navbarTransparent={(navbarTransparent && !dropdownStates?.show)}
                      iconTheme={iconTheme}
                      loginLabel={commonLabels?.login_label}
                      navigateTo={() => handleNavigate(commonKeywords.loginRoute)}
                  />
                  {triggerLogin && (
                    <Login
                      showModalStatus={triggerLogin}
                      ShowLoginModalStatus={setTriggerLogin}
                      navigateTo={handleNavigate}
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
            activeMenuDropdown={categorizedMenuItems.menuItem[dropdownStates?.selectedIndex]}
            handleOnMouse={handleDropdownEvent}
            navigateTo={navigateTo}
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
