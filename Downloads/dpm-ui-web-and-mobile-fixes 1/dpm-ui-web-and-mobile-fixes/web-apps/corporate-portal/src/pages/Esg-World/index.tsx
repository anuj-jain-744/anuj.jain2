import React from "react";
import { Container } from "react-bootstrap";
import "./index.scss";

interface EsgWorldProps {
    iframeUrl: string; 
}

const EsgWorld: React.FC<EsgWorldProps> = ({ iframeUrl }) => {
    return (
        <section className="esg-worldpage">
            <div className="first-half-circle" />
            <Container fluid>
            <div className="esgworldpage-wrapper">
                <div className="white-mask">
                    <iframe className="iframe-content"
                        src={iframeUrl}
                    />
                </div>
            </div>
            </Container>
            <div className="last-half-circle" />
        </section>
        
    );
};

export default EsgWorld;
