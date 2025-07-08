import React, { useContext } from "react";
import ThemeSelect from "../../../components/ThemeSelect";
import { DataContext } from "../../../../DataContext";

function CompreGarage() {
  //cms content
  const Data = useContext(DataContext);
  return (
    <React.Fragment>
      <div className="row compre-compensation">
        <div className="col-xs-12 col-md-6">
          <div className="row d-flex flex-column">
            <div className="col register-compensate-estimate-large-title walaa-medium-500 register-row-spacing-bottom">
              {Data?.city}
            </div>
            <div className="col">
              <ThemeSelect />
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-md-6">
          <div className="row d-flex flex-column">
            <div className="col register-compensate-estimate-large-title walaa-medium-500 register-row-spacing-bottom">
              {Data?.garage_select_any_3}
            </div>
            <div className="col">
              <ThemeSelect />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CompreGarage;
