import { useLocation } from "react-router-dom";
import CancelPolicy from "./CancelPolicies";

function CancelPolicyContainer({ navigateTo }) {

  const location = useLocation();
  const policyDataObj = location.state.data;

  return (
    <div>
      <CancelPolicy policyDataObj={policyDataObj} navigateTo={navigateTo} />
    </div>
  );
}

export default CancelPolicyContainer;
