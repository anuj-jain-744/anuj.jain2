import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "./index.scss";

export const LoaderOverlay = () => {
  return (
    <div className="loader-overlay">
      <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};
