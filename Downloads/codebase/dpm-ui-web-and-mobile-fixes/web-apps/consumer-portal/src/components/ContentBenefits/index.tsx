import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import { LoaderOverlay } from "@app-shell/components/Loader";
import Delete from "assets/QuoteAndBuy/delete.svg";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import { AlertBox } from "components/AlertBox";
import style from "Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { commonKeywords } from "constant";
import { ConfirmBox } from "components/ConfirmBox";
import { LanguageData } from "types/languageData";
import { getAmountWithIcon, getCurrencySymbol } from "@app-shell/utils/common";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";


interface BenefitProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData | undefined | null;
}

interface StateEventProps {
  requestPayload: CalculatePremiumApiPayload | null;
  type: string | null;
  removeId?: number;
  loading: boolean;
  confirmModal?: boolean;
  benefitModal?: boolean;
  errorTitle?: string | undefined;
  errorDescription?: string | undefined;
}

const ContentBenefitsModal: React.FC<BenefitProps> = ({
  show,
  onHide,
  languageData,
}) => {
  const [benefitsData, setBenefitsData] = useState({ category: '', value: '', errors: { category: '', value: '' } });
  const { setHomePremiumResponse, requestPayload, updateRequestPayload } = useQuoteAndBuyContext();
  const {
    selectedContetBenefits,
    setSelectedContetBenefits
  } = usePHQuoteBuyContext();

  const [tempBenefits, setTempBenefits] = useState<StateEventProps>({
    requestPayload: null,
    type: null,
    removeId: -1,
    loading: false,
    errorTitle: "",
    errorDescription: "",
    confirmModal: false,
    benefitModal: show
  });

  const DELETE = 'delete';
  const ADD = 'add';
  const ADDITIONAL = 'additional';

  // set premium calculation hooks
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();

  const {
    contentBenefitsMaxSAR,
    contentBenefitsMinSAR
  } = commonKeywords;

  // get the premium calculation success response from the API
  useEffect(() => {
    if (data && !isLoadingCalculatePremium && !isError && tempBenefits?.requestPayload) {
      updateRequestPayload(tempBenefits.requestPayload);
      if (tempBenefits?.type === ADD) {
        setSelectedContetBenefits((prev) => prev?.map(function (item) {
          // delete the property type "additional" from the list
          if (item?.type) {
            delete item?.type;
          }
          return item;
        }));
        onHide();
      }
      if (tempBenefits?.type === DELETE) {
        const data = [...selectedContetBenefits];
        data.splice(Number(tempBenefits?.removeId), 1);
        setSelectedContetBenefits(data);
      }
      setTempBenefits((prevProps) => ({
        ...prevProps,
        requestPayload: null,
        type: null,
        removeId: -1,
        loading: false,
      }));
      setHomePremiumResponse(data);
    }
  }, [data, isLoadingCalculatePremium])

  // get the premium calculation error response from the API
  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setTempBenefits((prevProps) => ({
        ...prevProps,
        errorTitle: isError?.name || languageData?.internal_server_error,
        errorDescription: isError.messages?.message_en ?? languageData?.something_went_wrong,
        loading: false
      }));
    }
  }, [isError, isLoadingCalculatePremium])

  const handleClose = () => {
    const findNewItems = newlyAddedBenfits();
    if (findNewItems) {
      setTempBenefits((prevProps) => ({
        ...prevProps,
        confirmModal: true
      }));
    } else {
      onHide();
    }
  };

  // confirmation box for handling to stay the content benefits added as new
  const handleModalYes = () => {
    setTempBenefits((prevProps) => ({
      ...prevProps,
      confirmModal: false
    }));
  }

  // confirmation box for handling to add newly added benefits when close it
  const handleModalNo = () => {
    updateBenefits();
  }

  // sum the total amount from the content benefits
  const getTotalPrice = (value: string) => {
    const totalBenfitsValue = selectedContetBenefits?.reduce((accm, item) => accm + Number(item?.value), 0);
    const totalValue = totalBenfitsValue + Number(value);
    return totalValue;
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Validate on change
    validationUpdate(name, value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Validate on blur
    validationUpdate(name, value)
  };

  const validationUpdate = (field: string, value: string) => {
    // Validate on blur
    const error = validateField(field, value) ?? "";

    setBenefitsData((prev) => ({
      ...prev,
      [field]: value,
      'errors': { ...prev?.errors, [field]: error }
    }));
  }

  const validateField = (name: string, value: string) => {
    const regexValue = /^\d{0,9}$/;
    const regexCategory = /^[a-zA-Z0-9._-\s/()&]+$/;
    const isCategoryExists = selectedContetBenefits.filter((item: { category: string }) => (item?.category?.toLowerCase() === value?.trim().toLowerCase()))
    switch (name) {
      case 'category':
        if (!regexCategory.test(value) && value) return languageData?.invalid_value;
        if (isCategoryExists?.length >= 1 && value) return languageData?.category_already_added;
        return '';
      case 'value':
        if (!regexValue.test(value) && value) return languageData?.invalid_value;
        if (Number(value) < contentBenefitsMinSAR && value) return languageData?.kindly_declare_properties;
        if (getTotalPrice(value) > contentBenefitsMaxSAR && value) return languageData?.total_value_should_not_exceed;
        return '';
      default:
        return '';
    }
  };

  const makeDeclarationItems = (data: [], declarationItems: { itemDescription: string, sarValue: string }[]) => {
    data.forEach((item: { category: string, value: string }) => {
      const checkInItem = declarationItems?.findIndex(value => value?.itemDescription === item?.category);
      if (checkInItem === -1) {
        declarationItems.push({ itemDescription: item.category, sarValue: item.value })
      }
    })
    return declarationItems;
  }

  const updateBenefits = () => {
    const policyCoverage = requestPayload?.policyRisk[0]?.policyCoverage;
    const declarationIndex = policyCoverage?.findIndex((data) => data?.coverageCode === languageData?.defaultCoverageCode)
    // if content benefits already existing in payload, need to add new content benefits too.
    if (policyCoverage[declarationIndex]?.declarationItem === undefined) {
      policyCoverage[declarationIndex]['declarationItem'] = [];
    }
    makeDeclarationItems(selectedContetBenefits, policyCoverage[declarationIndex]?.declarationItem)
    setTempBenefits((prevProps) => ({
      ...prevProps,
      requestPayload,
      type: ADD,
      loading: true
    }));
    handleCalculatePremium(requestPayload);
  }

  // first check the content benefits to added or not and if not then add new one
  const handleAddBenefit = () => {
    const declarationIndex = selectedContetBenefits.findIndex((data) => data?.category === benefitsData?.category)
    if (declarationIndex !== -1) {
      setTempBenefits((prevProps) => ({
        ...prevProps,
        errorTitle: languageData?.category_already_added
      }));
    } else if (getTotalPrice(benefitsData?.value) > contentBenefitsMaxSAR) {
      setTempBenefits((prevProps) => ({
        ...prevProps,
        errorTitle: languageData?.total_value_should_not_exceed
      }));
    } else {
      setSelectedContetBenefits((prevBenefits) => [
        ...prevBenefits,
        { type: ADDITIONAL, category: benefitsData?.category, value: benefitsData?.value },
      ]);
      setBenefitsData({ category: '', value: '', errors: { category: '', value: '' } })
    }
  };

  const handleRemoveBenefit = async (idx: number, category: string) => {
    const policyCoverage = requestPayload.policyRisk[0]?.policyCoverage;
    const declarationIndex = policyCoverage?.findIndex((data) => data?.coverageCode === languageData?.defaultCoverageCode)
    const item = policyCoverage[declarationIndex]?.declarationItem;
    const checkInItem = item?.findIndex(value => value?.itemDescription === category)
    // handling to remove the content benefits from context and calculate premium API
    if (item && checkInItem !== -1) {
      item.splice(checkInItem, 1);
      // delete the declaration items when empty data is happened
      if (policyCoverage && item?.length === 0) {
        delete policyCoverage[declarationIndex]?.declarationItem;
      }

      setTempBenefits((prevProps) => ({
        ...prevProps,
        requestPayload,
        type: DELETE,
        removeId: idx,
        loading: true
      }));
      await handleCalculatePremium(requestPayload);
    } else {
      const data = [...selectedContetBenefits];
      data.splice(idx, 1);
      setSelectedContetBenefits(data);
    }
  };

  // check the add button to enable or not if fill all form fields 
  const isEnableAdd = () => {
    if (!benefitsData?.category || !benefitsData?.value) {
      return true;
    }
    if (benefitsData?.errors?.value) {
      return true;
    }
    return false;
  }

  // close the error message alert box
  const handleModalClose = () => {
    setTempBenefits((prevProps) => ({
      ...prevProps,
      errorTitle: "",
      errorDescription: ""
    }));
  }

  const newlyAddedBenfits = () => {
    const findNewItems = selectedContetBenefits?.filter((item) => item?.type === ADDITIONAL);
    return Boolean(findNewItems.length);
  }

  return (
    <Modal
      show={tempBenefits?.benefitModal}
      onHide={handleClose}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      {tempBenefits?.loading && <LoaderOverlay />}
      <div className={style.modalContainer}>
        <ConfirmBox
          title={languageData?.content_benefits_title}
          showConfirmModal={Boolean(tempBenefits?.confirmModal)}
          setConfirmYes={handleModalYes}
          setConfirmNo={handleModalNo}
          languageData={languageData}
        />
        <AlertBox
          title={tempBenefits?.errorTitle}
          description={tempBenefits?.errorDescription}
          showAlertModal={Boolean(tempBenefits?.errorTitle && tempBenefits?.errorDescription)}
          setShowAlertModal={handleModalClose}
        />
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.content_benefits_title}</div>
          <button onClick={handleClose}>
            <img
              src={closeIcon}
              alt="close icon"
              className={style.modalCloseIcon}
            />
          </button>
        </div>

        <div className={style.body}>
          <div className={style.fixedContent}>
            <div className="manage-benefits">
              <div className="add-bene-heading">
                {languageData?.current_content_benefits_added}
              </div>
              <div className="selected-benefits">
                {selectedContetBenefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className={`benef-row ${benefit.type === ADDITIONAL ? 'recent-added' : ''}`}
                  >
                    <div className="benef-content">
                      <div className="bene-val">{languageData?.field_category}</div>
                      <div className="bene-head">
                        {benefit.category}
                      </div>
                    </div>
                    <img className="line" src={verticleLine} alt="verticleLine" />
                    <div className="benef-content">
                      <div className="bene-val">{getCurrencySymbol(languageData?.value_is_sar)}</div>
                      <div className="bene-head">
                        {getAmountWithIcon(benefit.value)}
                      </div>
                    </div>
                    <button
                      className="action"
                      onClick={() => handleRemoveBenefit(idx, benefit.category)}
                    >
                      <img className="delete" src={Delete} alt={DELETE} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="available-benefits">
                <div className="add-bene-heading">
                  {languageData?.add_additional_content_benefits}
                </div>
                <div className="content-benefits">
                  <div className="benefits-column">
                    <div className="bene-head">{languageData?.field_category}</div>
                    <div>
                      <ThemeTextbox
                        type="text"
                        title={''}
                        name="category"
                        classes="content-benefits-textbox-wrapper"
                        parentClasses="content-benefits-textbox"
                        value={benefitsData.category}
                        placeholder={languageData?.enter_category}
                        onChangehandler={handleFormChange}
                        onBlurhandler={handleBlur}
                        errorMessage={benefitsData.errors.category && getCurrencySymbol(benefitsData.errors.category)}
                      />
                    </div>
                  </div>
                  <div className="benefits-column">
                    <div className="bene-head">{getCurrencySymbol(languageData?.value_is_sar)}</div>
                    <div>
                      <ThemeTextbox
                        type="text"
                        title={''}
                        name="value"
                        classes="content-benefits-textbox-wrapper"
                        parentClasses="content-benefits-textbox"
                        value={benefitsData.value}
                        maxLength={7}
                        placeholder={languageData?.enter_value}
                        onChangehandler={handleFormChange}
                        onBlurhandler={handleBlur}
                        errorMessage={benefitsData.errors.value && getCurrencySymbol(benefitsData.errors.value)}
                      />
                    </div>
                  </div>
                  <div className="butn-div">
                    <button
                      className="btn bordered-btn"
                      disabled={isEnableAdd()}
                      onClick={handleAddBenefit}
                    >
                      {languageData?.add_label}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-benefits-btn">
              <ThemeButton
                classes={"btn bordered-btn"}
                isDisabled={!newlyAddedBenfits()}
                title={languageData?.update}
                variant="outline"
                onClickhandler={updateBenefits}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal >
  );
};

export default ContentBenefitsModal;