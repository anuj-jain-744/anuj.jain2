import React, { memo } from "react";
import { Modal } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import "./style.scss";

interface ICoverageDowngradeAlert {
  userName: string;
  languageData: LanguageData | undefined | null;
  clickHandlerRenewDowngrade: (val: string) => void;
  isCoverageTypeDowngrading: boolean;
}

const CoverageDowngradeAlert: React.FC<ICoverageDowngradeAlert> = memo(({
  clickHandlerRenewDowngrade,
  isCoverageTypeDowngrading,
  languageData,
  userName
}) => {
  return (
    <Modal
      show={isCoverageTypeDowngrading}
      centered
      onHide={() => clickHandlerRenewDowngrade("close")}
      className="coverage-downgrade-alert"
      backdrop="static" // Prevent closing on outside click
      keyboard={false}   // Prevent closing on ESC key
      data-testid="coverage-downgrade-alert-modal"
    >
      <Modal.Header className="walaa-medium-500">{languageData?.please_note}</Modal.Header>
      <Modal.Body className="walaa-regular-500">
        <div>
          {userName},&nbsp;{languageData?.you_currently_have_compreh}
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
});

export default CoverageDowngradeAlert;
