import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { animated } from "@react-spring/web";
import {createTableSpring} from "../../utils/createTableSpring";
import "./index.scss";

interface teamDataProps {
    title: string;
    designation?: string;
    content?: string;
    image_url: string;
    image_alt?: string;
    weight?: string;
    member_role_name?: string;
    icon?: string;
    desc?: string;
}
interface teamHeading {
    walaa_team_title: string;
}
interface TeamMemeber {
    teamData: teamDataProps[];
    teamHeading: any;
    isVisible?:boolean;
}

export const ManagementTeam: React.FC<TeamMemeber> = ({
    teamData,
    teamHeading,
    isVisible
}) => {
    const springs = createTableSpring(
        isVisible ?? false, // Provide a default value of false
        "translateX(50%) translateY(0%)",
        "translateX(50%) translateY(0%)",
        500
      );
    return (
        <div id="productToggle-4">
            <Container fluid className="team-container py-5">
                <div className="rating-section">
                <Container fluid>
                <animated.div style={isVisible ? springs : {}}>
                <div className="semi-circle-top"></div>
                <h2
                    className={`team-header walaa-medium-500  ${
                    teamHeading?.desc ? "team-title-left" : ""
                }`}>
                    {teamHeading.walaa_team_title}</h2>
                {teamHeading.desc &&
                    <div className="card-desc walaa-regular-400" dangerouslySetInnerHTML={{ __html: teamHeading.desc }} />
                    }
                <div className="team-outer">
                    <Row className="justify-content-center">
                        {teamData &&
                            teamData.map((member, index) => (
                                <Col
                                    key={index}
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                    className="walaa-team-card"
                                    data-testid={`team-member-col-${index}`}
                                >
                                    <Card className="team-card">
                                        <Card.Body className="team-body">
                                            <img
                                                src={member?.image_url || member?.icon}
                                                alt={member?.image_alt}
                                                className={`${
                                                    member?.icon ? "card-icon-position" : "team-image"
                                                }`}
                                                data-testid={`team-member-image-${index}`}
                                            />
                                            <Card.Title
                                                className={`card-title walaa-medium-500 ${member?.icon ? "title-padding" : ""}`}
                                                data-testid={`team-member-title-${index}`}
                                            >
                                                {member?.title}
                                            </Card.Title>
                                            <Card.Text
                                                className="card-text walaa-regular-400"
                                                data-testid={`team-member-designation-${index}`}
                                            >
                                                {member?.designation || member?.desc}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                    </Row>

                </div>
                <div className="semi-circle-bottom"></div>
                </animated.div>
                </Container>
                </div>
            </Container>
        </div>
    );
};
