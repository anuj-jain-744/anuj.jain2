import { ModalBody } from "react-bootstrap";

import successIcon from "assets/Claims/GreenSuccess.svg";

export default function SuccessCelebration({successMessage}: {successMessage: string}) {
    return (
        <ModalBody>
            <div className="promo-success-content">
                <img src={successIcon} alt="Green Success Icon" />
                <p className="walaa-medium-500">
                    {successMessage}
                </p>
            </div>
        </ModalBody>
    )
}