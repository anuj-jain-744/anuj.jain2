import React from "react";
import "./index.scss";
import { Card } from "react-bootstrap";
import { AlertBox } from "components/AlertBox";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import Delete from "assets/QuoteAndBuy/Delete.svg";

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

  const validateField = (name:string, value:string) => {
    const regex = /^\d{0,9}$/;
    const totalValue = selectedContetBenefits.reduce((accm, item:{value:string}) => accm + Number(item.value), 0);
    const isCategoryExists = selectedContetBenefits.filter((item:{category:string}) => (item?.category?.toLowerCase() === value?.toLowerCase() && name === 'category'))
    switch (name) {
      case 'category':
        if (!value.trim()) return languageData?.category_is_required;
        if (isCategoryExists.length > 1) return languageData?.category_already_added;
        return '';
      case 'value':
        if (!value.trim()) return languageData?.value_is_required;
        if (!regex.test(value)) return languageData?.invalid_value;
        if (Number(value) < declartionValidation?.min) return declartionValidation?.errormessage2;
        if (totalValue > declartionValidation?.max) return declartionValidation?.errormessage1;
        return '';
      default:
        return '';
    }
  };

  const handleFormChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const data = [...selectedContetBenefits];
    data[index][name] = value;

    // Validate on change
    const error = validateField(name, value);
    data[index].errors = {
      ...data[index].errors,
      [name]: error
    };

    setSelectedContetBenefits(data);
  };

  const handleBlur = (index:number, field:string) => {
    const data = [...selectedContetBenefits];
    // Validate on blur
    const error = validateField(field, data[index][field]);
    data[index].errors = {
      ...data[index].errors,
      [field]: error
    };

    setSelectedContetBenefits(data);
  };


  const addFields = () => {
    const totalValue = selectedContetBenefits?.reduce((accm, item:{value:string}) => accm + Number(item?.value), 0);
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
    const formValidation = selectedContetBenefits?.filter((item:{value:string, category:string, errors:{value:string,category:string}}) => (!item?.category || !item?.value) || (item?.errors?.category || item?.errors?.value))
    return formValidation?.length;
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
      <div className="content-description">{declartionValidation?.content}</div>
      {selectedContetBenefits?.length ?
        <div className="content-benefits-wrapper">
          <div className="benefits-column">
            <div className="bene-head">{languageData?.field_category}</div>
          </div>
          <div className="benefits-column">
            <div className="bene-head">{languageData?.value_is_sar}</div>
          </div>
        </div> : ''
      }
      {selectedContetBenefits?.map((form, index) => (
        <div key={index} className="content-benefits-wrapper">
          <div className="benefits-column">
            <ThemeTextbox
              type="text"
              title={'category'}
              name="category"
              value={form?.category}
              placeholder={languageData?.enter_category}
              onChangehandler={(event) => handleFormChange(index, event)}
              onBlurhandler={() => handleBlur(index, 'category')}
              errorValue={form?.errors?.category}
            />
          </div>
          <div className="benefits-column">
            <ThemeTextbox
              type="text"
              title={'value'}
              name="value"
              value={form?.value}
              placeholder={languageData?.enter_value}
              onChangehandler={(event) => handleFormChange(index, event)}
              onBlurhandler={() => handleBlur(index, 'value')}
              errorValue={form?.errors?.value}
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
          icon={selectedContetBenefits?.length === 0 ? false : true}
          onClickhandler={addFields}
          iconName="Plus" />
      </div>
    </Card>
  );
};

export default ContentBenefitsModal;