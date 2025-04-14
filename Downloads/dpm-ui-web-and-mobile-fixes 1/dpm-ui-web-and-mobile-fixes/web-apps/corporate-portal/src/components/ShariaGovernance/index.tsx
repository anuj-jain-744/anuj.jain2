import React from "react";
import ChevronRight from '@mui/icons-material/ChevronRight';
import { sanitizeHtml } from "@dpm/shared-module";
import "./index.scss";

interface Link {
  text: string;
  route: string;
}

interface ShariaGovernanceProps {
  content: string;
  knowMoreTitle: string;
  links: Link[];
  sidebarDescription: string;
  websiteLink: string;
  sidebarImage: { url: string; alt: string };
  navigateTo?: (url: string) => void;
}

export const ShariaGovernance: React.FC<ShariaGovernanceProps> = ({
  content,
  knowMoreTitle,
  links,
  sidebarDescription,
  websiteLink,
  sidebarImage,
  navigateTo
}): JSX.Element => {
  return (
    <div className="frame">
      <div className="frame__content">
        {content && (
          <div
            className="frame__text-section"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        )}

        <div className="frame__sidebar">
          {knowMoreTitle && (
            <div className="know-more">
              <div className="know-more-title">{knowMoreTitle}</div>
              <div className="related-links">
                {links.map((link, index) => (
                  <React.Fragment key={index}>
                    <div className="link" onClick={() => navigateTo && navigateTo(link.route)}>
                      <ChevronRight className="icon" />
                      <div className="link-text">{link.text}</div>
                    </div>
                    {index < links.length - 1 && <div className="divider" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="sharia-info-box">
            {sidebarImage.url && (
              <img
                className="image"
                alt={sidebarImage.alt || "Sharia Governance"}
                src={sidebarImage.url}
              />
            )}
            <div className="text-content">
              {sidebarDescription && (
                <p
                  className="description"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(sidebarDescription) }}
                />
              )}
              <div className="link">
                <a
                  href={websiteLink}
                  className="website-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >

                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
