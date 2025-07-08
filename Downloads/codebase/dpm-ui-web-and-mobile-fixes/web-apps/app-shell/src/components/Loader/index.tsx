import React from "react";
import "./index.scss";

export const LoaderOverlay = () => {
  return (
    <div className="loader-overlay">
      <div className="custom-loader" role="status" aria-label="Loading" />
    </div>
  );
};