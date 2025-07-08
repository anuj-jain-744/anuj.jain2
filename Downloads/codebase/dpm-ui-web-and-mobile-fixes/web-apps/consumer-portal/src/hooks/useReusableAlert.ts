import { useState } from "react";

export const useReusableAlert = () => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });

  const triggerAlert = (title: string, description: string) => {
    setApiErrorMessage({ title, description });
    setShowAlertModal(true);
  };

  return {
    apiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    triggerAlert,
  };
};