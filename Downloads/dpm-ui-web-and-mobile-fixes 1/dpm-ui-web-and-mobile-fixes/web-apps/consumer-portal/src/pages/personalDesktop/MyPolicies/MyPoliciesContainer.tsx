import React, { useEffect, useState } from "react";
import PoliciesCard from "./PolicyCard/PoliciesCard";
import "./MyPoliciesContainer.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import EnhanceExperience from "../AdsContainer/EnhanceExperience/EnhanceExperience";
import HappyCard from "./PolicyCard/HappyCard/HappyCard";
import TravelCard from "./PolicyCard/TravelCard/TravelCard";
import PersonalDashboardAdd from "../../../components/PersonalDashboardAdd/index";
import ContactCard from "../../../components/HelpSection/ContactCard/ContactCard";
import WalaaOfferings from "../WalaaOfferings/WalaaOfferings";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setShowNotificationResponse } from "@dpm/shared-module";
import MyRequest from "./MyRequest/MyRequest";
import { CarouselImages } from "components/Dashboard/dashboardCarousel";
import AlertPopUp from "./AlertPopUp/AlertPopUp";
import {myProfile, validateDaysToExpiry} from "../../../constant";
import { processPolicies } from "utils/processPolicies";
import { getRemainingDays,isRecentlyExpired,isPolicyExpiredAndAlertable,isExpiringSoon } from "utils/formatDate";
import { deepCopy } from "utils/quoteAndBuy";

const MyPoliciesContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    message: "",
    variant: "",
    buttonName: "",
    navTo: "",
  });
  const cardsToShow = 2;
  const dispatch = useDispatch();

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const policiesDeck = useSelector((state: RootState) => state.policy.policies);
  const listOfPolicies =processPolicies(policiesDeck);

  const getPolicies = () => {
    const happyCard = {
      type: "HappyCard",
      title: languageData?.your_trusted_insurance_company,
      description: "Happy Card Description",
    };

    const newUserCards = [
      {
        type: "TravelCard",
        title: languageData?.planning_an_europe_travel,
        description: languageData?.explore_our_travel_plans,
      },
      {
        type: "HappyCard",
        title: languageData?.your_trusted_insurance_company,
        description: "Happy Card Description",
      },
    ];

    // Add disabled property if endorsementType is Cancellation
    const updatedPolicies = Array.isArray(listOfPolicies)
      ? listOfPolicies.map((policy) => ({
          ...policy,
          disabled: policy?.endorsementType === "Cancellation",
        }))
      : [];

    return updatedPolicies.length > 0
      ? [...updatedPolicies, happyCard]
      : newUserCards;
  };

  const policies = getPolicies();
  const totalItems = Array.isArray(listOfPolicies) && listOfPolicies.length > 0 ? policies.length - 1 : 0;

  const handlePrevClick = () => {
    setCurrentIndex((prev) => Math.max(0, prev - cardsToShow));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => Math.min(totalItems - cardsToShow, prev + cardsToShow));
  };

  
  const renderCards = () => {
    const visibleCards = policies.slice(currentIndex, currentIndex + cardsToShow);
    return visibleCards.map((card, index) => {
      const isDisabled = card.disabled;

      switch (card.type) {
        case "TravelCard":
          return (
            <TravelCard
              key={index}
              title={card.title}
              description={card.description}
              // disabled={isDisabled}
            />
          );
        case "HappyCard":
          return (
            <HappyCard
              key={index}
              title={card.title}
              description={card.description}
              // disabled={isDisabled}
            />
          );
        default:
          return (
            <PoliciesCard
              key={index}
              policy={card}
              navigateTo={undefined}
              disabled={isDisabled}
            />
          );
      }
    });
  };
  
  const fetchPolicyNotification = () => {
    const savedNotification = JSON.parse(sessionStorage.getItem('savedNotification') || '[]');
    const notificationResponse: Array<any> = [];
    listOfPolicies?.forEach((policy: any) => {
      const policyCopy = deepCopy(policy);
      const daysToExpiry = getRemainingDays(policyCopy?.expiryDate ?? "");
      const isAlreadySaved = savedNotification.includes(policyCopy?.policyNo);
      // Validate number
      if (typeof daysToExpiry !== "number" || isNaN(daysToExpiry)) return;
      
      // Case 1: Expiring Soon
      if (isExpiringSoon(daysToExpiry) && !isAlreadySaved) {
        policyCopy["daysToExpiry"] = daysToExpiry;
        notificationResponse.push({ ...policyCopy });
      }
      // Case 2: Recently Expired (no replacement)
      if (isRecentlyExpired(daysToExpiry) && !isAlreadySaved) {
        const hasReplacement = listOfPolicies.some(p =>
          p?.ownerId === policyCopy?.ownerId &&
          p?.productCode === policyCopy?.productCode &&
          p?.policyNo !== policyCopy?.policyNo &&
          getRemainingDays(p?.expiryDate) > 0
        );
        if (!hasReplacement) {
          policyCopy["isExpiredAlert"] = true;
          policyCopy["daysToExpiry"] = Math.abs(daysToExpiry);
          notificationResponse.push({ ...policyCopy });
        }
      }
  });
  dispatch(setShowNotificationResponse(notificationResponse));
};
  useEffect(()=>{
    fetchPolicyNotification();
  },[listOfPolicies])


useEffect(() => {
  // Safely parse sessionStorage data with optional chaining and defaults
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
  const userProfileDetails = userDetails?.userProfileData || {};

  if (Object.keys(userProfileDetails).length !== 0 && !userProfileDetails?.email) {
    setShowAlert(true);
    setAlertMessage({
      title: languageData?.add_your_email_id,
      message: languageData?.please_add_your_email_id,
      variant: "warning",
      buttonName: languageData?.add_your_email_id_to_the_profile,
      navTo: '/' + myProfile.profile
    });
  }
}, []);


  return (
    <div className="dashboard-container">
      <div className="policies-section">
        {
          showAlert && (
            <AlertPopUp
              varaint = {alertMessage.variant}
              title = {alertMessage.title}
              message = {alertMessage.message}
              buttonName={alertMessage.title}
              navTo={alertMessage.navTo}
            />
          )
        }

        <div className="policies-list-container">
          <div className="policies-header">
            <div className="policies-title walaa-medium-500">
              {languageData?.my_policies} ({totalItems})
            </div>
            <div className="scroll-navigation walaa-regular-400">
              <div className="prev-button">
                <ThemeButton
                  icon={true}
                  iconName="ChevronLeft"
                  variant="dashboardSlide"
                  isDisabled={currentIndex === 0 || !listOfPolicies || listOfPolicies?.length === 0}
                  title={""}
                  classes="button-text-medium walaa-medium-500"
                  onClickhandler={handlePrevClick}
                />
              </div>
              <div className="next-button">
                <ThemeButton
                  icon={true}
                  iconName="ChevronRight"
                  variant="dashboardSlide"
                  isDisabled={totalItems - currentIndex === cardsToShow || !listOfPolicies || listOfPolicies?.length === 0}
                  title={""}
                  classes="button-text-medium walaa-medium-500"
                  onClickhandler={handleNextClick}
                />
              </div>
            </div>
          </div>
          <div className="policies-cards-container">
            {renderCards()}
          </div>
        </div>
        <MyRequest />
        <WalaaOfferings />
        <CarouselImages />
      </div>
      <div className="ads-section">
        <ContactCard />
        <PersonalDashboardAdd />
        <EnhanceExperience />
      </div>
    </div>
  );
};

export default MyPoliciesContainer;
