import { useNavigate } from "react-router-dom";
import { useCommonContext, triggerClickOnChatwidget } from "@dpm/shared-module";
import { commonTexts } from "@src/constants";
import { navigateTo } from "@utils";

export const useNavigationHandler = () => {
  const { setTriggerLogin } = useCommonContext();
  const { loginRoute, chatbotRoute } = commonTexts;
  const navigate = useNavigate();

  return (url: string, data?: {[key:string]: unknown}) => {
    switch (url) {
      //Trigger Login when route equals /login
      case loginRoute:
        setTriggerLogin(true);
        break;
      //Trigger Chatbot when route equals /chatbot
      case chatbotRoute:
        triggerClickOnChatwidget();
        break;
      default:
        //Navigate to the given url
        navigateTo(url, navigate, data);
        break;
    }
  };
};
