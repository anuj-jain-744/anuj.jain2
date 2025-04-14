import ThemeButton from "components/ThemeComponents/ThemeButton";
import React from "react";
import { Modal } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss"
import { dummyUser } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";

interface ICoverageDowngradeAlert {
  languageData: LanguageData | undefined | null;
  clickHandlerRenewDowngrade: (val: string) => void;
  isCoverageTypeDowngrading: boolean;
}

const CoverageDowngradeAlert: React.FC<ICoverageDowngradeAlert> = ({
  clickHandlerRenewDowngrade,
  isCoverageTypeDowngrading,
  languageData,
}) => {
  return (
    <Modal
      show={isCoverageTypeDowngrading}
      centered
      onHide={() => clickHandlerRenewDowngrade("close")}
      className="coverage-downgrade-alert"
    >
      <Modal.Header className="walaa-medium-500">{languageData?.please_note}</Modal.Header>
      <Modal.Body className="walaa-regular-500">
        <div>
          {dummyUser},&nbsp;{languageData?.you_currently_have_compreh}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ThemeButton
          classes="register-call2action2 btn-link btn-cancel"
          isDisabled={false}
          title={languageData?.cancel as string}
          onClickhandler={() => clickHandlerRenewDowngrade("cancel")}
        />
        <ThemeButton
          classes="register-call2action walaa-medium-500"
          isDisabled={false}
          title={languageData?.switch_to_third_party as string}
          onClickhandler={() => clickHandlerRenewDowngrade("switch")}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CoverageDowngradeAlert;
