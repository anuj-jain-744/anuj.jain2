import React, { useEffect } from "react";
import { sanitizeHtml } from "@dpm/shared-module";
import "./index.scss";

interface Link {
  text: string;
  route: string;
}

interface PrivacyCookieNoticeProps {
  content: string;
  sidebarContent: string;
  subTitle:string;
  navigateTo?: (url: string) => void;
}

export const PrivacyCookieNotice: React.FC<PrivacyCookieNoticeProps> = ({
  content,
  sidebarContent,
  subTitle,
  navigateTo
}) => {

  useEffect (()=>{
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetTop = elementTop - 130;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      });
    });
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, [])


  return (
    <div className="sharia-frame privacy-container">
      <div className="frame__content">
        {content && (
          <div
            className="frame__text-section"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        )}

        <div className="frame__sidebar">
          {sidebarContent && (
            <div className="know-more">
              {/* <div className="know-more-title">{knowMoreTitle}</div> */}
              <div className="related-links">
                <div
                  className="frame__text-section"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(sidebarContent) }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
