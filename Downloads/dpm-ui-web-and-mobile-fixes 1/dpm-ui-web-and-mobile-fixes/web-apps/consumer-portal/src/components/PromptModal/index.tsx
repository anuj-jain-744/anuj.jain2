import React from "react";
import style from "./PromptModal.module.scss";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import { Modal } from "react-bootstrap";
import { ThemeButton } from "components/index";
import { LanguageData } from "types/languageData";

interface Props {
    show: boolean;
    onHide: () => void;
    languageData: LanguageData | undefined | null;
    title?: string;
    description?: string;
    onConfirm?: () => void;
}

const PromptModal: React.FC<Props> = ({
    show,
    onHide,
    languageData,
    title,
    description,
    onConfirm
}) => {
    return (
        <Modal show={show} onHide={onHide} className={style.mainContainer} centered>
            <div className={style.container}>
                <div className={style.titleContainer}>
                    <div className={style.titleText}>{title}</div>
                </div>
                <div className={style.frameContainer}>
                    <div className={style.frameText}>{description}</div>
                    <div className={style.frameButtons}>
                        <ThemeButton
                            icon={false}
                            variant="removeNo"
                            isDisabled={false}
                            title={languageData?.no}
                            classes="walaa-medium-500"
                            onClickhandler={onHide}
                        />
                        <ThemeButton
                            icon={false}
                            variant="removeYes"
                            isDisabled={false}
                            title={languageData?.yes_remove}
                            classes="walaa-medium-500"
                            onClickhandler={onConfirm}
                        />
                    </div>
                </div>
                <button className={style.closeIcon} onClick={onHide}>
                    <img src={closeIcon} alt="close icon" />
                </button>
            </div>
        </Modal>
    );
}

export default PromptModal;