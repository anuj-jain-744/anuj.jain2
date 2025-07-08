import React from "react";
import "./style.scss";
import SuccesRightComponent from "./SuccesRightComponent";
import SuccessTopComponent from "./SuccessTopComponent";
import EndorsementSuccessLeftComponent from "./EndorsementSuccessLeftComponent";

function EndorsementSuccess(props: {msg: string}) {
  return (
    <div className="success-container-main">
      <SuccessTopComponent msg={props.msg}/>
      <div className="cards-container">
        <EndorsementSuccessLeftComponent />
        <SuccesRightComponent />
      </div>
    </div>
  );
}

export default EndorsementSuccess;
