import { useCommonContext, stringToBoolean } from "@dpm/shared-module";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import ThemeRadioCheckbox from "components/ThemeRadioCheckbox/ThemeRadioCheckbox";
import { useLocation } from "react-router-dom";
import LocationModal from "components/LocationModal";
import { PersonalHome } from "assets/Products/index";
import { SelectedCard } from "./selectedCard";
import { usePropertySelection } from "../../hooks/usePropertSelection";
import { commonKeywords } from "../../constant";

import "./index.scss";

export const NationalAddressCard = ({ addressData }) => {
  const { currentLanguage } = useCommonContext();
  const { ar, propertyNoLabel } = commonKeywords;
  const {
    homeConfig: {
      select_your_property,
      property,
      national_address,
      placeholder_detail,
      map_label,
    },
    formAddressSelection,
    setFormAddressSelection,
    resetFormAddressSelection,
    resetPropertyCoodinates,
    setShowPropertyMap,
    showPropertyMap,
  } = usePHQuoteBuyContext();

  const location = useLocation();
  const propsData = location?.state?.data;

  const { addresses } = addressData || [];
  
  //Sorting the adresses based on isPimaryAddress property which is true as come at first
  const sortedArr = addresses?.reduce((acc, element) => {
    const primaryAddrs = element.isPrimaryAddress;
    if (primaryAddrs === "true") {
      return [element, ...acc];
    }
    return [...acc, element];
  }, []);

  const { propertyNo, propertyNearCoastline } = formAddressSelection;

  const isSelectedBuilding = (
    buildingNumber: number,
    isPrimaryAddress: string
  ): boolean => {
    //Property initial value is 0
    if (propertyNo !== "0") {
      return Number(propertyNo) === buildingNumber;
    } else {
      return stringToBoolean(isPrimaryAddress);
    }
  };

  const { handlePropertySelection } = usePropertySelection(
    setFormAddressSelection,
    resetFormAddressSelection,
    resetPropertyCoodinates,
    setShowPropertyMap
  );

  const handleModalClose = () => {
    setShowPropertyMap(resetPropertyCoodinates);
  }

  return (
    <>
      {showPropertyMap.show && (
        <LocationModal
          showPopup={showPropertyMap.show}
          setShowPopup={handleModalClose}
          lat={showPropertyMap.latitude}
          long={showPropertyMap.longitude}
          title={map_label}
        />
      )}
      <div className="national-card-wrapper">
        <div className="content-placeholder">
          <h5 className="walaa-medium-500">{select_your_property}</h5>
          <span>{propsData?.ownerDetail?.ownerFullNameEnglish}, {placeholder_detail}</span>
        </div>
        {sortedArr &&
          sortedArr.map(
            (
              {
                buildingNumber,
                streetAR,
                streetENG,
                districtAR,
                districtENG,
                cityAR,
                cityENG,
                postCode,
                additionalNumber,
                regionNameAR,
                regionNameENG,
                isPrimaryAddress,
                latitude,
                longitude,
              },
              index
            ) => {
              const proppertyId = index + 1;
              const isSelected = isSelectedBuilding(proppertyId, isPrimaryAddress);
              return (<div
                className={`address-card-main ${isSelected
                    ? "selected"
                    : "not-selected"
                  }`}
                key={index}
              >
                <div className="heading-wrapper d-flex align-items-center">
                  <div className="d-flex align-items-center icon-main">
                    <img alt="icon" src={PersonalHome} className="home-icon" />
                    <h6
                      className="walaa-medium-500"
                      id="address-header"
                    >{`${property} ${proppertyId}`}</h6>
                  </div>
                  <ThemeRadioCheckbox
                    label={proppertyId}
                    type="radio"
                    classes="address-radio-btn"
                    checked={isSelected}
                    name="nationAddress"
                    onChangehandler={(e) =>
                      handlePropertySelection(propertyNoLabel, e.target.value)
                    }
                    isDisabled={
                      isSelected &&
                      propertyNearCoastline.activeIndex === 0 &&
                      true
                    }
                  />
                </div>
                <div className="separator-element" />
                <div className="content-wrapper d-flex">
                  <span className="sub-heading">{national_address}</span>
                  <span className="address walaa-medium-500">
                    {`${buildingNumber} ${currentLanguage === ar ? streetAR : streetENG
                      }, ${currentLanguage === ar ? districtAR : districtENG}, ${currentLanguage === ar ? cityAR : cityENG
                      }, ${postCode}, ${additionalNumber}, ${currentLanguage === ar ? regionNameAR : regionNameENG
                      }`}
                  </span>
                </div>
                {isSelected && (
                  <SelectedCard
                    formDisabled={
                      isSelected &&
                      propertyNearCoastline.activeIndex === 0 &&
                      true
                    }
                    handlePropertySelection={handlePropertySelection}
                    latitude={latitude}
                    longitude={longitude}
                    propsData={propsData}
                  />
                )}
              </div>)
            }
          )}
      </div>
    </>
  );
};
