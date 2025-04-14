// @ts-nocheck
import { callAPI, getFullUrl } from "@dpm/shared-module";
import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { sanitizeHtml } from "@dpm/shared-module";
import EastIcon from "@mui/icons-material/East";
import "./index.scss";
import BranchMap from "./Map";
import BranchCarousel from "./BranchCarousel";
import BranchCard from "../BranchCard";
import { renderBranchCard } from "./renderBranchCard";
import { useCommonContext } from "@dpm/shared-module";
import {
  getCurrentDay,
  transformData,
  getWorkingHoursForDay,
} from "utils/formatOpeningHours";

interface ViewBranchesProps {
  title: string;
  description: string;
  navigateTo: (url: string) => void;
  isVisible?: boolean;
  cities: { region: string; city: string }[];
  regions: { name: string }[];
  branchTypes: { name: string }[];
  branches: {
    branch_category: string;
    branch_city: string;
    branch_type: string;
    title: string;
    address: string;
    phone: string;
    email: string;
    working_hours: string;
    working_days: string;
    working_hours_data: any;
  }[];
  commonLabels: {
    select_region_label: string;
    select_city_label: string;
    please_select_region_label: string;
    all_offices_label: string;
    nobranches_found_label: string;
  };
}

export const ViewBranches = ({
  title,
  description,
  navigateTo,
  isVisible = false,
  cities,
  regions,
  branchTypes,
  branches,
  commonLabels,
}: ViewBranchesProps) => {
  const branchListRef = useSpringRef();
  const mapRef = useSpringRef();
  const { currentLanguage } = useCommonContext();

  const springBranchList = useSpring({
    ref: branchListRef,
    from: {
      transform: isVisible
        ? "translateX(-500%) translateY(0%)"
        : "translateX(0%) translateY(0%)",
    },
    to: {
      transform: isVisible
        ? "translateX(0%) translateY(0%)"
        : "translateX(-50%) translateY(0%)",
    },
    config: { tension: 70, friction: 20 },
    delay: 0,
  });

  const springMap = useSpring({
    ref: mapRef,
    from: { opacity: isVisible ? 0 : 1 },
    to: { opacity: isVisible ? 1 : 0 },
    config: { tension: 70, friction: 20 },
    delay: 0,
  });
  const [selectedItem, setSelectedItem] = useState({
    region: null,
    city: null,
    selectedCity: null,
    category: null,
  });
  const [filteredBranches, setFilteredBranches] = useState(branches);
  const [selectedOfficeCategory, setSelectedOfficeCategory] = useState("");

  const handleSelect = (item, scope) => {
    switch (scope) {
      case "region":
        const selectedCities = cities.filter((data) => data.region === item);
        const filteredBranchesByRegion = branches.filter(
          (data) => data.branch_category === item
        );
        setSelectedItem((prevState) => ({
          ...prevState,
          [scope]: item,
          selectedCity: null,
          city: selectedCities,
        }));
        setFilteredBranches(filteredBranchesByRegion);
        setSelectedOfficeCategory("");
        break;

      case "city":
        setSelectedItem((prevState) => ({
          ...prevState,
          selectedCity: item,
        }));
        const filteredBranchesByCity = branches.filter(
          (data) =>
            data.branch_city === item &&
            (!selectedItem.region ||
              data.branch_category === selectedItem.region)
        );
        setFilteredBranches(filteredBranchesByCity);
        setSelectedOfficeCategory("");
        break;

      case "category":
        setSelectedItem((prevState) => ({
          ...prevState,
          category: item,
        }));
        const filteredBranchesByCategory = branches.filter(
          (data) =>
            data.branch_type === item &&
            (!selectedItem.region ||
              data.branch_category === selectedItem.region) &&
            (!selectedItem.selectedCity ||
              data.branch_city === selectedItem.selectedCity)
        );
        setFilteredBranches(filteredBranchesByCategory);
        setSelectedOfficeCategory(item);
        break;

      case "allOffices":
        setSelectedItem({
          region: null,
          city: null,
          selectedCity: null,
          category: null,
        });
        setFilteredBranches(branches);
        setSelectedOfficeCategory("");
        break;

      default:
        setSelectedItem({
          region: null,
          city: null,
          selectedCity: null,
          category: null,
        });
        setFilteredBranches(branches);
        setSelectedOfficeCategory("");
        break;
    }
  };

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleCardClick = (index) => {
    setActiveCardIndex(index);
  };

  useChain([branchListRef, mapRef]);

  const isMobileOrTablet = window.innerWidth <= 1024;

  return (
    <section className="view-branches-section">
      <Container fluid className="view-branch-container">
        <div className="branches-content">
          <h1 className="title walaa-medium-500">{title}</h1>
          <span className="description walaa-regular-400">{description}</span>
        </div>
        <div className="branched-box">
          <Row className={isVisible ? "row-classname" : ""}>
            <Col xl={4} className="branch-selector-col">
              <animated.div
                style={isVisible ? springBranchList : {}}
                className="branch-selector-wrapper"
              >
                <div className="filter-region">
                  <DropdownButton
                    title={
                      <React.Fragment>
                        <div className="filter-title walaa-regular-400">
                          <span>
                            {selectedItem?.region
                              ? selectedItem?.region
                              : commonLabels?.select_region_label &&
                                commonLabels?.select_region_label}
                          </span>
                        </div>
                        <ExpandMoreIcon />
                      </React.Fragment>
                    }
                  >
                    {regions?.map(({ name }, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleSelect(name, "region")}
                        className={
                          selectedItem?.region === name ? "selected" : ""
                        }
                      >
                        {name}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                  <DropdownButton
                    title={
                      <React.Fragment>
                        <div className="filter-title walaa-regular-400">
                          <span>
                            {selectedItem?.selectedCity
                              ? selectedItem?.selectedCity
                              : commonLabels?.select_city_label &&
                                commonLabels?.select_city_label}
                          </span>
                        </div>
                        <ExpandMoreIcon />
                      </React.Fragment>
                    }
                  >
                    {selectedItem?.city ? (
                      selectedItem?.city.map(({ city }, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleSelect(city, "city")}
                          className={
                            selectedItem?.selectedCity === city
                              ? "selected"
                              : ""
                          }
                        >
                          {city}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>
                        {commonLabels?.please_select_region_label &&
                          commonLabels?.please_select_region_label}
                      </Dropdown.Item>
                    )}
                  </DropdownButton>
                </div>
                <div className="filter-office">
                  <Form.Check
                    type="radio"
                    label={
                      commonLabels?.all_offices_label &&
                      commonLabels?.all_offices_label
                    }
                    className="office-checkbox walaa-regular-400"
                    aria-label="select office"
                    name="officeCategory"
                    checked={selectedOfficeCategory === ""}
                    readOnly
                    onClick={() => handleSelect(name, "allOffices")}
                  />
                  {branchTypes &&
                    branchTypes.map(({ name }, index) => (
                      <Form.Check
                        type="radio"
                        label={name}
                        className="office-checkbox walaa-regular-400"
                        key={index}
                        checked={selectedOfficeCategory === name}
                        readOnly
                        aria-label="select office"
                        name="officeCategory"
                        onClick={() => handleSelect(name, "category")}
                      />
                    ))}
                </div>
                <div className="branch-card-wrapper">
                  <React.Fragment>
                    {filteredBranches.length > 0 ? (
                      <React.Fragment>
                        {isMobileOrTablet ? (
                          <BranchCarousel
                            filteredBranch={filteredBranches}
                            activeCardIndex={activeCardIndex}
                            handleCardClick={handleCardClick}
                            commonLabels={commonLabels}
                          />
                        ) : (
                          <React.Fragment>
                            {filteredBranches?.map(
                              (
                                {
                                  title,
                                  address,
                                  phone,
                                  email,
                                  working_hours,
                                  working_days,
                                  working_hours_data,
                                },
                                bIndex
                              ) =>
                                renderBranchCard(
                                  title,
                                  address,
                                  phone,
                                  email,
                                  working_hours,
                                  working_days,
                                  working_hours_data,
                                  bIndex,
                                  commonLabels,
                                  activeCardIndex,
                                  handleCardClick
                                )
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      <div className="branch-card">
                        <h4 className="branch-card-title walaa-medium-500 d-block">
                          {commonLabels?.nobranches_found_label &&
                            commonLabels?.nobranches_found_label}
                        </h4>
                      </div>
                    )}
                  </React.Fragment>
                </div>
              </animated.div>
            </Col>
            <Col xl={8} className="google-map-col">
              <animated.div
                style={isVisible ? springMap : {}}
                className="google-map-wrapper"
              >
                <BranchMap
                  markerList={filteredBranches}
                  selectedMarker={activeCardIndex}
                />
              </animated.div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};
