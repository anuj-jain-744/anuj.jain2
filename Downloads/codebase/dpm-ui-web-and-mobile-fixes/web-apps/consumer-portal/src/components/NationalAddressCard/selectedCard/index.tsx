import { useState, useEffect } from 'react';
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { SwitchTabs } from "components/SwitchTabs";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Form, Modal } from "react-bootstrap";
import { DropdownElement } from "../dropdownElement";
import { validateBuildYear } from "@dpm/shared-module";
import { commonKeywords } from "../../../constant";

interface SelectedCardProp {
  formDisabled?: boolean;
  handlePropertySelection: (
    key: string,
    value: { activeIndex: number; activelabel: string } | string | boolean
  ) => void;
  latitude: string;
  longitude: string;
  propsData: [key: string][];
}

export const SelectedCard: React.FC<SelectedCardProp> = ({
  formDisabled = false,
  handlePropertySelection,
  latitude,
  longitude,
  propsData,
}) => {
  const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
  const {
    homeConfig: {
      property_built_year_placeholder,
      not_applicable_to_apartments,
      view_property_location_map,
      property_form_values_string,
      totalfloor_tooltip_title,
      totalfloor_tooltip_description
    },
    formAddressSelection,
    setShowPropertyMap,
    buildYearError,
    setBuildYearError,
  } = usePHQuoteBuyContext();


  const {
    propertyType: { activeIndex, activeLabel },
    propertyFloor,
    propertyBuildYear,
  } = formAddressSelection;

  const {
    propertyBuildYearLabel,
    propertyFloorLabel,
    propertyTypeLabel,
    rented,
  } = commonKeywords;

  const propertySelectionIqamaID = (input: string) => {
    if (/^[2]\d{0,9}$/.test(input)) {
      return {
        activeIndex: 1,
        activelabel: rented
      };
    }
    return false;
  }

  useEffect(() => {
    const propertySelection = propertySelectionIqamaID(propsData?.ownerId);
    if (propertySelection && !activeLabel) {
      handlePropertySelection(propertyTypeLabel, propertySelection);
    }
  }, [activeLabel])

  if (!property_form_values_string) {
    return null;
  }
  const { build_form, floor_form, type_form } = property_form_values_string;

  const propertyTypeOptions = [
    { webform_name: type_form?.option[0] },
    { webform_name: type_form?.option[1] },
  ];

  const handleBuildYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const error = validateBuildYear(
      value,
      build_form?.max_build_year,
      build_form?.validationMessage
    );
    setBuildYearError(error);
    handlePropertySelection(propertyBuildYearLabel, value);
  };

  const triggerPropertyLocationMap = () => {
    setShowPropertyMap({
      show: true,
      latitude: latitude,
      longitude: longitude,
    });
  };

  const handleRefNoClose = () => setRefNoShow(false);
  const handleRefNoShow = () => setRefNoShow(true);

  return (
    <div className="selected-wrapper">
      {!formDisabled && (
        <>
          <div className="about-property-wrapper d-flex">
            <div className="form-item d-flex width-35">
              <span
                className={`d-flex align-items-center form-label ${
                  floor_form.required && "required"
                }`}
              >
                {floor_form?.label}
                <Modal
                  show={isRefNoModal}
                  centered
                  onHide={handleRefNoClose}
                  className="floors-dialog-box"
                >
                  <Modal.Header closeButton>
                    {totalfloor_tooltip_title}
                  </Modal.Header>
                  <div className="floors-container">
                    {totalfloor_tooltip_description}
                  </div>
                </Modal>
                <button data-testid="buttonTestId" onClick={handleRefNoShow}>
                  <InfoOutlinedIcon />
                </button>
              </span>
              <DropdownElement
                floor_form={floor_form}
                selectedElement={propertyFloor}
                handleDropdownSelect={(option) =>
                  handlePropertySelection(propertyFloorLabel, option)
                }
              />
              <span className="light-text">{not_applicable_to_apartments}</span>
            </div>
            <div className="form-item d-flex width-35">
              <span
                className={`form-label ${build_form.required && "required"}`}
              >
                {build_form?.label}
              </span>
              <Form.Control
                type="text"
                placeholder={property_built_year_placeholder}
                className={`w-100 property-year-input ${
                  buildYearError ? "error" : ""
                }`}
                name="property-year-input"
                required={true}
                onChange={handleBuildYearChange}
                onBlur={(e) =>
                  handleBuildYearChange(
                    e as React.ChangeEvent<HTMLInputElement>
                  )
                }
                value={propertyBuildYear}
                min={0}
                maxLength={4}
              />
              {buildYearError && (
                <span className="error-message">{buildYearError}</span>
              )}
            </div>
            <div className="form-item d-flex width-30">
              <span
                className={`form-label ${type_form?.required && "required"}`}
              >
                {type_form?.label}
              </span>
              <div>
                <SwitchTabs
                  tabsData={propertyTypeOptions}
                  activeTab={{
                    activeIndex: activeIndex,
                    activelabel: activeLabel,
                  }}
                  setActiveTab={(tabId, label) =>
                    handlePropertySelection(propertyTypeLabel, {
                      activeIndex: tabId,
                      activelabel: label,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div className="separator-element" />
      <div className="view-property-wrapper">
        <div
          className="view-property-link d-flex align-items-center"
          onClick={triggerPropertyLocationMap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              triggerPropertyLocationMap();
            }
          }}
        >
          <PlaceOutlinedIcon />
          {view_property_location_map}
        </div>
      </div>
    </div>
  );
};
