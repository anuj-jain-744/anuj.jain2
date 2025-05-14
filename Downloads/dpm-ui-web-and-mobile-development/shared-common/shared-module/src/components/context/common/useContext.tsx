import { useContext } from "react";
import { CommonContext } from "./context";
import { CommonContextType } from "../../types";

const useCommonContext = (): CommonContextType => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error("useCommonContext must be used within a CommonProvider");
  }
  return context;
};

export { useCommonContext };
