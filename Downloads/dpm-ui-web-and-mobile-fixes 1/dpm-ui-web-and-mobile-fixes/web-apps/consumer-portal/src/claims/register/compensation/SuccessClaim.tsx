import React, { useContext } from "react";
import { DataContext } from "../../../DataContext";

interface ISuccessClaim {
  SuccessData: any;
}
function SuccessClaim({ SuccessData }: ISuccessClaim) {
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="row">
      <div className="col register-compensate">
        <div className="row register-row-spacing-top d-flex flex-column">
          <div className="col register-compensate-title walaa-medium-400">
            {Data?.motor_claim_no}
          </div>
          <div className="col register-compensate-title walaa-medium-500">
           {SuccessData?.claimNo}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessClaim;
