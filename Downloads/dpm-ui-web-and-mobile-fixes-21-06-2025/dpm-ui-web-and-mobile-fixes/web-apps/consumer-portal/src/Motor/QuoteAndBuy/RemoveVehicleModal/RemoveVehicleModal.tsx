import React from "react";
import style from "./RemoveVehicleModal.module.scss";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import { Modal } from "react-bootstrap";
import { ThemeButton } from "components/index";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface Props {
    show: boolean;
    onHide: () => void;
    navigateTo?: (url: string) => void;
    leftStep?: number;
    setLeftStep?: (val: number) => void;
    languageData: LanguageData | undefined | null;
    title?: string;
    description?: string;
    onConfirm?: () => void;
}

const RemoveVehicleModal: React.FC<Props> = ({
    show, 
    onHide, 
    languageData, 
    setLeftStep, 
    title, 
    description,
    onConfirm
}) => {
    const { driverDetailsResponseData, setDriverDetailsResponseData } = useQuoteAndBuyContext();
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            if (Array.isArray(driverDetailsResponseData) && driverDetailsResponseData.length > 1) {
                setDriverDetailsResponseData([driverDetailsResponseData[0]]);
            }
            setLeftStep && setLeftStep(0);
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide} className={style.mainContainer} centered>
            <div className={style.container}>
                <div className={style.titleContainer}>
                    <div className={style.titleText}>{title || languageData?.remove_vehicle}</div>
                </div>
                <div className={style.frameContainer}>
                    <div className={style.frameText}>{description || languageData?.are_you_sure_you_want_to}</div>
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
                            onClickhandler={handleConfirm}
                        />
                    </div>
                </div>
                <div className={style.closeIcon} onClick={onHide}>
                    <img src={closeIcon} alt="close icon" />
                </div>
            </div>
        </Modal>
    );
}

export default RemoveVehicleModal;