import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import Delete from "assets/QuoteAndBuy/Delete.svg";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import { AlertBox } from "components/AlertBox";
import style from "Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal.module.scss";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { commonKeywords } from "constant";
import { ConfirmBox } from "components/ConfirmBox";
import { LanguageData } from "types/languageData";

interface BenefitProps {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData | undefined | null;
}

const ContentBenefitsModal: React.FC<BenefitProps> = ({
  show,
  onHide,
  languageData,
}) => {
  const [showAddBenefModal, setShowAddBenefModal] = useState(show);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [benefitsData, setBenefitsData] = useState({ category: '', value: '', errors: { category: '', value: '' } });
  const { setHomePremiumResponse, requestPayload, updateRequestPayload } = useQuoteAndBuyContext();
  const {
    selectedContetBenefits,
    setSelectedContetBenefits,
    apiErrorMessage,
    setApiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    resetApiErrorMessage,
  } = usePHQuoteBuyContext();
  const [tempBenefits, setTempBenefits] = useState(null);

  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi();

  const {
    contentBenefitsMaxSAR,
    contentBenefitsMinSAR
  } = commonKeywords;

  useEffect(() => {
    setShowAddBenefModal(show);
  }, [show]);


  useEffect(() => {
    if (data && !isLoadingCalculatePremium) {
      if (tempBenefits?.requestPayload) {
        updateRequestPayload(tempBenefits.requestPayload);
      }
      setHomePremiumResponse(data);
      if (tempBenefits?.type === 'add') {
        setSelectedContetBenefits((prev) => prev?.map(function (item) {
          if (item?.type) {
            delete item?.type;
          }
          return item;
        }));
        setShowAddBenefModal(false);
        onHide();
      }
      if (tempBenefits?.type === 'delete') {
        const data = [...selectedContetBenefits];
        data.splice(tempBenefits?.removeId, 1);
        setSelectedContetBenefits(data);
      }
      setTempBenefits(null);
    }
  }, [data, isLoadingCalculatePremium])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setTempBenefits(null);
      setShowAlertModal(true);
      setApiErrorMessage({
        title: isError?.name || languageData?.internal_server_error,
        description: isError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [isError, isLoadingCalculatePremium])

  const handleClose = () => {
    const findNewItems = selectedContetBenefits?.filter((item) => item?.type === 'additional');
    if (findNewItems?.length) {
      setShowConfirmModal(true);
    } else {
      setShowAddBenefModal(false);
      onHide();
    }
  };

  const handleModalYes = () => {
    setShowConfirmModal(false);
  }

  const handleModalNo = () => {
    setSelectedContetBenefits((prev) => prev?.filter((data) => data?.type !== 'additional'));
    setShowConfirmModal(false);
    setShowAlertModal(false);
    setShowAddBenefModal(false);
    onHide();
  }

  const getTotalPrice = (value: string) => {
    const totalBenfitsValue = selectedContetBenefits.reduce((accm, item) => accm + Number(item?.value), 0);
    const totalValue = totalBenfitsValue + Number(value);
    return totalValue;
  }

  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBenefitsData((prev) => ({
      ...prev,
      [name]: value
    }))
    validateInputOnBlur(value, name);
  };

  const updatedValueOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBenefitsData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const validateInputOnBlur = (input: string, inputName: string) => {
    const regex = /^\d{0,9}$/;
    switch (inputName) {
      case 'value':
        setBenefitsData((prev) => ({
          ...prev,
          'errors': { ...prev?.errors, value: '' }
        }));
        if (input && !regex.test(input)) {
          setBenefitsData((prev) => ({
            ...prev,
            'errors': { ...prev?.errors, value: languageData?.invalid_value }
          }));
        }
        if (Number(input) < contentBenefitsMinSAR) {
          setBenefitsData((prev) => ({
            ...prev,
            'errors': { ...prev?.errors, value: languageData?.kindly_declare_properties }
          }));
        }
        if (getTotalPrice(input) > contentBenefitsMaxSAR) {
          setBenefitsData((prev) => ({
            ...prev,
            'errors': { ...prev?.errors, value: languageData?.total_value_should_not_exceed }
          }));
        }
        break;
      default:
        break;
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
    if (!policyCoverage[declarationIndex]?.declarationItem) {
      policyCoverage[declarationIndex]['declarationItem'] = [];
    }
    makeDeclarationItems(selectedContetBenefits, policyCoverage[declarationIndex]?.declarationItem)
    setTempBenefits({ requestPayload, type: 'add' });
    handleCalculatePremium(requestPayload);
  }

  const handleAddBenefit = () => {
    const declarationIndex = selectedContetBenefits.findIndex((data) => data?.category === benefitsData?.category)
    if (declarationIndex !== -1) {
      setShowAlertModal(true);
      setApiErrorMessage({
        title: languageData?.category_already_added
      });
    } else if (getTotalPrice(benefitsData?.value) > contentBenefitsMaxSAR) {
      setShowAlertModal(true);
      setApiErrorMessage({
        title: languageData?.total_value_should_not_exceed
      });
    }else {
      setSelectedContetBenefits((prevBenefits) => [
        ...prevBenefits,
        { type: 'additional', category: benefitsData?.category, value: benefitsData?.value },
      ]);
      setBenefitsData({ category: '', value: '', errors: { category: '', value: '' } })
    }
  };

  const handleRemoveBenefit = async (idx: number, category: string) => {
    const policyCoverage = requestPayload.policyRisk[0]?.policyCoverage;
    const declarationIndex = policyCoverage?.findIndex((data) => data?.coverageCode === languageData?.defaultCoverageCode)
    const item = policyCoverage[declarationIndex]?.declarationItem;
    const checkInItem = item?.findIndex(value => value?.itemDescription === category)
    if (item && checkInItem !== -1) {
      item.splice(checkInItem, 1);
      if (policyCoverage && item?.length === 0) {
        delete policyCoverage[declarationIndex]?.declarationItem;
      }

      setTempBenefits({ requestPayload, type: 'delete', removeId: idx });
      await handleCalculatePremium(requestPayload);
    } else {
      const data = [...selectedContetBenefits];
      data.splice(idx, 1);
      setSelectedContetBenefits(data);
    }
  };

  const isEnableAdd = () => {
    if (!benefitsData?.category || !benefitsData?.value) {
      return true;
    }
    if (benefitsData?.errors?.value) {
      return true;
    }
    return false;
  }

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  return (
    <Modal
      show={showAddBenefModal}
      onHide={handleClose}
      className={`add-driver-pop ${style.mainContainer}`}
      centered
    >
      <div className={style.modalContainer}>
        <ConfirmBox
          title={languageData?.content_benefits_title}
          showConfirmModal={showConfirmModal}
          setConfirmYes={handleModalYes}
          setConfirmNo={handleModalNo}
          languageData={languageData}
        />
        <AlertBox
          title={apiErrorMessage.title}
          description={apiErrorMessage.description}
          showAlertModal={showAlertModal}
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
                    className={`benef-row ${benefit.type === 'additional' ? 'recent-added' : ''}`}
                  >
                    <div className="benef-content">
                      <div className="bene-val">{languageData?.field_category}</div>
                      <div className="bene-head">
                        {benefit.category}
                      </div>
                    </div>
                    <img className="line" src={verticleLine} alt="verticleLine" />
                    <div className="benef-content">
                      <div className="bene-val">{languageData?.value_is_sar}</div>
                      <div className="bene-head">
                        {benefit.value}
                      </div>
                    </div>
                    <button
                      className="action"
                      onClick={() => handleRemoveBenefit(idx, benefit.category)}
                    >
                      {(tempBenefits && tempBenefits?.type === 'delete') ? languageData?.loading :
                        <img className="delete" src={Delete} alt="delete" />
                      }
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
                        title={'Category'}
                        name="category"
                        value={benefitsData.category}
                        placeholder={'Enter Category'}
                        onChangehandler={updatedValue}
                      />
                    </div>
                  </div>
                  <div className="benefits-column">
                    <div className="bene-head">{languageData?.value_is_sar}</div>
                    <div>
                      <ThemeTextbox
                        type="text"
                        title={'Value'}
                        name="value"
                        value={benefitsData.value}
                        placeholder={'Enter Value'}
                        onChangehandler={updatedValue}
                        onBlurhandler={updatedValueOnBlur}
                        errorValue={benefitsData.errors.value}
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
              <button
                className="btn bordered-btn"
                disabled={!selectedContetBenefits.length}
                onClick={updateBenefits}
              >
                {(tempBenefits && tempBenefits?.type === 'add') ? languageData?.loading : languageData?.update}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal >
  );
};

export default ContentBenefitsModal;