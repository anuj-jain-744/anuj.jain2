import React, { FC, useState, } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import BranchCard from "@corporate-portal/components/BranchCard";
import InfoIcon from "@corporate-portal/assets/contactWalaa/Info_grey.svg";
import StaticSideBarCard from "components/StaticSideBarCard";
import {
  CardComponentProps,
  ContactWalaaProps,
} from "@corporate-portal/pages/ContactWalaa";
import WarnIcon from "assets/Dashboard/Warning Fill.svg";
import MOTOR_MyRequest from "assets/Dashboard/MOTOR_MyRequest.svg";
import circleicon from "assets/IbanValidation/Circle Tick.svg";
import style from "./index.module.scss";
import UserResponse from "./UserResponse";
import WalaaResponse from "./WalaaResponse";
import { BlueFormFooter } from "components/BlueFormFooter";
import { useNavigate } from "react-router-dom";

 export const CardComponent: FC<CardComponentProps> = ({
  title,
  content,
  NodeType,
  contentPropName,
  contentCustomClass = null,
  subTitle = null,
}) => (
  <div className="card-element">
    <BranchCard.Title title={title} />
    {subTitle && <BranchCard.Subtitle subTitle={subTitle} />}
    <NodeType
      {...{ [contentPropName]: content }}
      contentCustomClass={contentCustomClass}
    />
  </div>
);

const MyTicketDetails: React.FC<ContactWalaaProps> = ({ sitedata }) => {
  const [isDisabled, setisDisabled] = useState(true);
  const [checkHeader, setCheckHeader] = useState<string>("warn"); // warn or success
  const navigate = useNavigate();
  const { languageData } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );

  const cardComponents = [
    {
      title: sitedata?.data?.address_label,
      NodeType: BranchCard.Address,
      content: sitedata?.data?.address,
      contentPropName: "address",
    },
    {
      title: sitedata?.data?.workschedule_label,
      NodeType: BranchCard.WorkingHour,
      content: sitedata?.data?.working_hours,
      subTitle: sitedata?.data?.working_days,
      contentPropName: "working_hours",
    },
    {
      title: sitedata?.data?.callus_label,
      NodeType: BranchCard.ContactNo,
      content: sitedata?.data?.phone,
      contentPropName: "phone",
      contentCustomClass: "branch-card-text-light walaa-regular-400",
    },
    sitedata?.data?.email && {
      title: sitedata?.data?.email_label,
      NodeType: BranchCard.Email,
      content: sitedata?.data?.email,
      contentPropName: "email",
      contentCustomClass: "branch-card-text-light walaa-regular-400",
    },
  ].filter(Boolean) as CardComponentProps[];

  const onCheckDisabled = (flag: boolean) => {
    console.log(flag);
    setisDisabled(flag);
  };
  const goToBack = () => {
    navigate(-1);
  };
  const mockResponse = {
    complaint: "1234567",
    status: "Open",
    conversation: [
      {
        user: "self",
        name: "Javed",
        message: `Despite Multiple Customer care calls, I could not find the policy
            Details updates as per new endorsements done on 24/2/25. Please
            Check attached screenshot for payment verification.`,
        dateTime: "26/2/25  |  11:34 AM",
      },
      {
        user: "walaa",
        name: "Walaa Response",
        message: `Despite Multiple Customer care calls, I could not find the policy
              Details updates as per new endorsements done on 24/2/25. Please
              Check attached screenshot for payment verification.`,
        dateTime: "26/2/25  |  11:34 AM",
      },
    ],
  };

  return (
    <div className={style.contactWrapperBoxOuter}>
      <div className={style.contactHeader}>
      <h2>You are just a step away from reaching us.</h2>
      <p>How can we assist you today? </p>
      </div>
     
      <div className={style.ticketBodyWrapper}>
        <div className={style.ticketBody}>
          <div
            className={
              checkHeader === "warn"
                ? style.ticketHeaderWarn
                : style.ticketHeaderSuccess
            }
          >
            <div className={style.imageWrapper}>
              <img src={MOTOR_MyRequest} />
            </div>
            <div className={style.ticketComplaint}>
              <p className={style.ticketKey}>{languageData?.complaint}</p>
              <span>
                <p className={style.ticketValue}>{mockResponse.complaint}</p>
              </span>
            </div>
            <div className={style.ticketStatus}>
              <p className={style.ticketKey}>{languageData?.status}</p>
              <span className={style.iconWrapper}>
                <img src={checkHeader === "warn" ? WarnIcon : circleicon} />
                <p className={style.ticketValue}>{mockResponse.status}</p>
              </span>
            </div>
          </div>
          <div className={style.ticketContainer}>
            {mockResponse.conversation.map((item) =>
              item.user == "self" ? (
                <UserResponse conversation={item} languageData={languageData} />
              ) : (
                <WalaaResponse
                  conversation={item}
                  languageData={languageData}
                  onCheckDisabled={onCheckDisabled}
                />
              )
            )}

            <div className={style.contentFooter}>
              <div className={style.blank}></div>
              <div className={style.footerInfo}>
                <img src={InfoIcon} alt="info" />
                <p>
                  {`${languageData?.kindly_check_our} `}{" "}
                  <span className={style.faqLink}>
                    {" "}
                    {`${languageData?.faq}`}{" "}
                  </span>{" "}
                  {`${languageData?.for_more_info}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={style.contactBranch}>
          <BranchCard theme="custom-card">
            {cardComponents.map(
              (
                {
                  title,
                  content,
                  NodeType,
                  contentPropName,
                  contentCustomClass = null,
                  subTitle = null,
                },
                index
              ) => (
                <CardComponent
                  key={index}
                  title={title}
                  content={content}
                  NodeType={NodeType}
                  contentPropName={contentPropName}
                  contentCustomClass={contentCustomClass}
                  subTitle={subTitle}
                />
              )
            )}
          </BranchCard>
          <StaticSideBarCard sidebarImage={sitedata?.data?.sidebar_images} />
        </div>
      </div>

      <BlueFormFooter
        isDisabled={isDisabled}
        backBtnClickHandler={goToBack}
        submitClickHandler={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default MyTicketDetails;
