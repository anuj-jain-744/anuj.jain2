import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { sanitizeHtml } from "@dpm/shared-module";

import NoResultFound from "../SearchInfoByKeyword/NoResult";
import "./index.scss";
import { commonKeywords } from "../../constant";

interface AnsProps {
  label: string;
  url: string;
}
export interface FAQItem {
  qns: string;
  ans: string | AnsProps[];
}

interface AccordiansProps {
  content: FAQItem[];
  labels?: { [key: string]: string };
  navigateTo?: (url: string) => void;
}

export const Accordians: React.FC<AccordiansProps> = ({
  content,
  labels,
  navigateTo,
}) => {
  const noResult = {
    noResultTitle: labels?.no_faq_found || commonKeywords.noResultTitle,
    noResultSubTitle:
      labels?.we_could_not_find_any_faqs || commonKeywords.noResultSubTitle,
  };

  return (
    <React.Fragment>
      {content && content.length > 0 ? (
        <Accordion
          className="shared-accordian-wrapper"
          defaultActiveKey={["0"]}
          flush
          alwaysOpen
        >
          {content.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{item.qns}</Accordion.Header>
              <Accordion.Body>
                {Array.isArray(item.ans) ? (
                  <div className="iterable-accordian-wrapper">
                    {item.ans.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => navigateTo && navigateTo(item?.url)}
                        role="button" tabIndex={0} onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            navigateTo && navigateTo(item?.url);
                          }
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.ans) }}
                  />
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <NoResultFound noResultPlacehoder={noResult} />
      )}
    </React.Fragment>
  );
};
