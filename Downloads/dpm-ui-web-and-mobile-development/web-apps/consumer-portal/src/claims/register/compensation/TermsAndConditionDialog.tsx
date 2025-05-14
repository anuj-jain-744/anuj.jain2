import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface TermsAndConditionDialogProps {
    showDialog: boolean;
    setShowDialog: (show: boolean) => void;
    languageData: {
        title_for_terms_conditions: string;
        content_terms_conditions: string;
        ok: string;
    };
}

function TermsAndConditionDialog(props: Readonly<TermsAndConditionDialogProps>) {
    const handleClose = () => props.setShowDialog(false);
    return (
        <div>
            <Modal
                show={props.showDialog}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className="register-new-claim-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="walaa-medium-500">
                        {props?.languageData?.title_for_terms_conditions}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column registration-det-body">
                        <div className="fw-medium">
                            <span
                                dangerouslySetInnerHTML={{ __html: props?.languageData?.content_terms_conditions }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="register-call2action walaa-medium-500"
                        onClick={handleClose}
                    >
                        {props?.languageData?.ok}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TermsAndConditionDialog;
