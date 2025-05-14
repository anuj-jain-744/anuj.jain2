//import { useLocation } from "react-router-dom";
import CancelPolicy from "./CancelPolicy";
import { useLocation } from "react-router-dom";
import { TravelPolicyProvider } from "../PolicyContext";

function CancelPolicyContainer({ navigateTo }) {
  const location = useLocation();
  const policyDataObj = location.state?.data;
  return (
    <div>
      <TravelPolicyProvider>
        <CancelPolicy policyDataObj={policyDataObj} navigateTo={navigateTo} />
      </TravelPolicyProvider>
    </div>
  );
}

export default CancelPolicyContainer;
