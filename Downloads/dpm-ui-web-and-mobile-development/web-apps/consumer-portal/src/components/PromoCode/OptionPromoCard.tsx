import "./index.scss";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";


interface OptionPromoCardProps {
    mainHeading: string;
    mainContent: string;
    subHeading: string;
    inputBox: {
        placeholder: string;
        onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
        value: string;
        isButtonEnabled?: boolean;
        buttonTitle: string;
        onClickhandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
        errorMessage: string;
        isActive?: boolean;
    }
}
export function OptionPromoCard({
    mainHeading,
    mainContent,
    subHeading,
    inputBox,
}: OptionPromoCardProps) {
    return (
        <div className={`option-promo-card ${inputBox?.isActive ? "promo-card-active": ""}`}>
            <div className="main-heading-content">
                <p className="main-heading walaa-medium-500">{mainHeading}</p>
                <p className="main-content walaa-regular-400">{mainContent}</p>
            </div>
            <div className="promo-code-form-content">
                <p className="sub-heading walaa-regular-400">{subHeading}</p>
                <div className="promo-code-form">
                    <ThemeTextbox
                        name="promoCode"
                        placeholder={inputBox?.placeholder}
                        onChangehandler={inputBox?.onChangehandler}
                        value={inputBox?.value}
                        errorMessage={inputBox?.errorMessage} 
                        parentClasses="d-flex flex-sm-column testbox-width" 
                    />
                    <ThemeButton 
                        isDisabled={inputBox?.isButtonEnabled ?? false}
                        title={inputBox.buttonTitle}
                        classes={"h-fit-content"} 
                        onClickhandler={inputBox?.onClickhandler}
                    />
                </div>
            </div>
        </div>
    )
}
