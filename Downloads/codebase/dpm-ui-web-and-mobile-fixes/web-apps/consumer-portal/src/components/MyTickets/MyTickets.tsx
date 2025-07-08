import React from "react";
import style from "./MyTickets.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@dpm/shared-module";
import Right from "assets/Dashboard/Arrow_Right.svg";
import Warning from "assets/Dashboard/Warning Fill.svg";
import MOTOR_MyRequest from "assets/Dashboard/MOTOR_MyRequest.svg";
import TicketNotes from "assets/Dashboard/TicketNotes.svg";
import TicketTickmark from "assets/Dashboard/TicketTickmark.svg";
import { CardComponent } from "./TicketDetails/TicketDetails";
import BranchCard from "@corporate-portal/components/BranchCard";
import {
  CardComponentProps,
  ContactWalaaProps,
} from "@corporate-portal/pages/ContactWalaa";

const MyTickets: React.FC<ContactWalaaProps> = ({ sitedata }) => {
  const navigate = useNavigate();
  const { languageData } = useSelector(
    (state: RootState) => state.dashbaordLanguageData
  );

  const handleNavigate = (path: string) => {
    navigate(path);
  };
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

  return (
    <div className={style.contactWrapperBoxOuter}>
      <div className={style.contactWrapperBox}>
        <div className={style.myTickets}>
          <div className={style.myTicketsHeader}>
            <div className={style.myTicketsHeaderInner}>
              <span className={style.myTicketsHeaderText}>
                {languageData?.mytickets}
              </span>
              <div className={style.updatedDateOuter}>
                <div className={style.updatedDateText}>
                  {languageData?.last_updated_on}:
                </div>
                <div className={style.updatedDate}></div>
              </div>
            </div>
            <span className={style.horizontalLine}></span>
          </div>
          <div className={style.tabs}>
            <div className={style.allButton}>
              <div className={style.allLabel}>
                <span className={style.allText}>{languageData?.all}</span>
              </div>
            </div>
            <div className={style.enquiryButton}>
              <div className={style.enquiryLabel}>
                <span className={style.enquiryText}>
                  {languageData?.enquiry}
                </span>
              </div>
            </div>
            <div className={style.complaintsButton}>
              <div className={style.complaintsLabel}>
                <span className={style.complaintsText}>
                  {languageData?.complaints}
                </span>
              </div>
            </div>
          </div>
          <div className={style.cardsHolder}>
            <div className={style.card}>
              <div className={style.iconOuter}>
                <div className={style.iconInner}>
                  <div className={style.icon}>
                    <img src={MOTOR_MyRequest} alt="MotorLogo" />
                  </div>
                </div>
              </div>
              <div className={style.cardDetails}>
                <div className={style.cardType}>
                  <div className={style.cardLabel}>
                    <div className={style.cardLabelText}>
                      {languageData?.complaint}
                    </div>
                  </div>
                  <div className={style.cardLabelValue}>
                    <div className={style.cardLabelValueText}></div>
                  </div>
                </div>
                <div className={style.cardStatus}>
                  <div className={style.cardStatusText}>
                    {languageData?.status}
                  </div>
                  <div className={style.cardStatusIconValue}>
                    <div className={style.cardStatusIcon}>
                      <img src={Warning} alt="Warning" />
                    </div>
                    <div className={style.cardStatusValue}></div>
                  </div>
                </div>
                <div className={style.cardNavigation}>
                  <div className={style.link}>
                    <div className={style.linkTextOuter}>
                      <div className={style.linkTextInner}>
                        <div
                          className={style.linkText}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleNavigate("/Ticket-details")}
                        >
                          {languageData?.track_complaint}
                        </div>
                      </div>
                    </div>
                    <div className={style.linkArrow}>
                      <img src={Right} alt="RightArrow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.cardContainerWraper}>
          <div className={style.cardContainer}>
            <div className={style.cardTitleOuter}>
              <div className={style.cardTitleInner}>
                <div className={style.cardTitle}>{languageData?.mytickets}</div>
              </div>
            </div>
            <div className={style.horizontalLine}></div>
            <div className={style.submitTicketSection}>
              <div className={style.heading}>
                {languageData?.walaa_cares_about_all_your_concerns}
              </div>
              <div className={style.statement}>
                {languageData?.raise_a_new_ticket}
              </div>
              <div className={style.tags}>
                <div className={style.tag}>
                  <div className={style.tagIcon}>
                    <img src={TicketTickmark} alt="TicketTickmark" />
                  </div>
                  <div className={style.tagLabel}>
                    {languageData?.enquiries}
                  </div>
                </div>
              </div>
              <div className={style.submitTicket}>
                <div className={style.submitTicketIconOuter}>
                  <div className={style.submitTicketIcon}>
                    <img src={TicketNotes} alt="TicketNotes" />
                  </div>
                </div>
                <div
                  className={style.submitTicketLabel}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNavigate("/Submit-Ticket")}
                >
                  {languageData?.submit_a_ticket}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
