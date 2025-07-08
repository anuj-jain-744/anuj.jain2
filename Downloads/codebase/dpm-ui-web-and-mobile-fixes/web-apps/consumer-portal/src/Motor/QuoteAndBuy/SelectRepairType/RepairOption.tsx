import { useState } from "react";
import data from "./RepairType.json";
import ThemeRadioCheckbox from "components/ThemeRadioCheckbox/ThemeRadioCheckbox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { Modal } from "react-bootstrap";

const RepairOption = ({
  price,
  name,
  index,
  onViewBenefitsClick,
  onChangehandler,
  isRepairTypeSelected,
  languageData,
  totalOptions,
  handleTooltipClick,
  coverageType
}) => {
  const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
  const mostPopular = Array.isArray(languageData?.most_popular_coverage_plans);
  let isPopular = 0;
  if (mostPopular) {
    // Most Popular plan  items 
    const mostPurchased = languageData?.most_popular_coverage_plans?.findIndex((value: { is_popular: number, name: string }) => Number(value?.is_popular) === 1 && value?.name === name)
    if (mostPurchased !== -1) {
      isPopular = 1;
    }
  }
  const handleRefNoClose = () => setRefNoShow(false);

  // This function is called when the user clicks on the "View Benefits" link
  // to prevent the event from bubbling up to the parent div
  const viewBenefitsOnClick = (name: string) => (event) => {
    event.stopPropagation();
    onViewBenefitsClick(name);
  }

  const coverageTypeOnClick = (name: string) => (event) => {
    event.stopPropagation();
    onChangehandler(name)
  }
  return (
    <div
      className={`repair-option-container ${totalOptions <= 2 ? `twooptions ${coverageType} ` : ""
        }option-${index + 1}`}
      onClick={coverageTypeOnClick(name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          e.preventDefault();
          onChangehandler(name);
        }
      }}
    >
      <Modal
        show={isRefNoModal}
        centered
        onHide={handleRefNoClose}
        className="floors-dialog-box"
      >
        <Modal.Header closeButton>
          {languageData?.guidelines_title}
        </Modal.Header>
      </Modal>
      {isPopular ? (
        <div className="most-popular">{languageData?.most_popular}</div>
      ) : (
        ""
      )}
      <div className="inner-one">
        <div className="repair-radio">
          <ThemeRadioCheckbox
            label={""}
            type="radio"
            classes="repair-radio-btn"
            checked={isRepairTypeSelected}
            name="repairType"
            onChangehandler={onChangehandler}
          />
        </div>
        <div>
          <div className="repair walaa-medium-500">
            <div>{name}</div>
            <div>
              <button onClick={handleTooltipClick}>
                <InfoOutlinedIcon className="home-tool-tip-icon" />
              </button>
            </div>
          </div>
          <div className="price walaa-regular-400">
            <span className="amount walaa-medium-500">
              {getAmountWithIcon(price)}
            </span>
          </div>
          <div
            className="pop-up-link walaa-regular-400"
            onClick={viewBenefitsOnClick(name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.preventDefault();
                viewBenefitsOnClick(name);
              }
            }}
          >
            {data.viewBenefits}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairOption;