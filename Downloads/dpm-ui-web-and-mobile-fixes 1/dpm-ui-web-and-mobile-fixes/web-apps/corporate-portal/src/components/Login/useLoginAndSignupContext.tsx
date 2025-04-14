import { useContext } from "react";
import { LoginAndSingupContext } from "./LoginandSignupContext";

export const useLoginAndSignupContext = () => {
  const context = useContext(LoginAndSingupContext);
  if (!context) {
    throw new Error(
      "LoginAndSingupContext must be used within a LoginAndSignup"
    );
  }
  return context;
};