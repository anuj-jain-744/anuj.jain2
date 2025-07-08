import React from "react";
import { Accordion } from "react-bootstrap";
import "./style.scss";
import { useCommonContext } from "@dpm/shared-module";
import HomeIcon from "assets/Home/home-icon.svg";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { convertYear } from "utils/formatDate";
import { useLocation } from "react-router-dom";
import { commonKeywords } from "constant";
import { displayHouseAddress } from "utils/quoteAndBuy";

interface INationalAddress {
  languageData: LanguageData | undefined | null;
}

const NationalAddress: React.FC<INationalAddress> = ({ languageData }) => {
  const { formAddressSelection } = usePHQuoteBuyContext();
  const location = useLocation();
  const propsData = location?.state?.data;
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const formOption = languageData ? languageData?.property_form_values_string.type_form.option : "";
  const propertyId = formAddressSelection?.propertyNo > "0" && Number(formAddressSelection?.propertyNo) - 1 || "0";
  const address = propsData?.addressData?.addresses[propertyId] || {};
  return (
    <Accordion defaultActiveKey="0" className={`${"accor-close"} w-100 coverage-vehicleinfo`}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="flex-row">
            <div className="home-logo">
              <img
                className="icon-size"
                src={HomeIcon}
                alt="logo"
              />
            </div>
            <div className="each-column-second">
              <div className="d-flex flex-column">
                <div className="vehicle-infor-title walaa-regular-400">
                  {languageData?.property}
                </div>
                <div className="vehicle-infor-content walaa-medium-500">
                  {languageData?.property} {formAddressSelection.propertyNo > "0" ? formAddressSelection.propertyNo : 1}
                </div>
              </div>
            </div>

            <div className="each-column-third">
              <div className="d-flex flex-column">
                <div className="vehicle-infor-title walaa-regular-400">
                  {languageData?.property_type}
                </div>
                <div className="vehicle-infor-content walaa-medium-500" data-testid="propertyType">
                  {formOption[formAddressSelection?.propertyType.activeIndex]}
                </div>
              </div>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body className="p-2" >
          {/* row 1 */}
          <div className="row">
            <div className="col">
              <div className="d-flex flex-column">
                <div className="vehicle-infor-title walaa-regular-400">
                  {languageData?.national_address}
                </div>
                <div className="vehicle-infor-content walaa-medium-500">
                  {displayHouseAddress(address, currentLanguage, ar)}
                </div>
              </div>
            </div>
          </div>

          {/* row 2 */}
          <div className="row pt-3">
            <div className="col">
              <div className="d-flex flex-column">
                <div className="vehicle-infor-title walaa-regular-400">
                  {languageData?.number_of_floors}
                </div>
                <div className="vehicle-infor-content walaa-medium-500">
                  {formAddressSelection?.propertyFloor}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-column">
                <div className="vehicle-infor-title walaa-regular-400">
                  {languageData?.age_of_building}
                </div>
                <div className="vehicle-infor-content walaa-medium-500" data-testid="ageOfBuilding">
                  {convertYear(formAddressSelection?.propertyBuildYear)}{" "}Yrs.
                </div>
              </div>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NationalAddress;