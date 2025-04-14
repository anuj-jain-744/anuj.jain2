import React, { useContext } from "react";
import VehicleSeqInformation from "./VehicleSeqInformation";
import { DataContext } from "DataContext";

function CustomCardVehSequence() {
  //cms content
  const Data = useContext(DataContext);
  return (
    <React.Fragment>
      <div className="row customcardvehsequence mb-3">
        <div className="col vehseqtitle walaa-medium-500">
          {Data?.change_from_custom_card_no}
        </div>
      </div>

      <VehicleSeqInformation />
    </React.Fragment>
  );
}

export default CustomCardVehSequence;
