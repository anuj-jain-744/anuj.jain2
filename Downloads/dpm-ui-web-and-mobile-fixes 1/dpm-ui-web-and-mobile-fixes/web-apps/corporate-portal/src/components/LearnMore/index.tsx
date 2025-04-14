import React from "react";
import ChevronRight from '@mui/icons-material/ChevronRight';
import { sanitizeHtml } from "@dpm/shared-module";
import {Container,Row,Col} from "react-bootstrap";
import "./index.scss";

interface Link {
  text: string;
  route: string;
}

interface LearnMoreProps {
  content: string;
  relatedLinksTitle: string;
  links: Link[];
  navigateTo?: (url: string) => void;
  }

export const LearnMore: React.FC<LearnMoreProps> = ({
  content,
  relatedLinksTitle,
  links,
  navigateTo
}): JSX.Element => {
    return (
    <Container fluid>
      <div className="frame__content">
      <Row>
        <Col md={9} xs={12}>
        {content && (
          <div
            className="frame__text-section"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        )}
        </Col>
        <Col md={3} xs={12}>
            <div className="frame__sidebar">
          {relatedLinksTitle && (
            <div className="know-more">
              <div className="know-more-title">{relatedLinksTitle}</div>
              <div className="related-links">
                {links.map((link, index) => (
                  <React.Fragment key={index}>
                    <div className="link" onClick={() => navigateTo && navigateTo(link?.route)}>
                      <ChevronRight className="icon" />
                      <div className="link-text">{link.text}</div>
                    </div>
                    {index < links.length - 1 && <div className="divider" />}
                  </React.Fragment>
                ))}
              </div>
              </div>
          )}
          </div>
        </Col>
      </Row>
      </div>
    </Container>
   
  );
};
