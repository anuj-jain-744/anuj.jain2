import React, { useContext } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import SuccessGreen from "../../../components/SuccessGreen";
import { DataContext } from '../../../DataContext';
import "./style.scss";

import line164_2 from '../../../assets/Motor/line-164-2.svg';
import line166 from '../../../assets/Motor/line-166.svg';
import frame200 from '../../../assets/Motor/frame-1000003200.svg';
import frame201 from '../../../assets/Motor/frame-1000003200-1.svg';
import frame202 from '../../../assets/Motor/frame-1000003200-2.svg';
import maskgroup from '../../../assets/Motor/mask-group.png';

export const PaySuccess = () => {
  const languageData = useContext(DataContext);
  return (
    <div className="payment-success-page">
      <div className="outerContainer">
        <div className="frame-wrapper">
          <SuccessGreen lblText={languageData?.success} message={languageData?.successfully_adde + " WL-456789-23."} />
        </div>
        <div className="container">
          <div className="leftContainer">
            <div className="leftTopSection">
              <div className="claims-policy">
                <div className="line-2">
                  <div className="div-3">
                    <div className="form-elements-view">
                      <div className="label-wrapper">
                        <div className="label-3">{languageData?.success}Sponsor Name</div>
                      </div>
                      <div className="read-only-field-text">Javed Al-Mutairi</div>
                    </div>
                  </div>
                  <img className="line-3" alt="Line" src={line164_2} />
                  <div className="form-elements-view">
                    <div className="label-wrapper">
                      <div className="label-3">{languageData?.sponsor_id}</div>
                    </div>
                    <div className="read-only-field-text">2127664478</div>
                  </div>
                  <img className="line-3" alt="Line" src={line164_2} />
                  <div className="form-elements-view">
                    <div className="label-wrapper">
                      <div className="label-3">{languageData?.dob}</div>
                    </div>
                    <div className="read-only-field-text">14/11/1988</div>
                  </div>
                </div>
              </div>
              <div className="subContainer">
                <div className="motor-info">
                  <div className="product">
                    <img className="mask-group" alt="Mask group" src={maskgroup} />
                    <div className="form-elements-view">
                      <div className="label-wrapper">
                        <div className="label-4">{languageData?.model_type}</div>
                      </div>
                      <div className="read-only-field-text-2">Nissan Patrol XE</div>
                    </div>
                  </div>
                  <img className="line-3" alt="Line" src={line166} />
                  <div className="form-elements-view">
                    <div className="label-wrapper">
                      <div className="label-4">{languageData?.vehicle_sequence}</div>
                    </div>
                    <div className="read-only-field-text-2">8754562340</div>
                  </div>
                </div>
                <div className="noteSection">
                  <div className="text-wrapper-7">{languageData?.note}</div>
                  <p className="text-wrapper-8">
                    {languageData?.to_avoid_request_cancellat}
                  </p>
                </div>
                <div className="downloadSection">
                  <div className="div-3">
                    <DownloadIcon className="icons-material-icons-download-2" />
                    <div className="hyperlink-3">{languageData?.endorsement_schedule}</div>
                  </div>
                  <div className="div-3">
                    <DownloadIcon className="icons-material-icons-download-2" />
                    <div className="hyperlink-3">{languageData?.payment_receipt}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="serviceSection">
              <div className="frame-01">
                <div className="frame-02">
                  <p className="text-wrapper-9">{languageData?.subscribe_to_dli_related}</p>
                </div>
              </div>
              <div className="frame-03">
                <div className="frame-04">
                  <div className="div-3">
                    <img className="frame-05" alt="Frame" src={frame200} />
                    <div className="div-3">
                      <div className="hyperlink-4">{languageData?.regular_inspection}</div>
                    </div>
                  </div>
                  <div className="div-3">
                    <img className="frame-25" alt="Frame" src={frame201} />
                    <div className="div-3">
                      <div className="hyperlink-4">{languageData?.roadside_assistance}</div>
                    </div>
                  </div>
                  <div className="div-3">
                    <img className="frame-25" alt="Frame" src={frame202} />
                    <div className="div-3">
                      <div className="hyperlink-4">{languageData?.car_wash}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-26">
              <div className="buttons-action-2">
                <div className="label-5">
                  <button className="button-2">{languageData?.explore_other_insurance_pr}</button>
                </div>
              </div>
              <div className="buttons-action-3">
                <div className="label-5">
                  <button className="button-3">{languageData?.back_to_endorsement}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="promotions-mobile">
            {/* Need to call Mobile app promotion component here from corporate website */}
          </div>
        </div>
      </div>
    </div>
  );
};
