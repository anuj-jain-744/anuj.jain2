import React, { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { sanitizeHtml, chunkArray } from "@dpm/shared-module";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AddLocationOutlinedIcon from "@mui/icons-material/AddLocationOutlined";

import { DownloadPdfWidget } from "components/DownloadPdfWidget";
import { RelatedLink } from "components/RelatedLink";
import { HighlighterWidget } from "components/HighlighterWidget";
import { ContactWidget } from "./commonWidget";
import { NewsArticleTemplateProps } from "./types";
import "./index.scss";

export const NewsArticleTemplate: React.FC<NewsArticleTemplateProps> = ({
  data: {
    image_url,
    title,
    news_category,
    created_date,
    news_inner_title,
    short_description,
    newscontact,
    attachments,
    content,
    handleNavigate,
    related_news,
    relatedLinks,
    allPost_label,
    attachments_label,
    event_title,
    time_label,
    event_time,
    date_label,
    event_date,
    location_label,
    event_location,
  },
}) => {
  const meetingWidget = [
    time_label && {
      Icon: AccessTimeIcon,
      label: time_label,
      details: event_time,
    },
    date_label && {
      Icon: EventAvailableOutlinedIcon,
      label: date_label,
      details: event_date,
    },
    location_label && {
      Icon: AddLocationOutlinedIcon,
      label: location_label,
      details: event_location,
    },
  ].filter(Boolean);

  const chunkedMeetingData = chunkArray(meetingWidget, 2);
  console.log(event_title, attachments);

  return (
    <div className="news-article-wrapper">
      <Container fluid>
        <Row className="article-row">
          <Col className="article-content-col">
            <img src={image_url} alt={title} className="article-banner-image" />
            <div className="article-content-wrapper">
              <span className="article-publish-detail">
                {news_category} | {created_date}
              </span>
              <h1 className="article-title">{news_inner_title}</h1>
              <span className="article-short-description">
                {short_description}
              </span>
              {event_title && (
                <HighlighterWidget title={event_title} iconsClass="meeting">
                  <div className="d-flex flex-wrap row-wrapper">
                    {chunkedMeetingData.map((meetingData, index) => (
                      <Fragment key={index}>
                        <Row className={`meeting-wrapper wrapper-${index}`}>
                          {meetingData.map(
                            (item, idx) =>
                              item && (
                                <HighlighterWidget.CardContent
                                  Icon={item.Icon}
                                  label={item.label}
                                  details={item.details || ""}
                                  key={idx}
                                />
                              )
                          )}
                        </Row>
                        <HighlighterWidget.ContentSeparator />
                      </Fragment>
                    ))}
                  </div>
                </HighlighterWidget>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              />
              <ContactWidget contactItem={newscontact} />
              {attachments && attachments.length > 0 && (
                <div className="article-attachment-wrapper">
                  <h3>{attachments_label}</h3>
                  <div className="download-wrapper">
                    {attachments.map(({ title, url }, index) => (
                        <DownloadPdfWidget
                          key={index}
                          label={title}
                          url={url}
                          handleNavigate={handleNavigate}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col className="related-news-col story-about">
            <span className="related-link-title">{relatedLinks}</span>
            <RelatedLink
              type="Academy"
              relatedContent={related_news}
              showImage={true}
              individualCards={true}
            />
            <div className="d-flex read-more-action">
              <span>{allPost_label}</span>
              <ChevronRightIcon />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewsArticleTemplate;
