import React from "react";
import "./index.scss";
import { Card } from "react-bootstrap";
import { AlertBox } from "components/AlertBox";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import Delete from "assets/QuoteAndBuy/delete.svg";
import { getCurrencySymbol } from "@app-shell/utils/common";

interface BenefitProps {
  languageData: LanguageData | undefined | null;
}

const ContentBenefitsModal: React.FC<BenefitProps> = ({
  languageData,
}) => {
  const {
    selectedContetBenefits,
    setSelectedContetBenefits,
    apiErrorMessage,
    setApiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    resetApiErrorMessage,
  } = usePHQuoteBuyContext();

  const { repairTypeSelected } = useQuoteAndBuyContext();

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
  }

  const repairSelection = repairTypeSelected?.replace(/\s+/g, '').toLowerCase();
  const declartionValidation = repairSelection && languageData?.declartion_limit[repairSelection];

  const validateField = (name: string, value: string, totalValue: number) => {
    const regexValue = /^\d{0,9}$/;
    const regexCategory = /^[a-zA-Z0-9._-\s/()&]+$/;
    const isCategoryExists = selectedContetBenefits.filter((item: { category: string }) => (item?.category?.toLowerCase() === value?.toLowerCase() && name === 'category'))
    switch (name) {
      case 'category':
        if (!value.trim()) return languageData?.category_is_required;
        if (!regexCategory.test(value)) return languageData?.invalid_value;
        if (isCategoryExists.length > 1) return languageData?.category_already_added;
        return '';
      case 'value':
        if (!value.trim()) return languageData?.value_is_required;
        if (!regexValue.test(value)) return languageData?.invalid_value;
        if (Number(value) < declartionValidation?.min) return declartionValidation?.errormessage2;
        if (totalValue > declartionValidation?.max) return declartionValidation?.errormessage1;
        return '';
      default:
        return '';
    }
  };

  const handleFormChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const data: { [key: number]: string }[] = [...selectedContetBenefits];
    data[index][name] = value;

    // Validate on change
    validationUpdate(name, value, data, index);
  };

  const handleBlur = (index: number, field: string) => {
    const data: { [key: number]: string }[] = [...selectedContetBenefits];
    // Validate on blur
    validationUpdate(field, data[index][field], data, index)
  };

  // Handle errors for content benefits 
  const handleContentBenefitsErrors = (data: [], index: number, totalValue: number, declartionValidation: {max: string}) => {
    const filteredByIndex = data.filter((item, dataIndex) => dataIndex !== index && item.errors.value);
    if ((!data[index].category && !data[index].value) || (filteredByIndex.length && totalValue < declartionValidation?.max)) {
      for (const item in data) {
        data[item].errors.value = '';
        data[item].errors.category = '';
      }
    }
  }

  const validationUpdate = (field: string, value: string, data: { [key: number]: string }[], index: number) => {
    // Validate on blur
    const totalValue = selectedContetBenefits.reduce((accm, item: { value: string }) => accm + Number(item.value), 0);
    const error = validateField(field, value, totalValue) ?? "";
    handleContentBenefitsErrors(data, index, totalValue, declartionValidation);
    data[index].errors = { ...data[index].errors, [field]: error };
    setSelectedContetBenefits(data);
  }


  const addFields = () => {
    const totalValue = selectedContetBenefits?.reduce((accm, item: { value: string }) => accm + Number(item?.value), 0);
    if (totalValue > declartionValidation?.max) {
      setShowAlertModal(true);
      setApiErrorMessage({
        title: declartionValidation?.errormessage1
      });
      return;
    }
    setSelectedContetBenefits([
      ...selectedContetBenefits,
      {
        category: '',
        value: '',
        errors: { category: '', value: '' }
      }
    ]);
  };

  const isDisabled = () => {
    const formValidation = selectedContetBenefits?.filter((item: { value: string, category: string, errors: { value: string, category: string } }) => (!item?.category || !item?.value) || (item?.errors?.category || item?.errors?.value))
    return Boolean(formValidation?.length);
  }

  const removeFields = (index: number) => {
    const data = [...selectedContetBenefits];
    data.splice(index, 1);
    setSelectedContetBenefits(data);
  };

  return (
    <Card className="content-benefits-container-wrapper">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleModalClose}
      />
      <div className="header-wrapper">
        <div className="header walaa-medium-500">
          {languageData?.content_benefits_title}
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="content-description">{getCurrencySymbol(declartionValidation?.content)}</div>
      {selectedContetBenefits?.length ?
        <div className="content-benefits-wrapper">
          <div className="benefits-column">
            <div className="bene-head">{languageData?.field_category}</div>
          </div>
          <div className="benefits-column">
            <div className="bene-head">{getCurrencySymbol(languageData?.value_is_sar)}</div>
          </div>
        </div> : ''
      }
      {selectedContetBenefits?.map((form, index) => (
        <div key={form.itemDescription + index} className="content-benefits-wrapper">
          <div className="benefits-column">
            <ThemeTextbox
              type="text"
              title={''}
              name="category"
              classes="content-benefits-textbox-wrapper"
              parentClasses="content-benefits-textbox"
              value={form?.category}
              placeholder={languageData?.enter_category}
              onChangehandler={(event) => handleFormChange(index, event)}
              onBlurhandler={() => handleBlur(index, 'category')}
              errorMessage={form?.errors?.category && getCurrencySymbol(form?.errors?.category)}
            />
          </div>
          <div className="benefits-column">
            <ThemeTextbox
              type="text"
              title={''}
              name="value"
              maxLength={7}
              value={form?.value}
              placeholder={languageData?.enter_value}
              classes="content-benefits-textbox-wrapper"
              parentClasses="content-benefits-textbox"
              onChangehandler={(event) => handleFormChange(index, event)}
              onBlurhandler={() => handleBlur(index, 'value')}
              errorMessage={form?.errors?.value && getCurrencySymbol(form?.errors?.value)}
            />
          </div>
          <div className="butn-delete-wrapper">
            <button
              type="button"
              onClick={() => removeFields(index)}
              className="mt-8 p-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <img src={Delete} alt={languageData?.delete} />
            </button>
          </div>
        </div>
      ))}
      <hr className="horizontal-line" />
      <div className="content-benefits-container-btn">
        <ThemeButton
          classes={"content-benefits-container-btn"}
          isDisabled={isDisabled()}
          title={selectedContetBenefits?.length === 0 ? languageData?.add_content : languageData?.add_more_benefits}
          variant="outline"
          icon={Boolean(selectedContetBenefits?.length)}
          onClickhandler={addFields}
          iconName="Plus" />
      </div>
    </Card>
  );
};

export default ContentBenefitsModal;