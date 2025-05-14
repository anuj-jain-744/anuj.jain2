import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import { slices } from "@dpm/shared-module";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import { getAge } from "utils/getAge";
import "./index.scss";
import { TravelItem } from "../TravelDetailCard/TravelContent";
import { CombinedData } from "types/languageData";
import { Col, Row } from "react-bootstrap";
import clienIcon from "assets/QuoteAndBuy/client-icon.png";
import Info from "../../../../../components/TravelerAddDetails/info";
import EditTraveller from "../EditTraveller";

export interface TraItem {
  label: string;
  value: string;
}

export interface TravelLink {
  label: string;
  link: boolean | string;
}
export type Traveler = {
  id: number;
  name: string;
  passportNo: string;
  passportExpiry: string;
  dob: string;
  relation: "Daughter" | "Son" | "Spouse";
  type: "Adult" | "Child" | "Senior Citizen";
};
type FamilyType = "child" | "adult" | "senior" | "invalid";
interface TravelDetailCardProps {
  languageData: CombinedData | undefined | null;
  handleAlertMessage(): void;
  travelersData: string[];
  onUpdate: (updatedTraveler: Traveler) => void;
  onDelete: (travelerId: string) => void;
}

const TravelInfoCard: React.FC<TravelDetailCardProps> = React.memo(
  ({ travelersData, languageData, handleAlertMessage, onUpdate, onDelete }) => {
    const [travelData, setTravelData] = useState<TravelItem[]>([]);
    const [travelNameData, setTravelNameData] = useState<TravelItem[]>([]);
    const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
    const [covidBenfit, setCovidBenfit] = useState<boolean>(false);
    const [age, setAge] = useState<number>();
    const dispatch = useDispatch();
    const { addBenefits, removeBenefits } = slices.endorsementTravelers;
    const checkStringAvailability = (
      str: string,
      arr: Array<{ [key: string]: string }>
    ): boolean => {
      return arr && arr.some((obj) => Object.values(obj).includes(str));
    };
    const getRelation = (relation: string): string => {
      switch (relation) {
        case "1":
          return "Self";
        case "2":
          return "Spouse";
        case "4":
          return "Daughter";
        case "3":
          return "Son";
        default:
          return "Unknown";
      }
    };

    const getFamilyType = (dobInput: string | Date): FamilyType => {
      const dob = new Date(dobInput);
      if (isNaN(dob.getTime())) return "invalid";

      const now = new Date();
      const ageInMilliseconds = now.getTime() - dob.getTime();

      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // avg month length

      if (ageInMonths >= 3 && ageInYears < 18) return "child";
      if (ageInYears >= 18 && ageInYears < 65) return "adult";
      if (ageInYears >= 65) return "senior";

      return "invalid";
    };
    useEffect(() => {
      if (languageData) {
        setTravelNameData([
          {
            label: "name in english",
            value: travelersData?.name,
          },
          {
            label: "name in arabic",
            value: "-",
          },
        ]);

        setTravelData([
          {
            label: languageData?.traveller_dob || "null",
            value: travelersData?.dob,
          },
          {
            label: languageData?.traveller_passport_no || "null",
            value: travelersData?.passportNo,
          },
          {
            label: languageData?.traveller_passport_exp_date || "null",
            value: travelersData?.passportExpiry,
          },
          {
            label: languageData?.relationship || "null",
            value: getRelation(travelersData?.relation),
          },
        ]);
      }
    }, [languageData, travelersData]);
    useEffect(() => {
      if (travelersData?.dob) {
        setAge(getAge(travelersData.dob));
      }
    }, [travelersData?.dob]);
    const handleInputChangeBenfit = (
      travelerId: number,
      coverageType: string
    ) => {
      dispatch(addBenefits(travelerId, coverageType));
    };
    const handleRemoveCoverage = (travelerId: number, coverageType: string) => {
      dispatch(removeBenefits(travelerId, coverageType));
    };
    return (
      <div className="manage-travel-details-card-wrap">
        <div className="trav-details-card">
          {languageData && (
            <Row className="trav-top">
              <Col className="user-logo text-start">
                <img
                  src={clienIcon ? clienIcon : "default-icon.png"}
                  alt="user icon"
                />
              </Col>

              <Col className="label-container text-start">
                {travelNameData?.map((travelItem: TravelItem) => (
                  <span className="trav-value" key={travelItem.label}>
                    {travelItem.value}
                  </span>
                ))}
              </Col>

              {Array.isArray(travelData) &&
                travelData.map((travelItem: TravelItem, idx: number) => (
                  <Col key={idx} className="label-container text-start">
                    <span className="trav-label">{travelItem.label}</span>
                    <span className="trav-value">{travelItem.value}</span>
                  </Col>
                ))}

              <Col className="text-start col-1 edit_col">
                {getRelation(travelersData?.relation) !== "Self" && (
                  <EditTraveller
                    noOfAdults={1}
                    data={languageData}
                    handleAlert={handleAlertMessage}
                    travelItemValues={travelersData}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    familyType={getFamilyType(travelersData?.dob)}
                  />
                )}
              </Col>
            </Row>
          )}
        </div>

        <Row className="traveladdon-details">
          <Col>
            <div className="benfit-block">
              <div className="benfit-block-title">
                {languageData?.additonal_benefits}
              </div>

              <div className="benfit-content">
                {/* WSC Benefit Block */}
                <div
                  className={`${
                    !winterBenfit
                      ? "benfit-one"
                      : "benfit-one benfit-one-select"
                  }`}
                >
                  <div className="left-icon">
                    <DownhillSkiingOutlinedIcon />
                  </div>

                  <div className="benfit-data">
                    <div className="benfit-title">
                      <div className="info-align">
                        {languageData?.benfit_sports} &nbsp;
                        <Info popUpData={languageData?.benfit_sports_info} />
                      </div>
                      <div>
                        <p className="sub-title">
                          {languageData?.percentage_of_premium}
                        </p>
                      </div>
                    </div>
                    <div className="benfit-sub-title">
                      {/* Replace with API data if needed */}
                    </div>
                  </div>

                  <div
                    className="benfit-right"
                    onClick={() =>
                      checkStringAvailability(
                        "WSC",
                        travelersData?.coverageCode
                      )
                        ? handleRemoveCoverage({
                            travelerId: travelersData?.id,
                            coverageType: "WSC",
                          })
                        : handleInputChangeBenfit({
                            travelerId: travelersData?.id,
                            coverageType: "WSC",
                          })
                    }
                  >
                    <div
                      className={`${
                        checkStringAvailability(
                          "WSC",
                          travelersData?.coverageCode
                        )
                          ? "benfit-remove-btn"
                          : "benfit-button"
                      }`}
                    >
                      <div className="benfit-button-text">
                        {checkStringAvailability(
                          "WSC",
                          travelersData?.coverageCode
                        )
                          ? languageData?.remove_button
                          : languageData?.add_button}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="benfit-content-space"></div>

                {/* CV Benefit Block */}
                <div
                  className={`${
                    !covidBenfit ? "benfit-one" : "benfit-one benfit-one-select"
                  }`}
                >
                  <div className="left-icon">
                    <CoronavirusOutlinedIcon />
                  </div>

                  <div className="benfit-data benfit-data-right">
                    <div className="benfit-title">
                      <div className="info-align">
                        {languageData?.benfit_covid} &nbsp;
                        <Info popUpData={languageData?.benfit_covid_info} />
                      </div>
                      <p className="sub-title">{languageData?.sar_200}</p>
                    </div>
                    <div className="benfit-sub-title">
                      {/* Optional subtitle or additional info */}
                    </div>
                  </div>

                  <div
                    className="benfit-right"
                    onClick={() =>
                      checkStringAvailability("CV", travelersData?.coverageCode)
                        ? handleRemoveCoverage({
                            travelerId: travelersData?.id,
                            coverageType: "CV",
                          })
                        : handleInputChangeBenfit({
                            travelerId: travelersData?.id,
                            coverageType: "CV",
                          })
                    }
                  >
                    <div
                      className={`${
                        checkStringAvailability(
                          "CV",
                          travelersData?.coverageCode
                        )
                          ? "benfit-remove-btn"
                          : "benfit-button"
                      }`}
                    >
                      <div className="benfit-button-text">
                        {checkStringAvailability(
                          "CV",
                          travelersData?.coverageCode
                        )
                          ? languageData?.remove_button
                          : languageData?.add_button}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
);

export default TravelInfoCard;
