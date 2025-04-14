import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MultiLayoutCard } from "components/MultiLayoutCard";
import { LayoutTab } from "components/LayoutTab";
import { DocumentLibraryLayoutProps } from "./types";

import "./index.scss";

export const DocumentLibraryLayout: React.FC<DocumentLibraryLayoutProps> = ({
  description,
  documents,
  navigateTo,
}) => {
  const [activeLayout, setActiveLayout] = useState<string>("list");

  return (
    <section className="document-library">
      <div className="first-half-circle" />
      <Container fluid>
        <div className="document-library-wrapper">
          <div className="header-wrap d-flex">
            <div
              className="heading-innerhtml d-flex"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <LayoutTab
              activeLayout={activeLayout}
              handleLayout={setActiveLayout}
            />
          </div>
          <div className="card-wrapper">
            <Row>
              {documents &&
                documents.length > 0 &&
                documents.map(({ file_name, file_url }, index) => (
                  <Col
                    className={`${activeLayout}`}
                    xl={3}
                    lg={6}
                    md={6}
                    sm={12}
                    key={index}
                  >
                    <MultiLayoutCard
                      label={file_name}
                      link={file_url}
                      navigateTo={navigateTo}
                      layout={activeLayout}
                    />
                  </Col>
                ))}
            </Row>
          </div>
        </div>
      </Container>
      <div className="last-half-circle" />
    </section>
  );
};
