import { useEffect, useState } from "react";
import { useApiCall } from "@dpm/shared-module";

import SuccessTopComponent from "./SuccessTopComponent";
import SuccessRightComponent from "./SuccesRightComponent";
import SuccessBottomComponent from "components/Footer";
import SuccessLeftComponent from "./LeftSuccess";
import "./style.scss";
import { CmsPayment } from "components/PaymentOptions/types/cmsPayment";
import { PolicyDetailsObj } from "types/policyDetails";
import { useNavigate , useLocation} from "react-router-dom";

interface SuccessProps {
  status: boolean;
  data: PolicyDetailsObj | null;
  flag?: boolean;
  claimData?: { [key: string]: unknown };
  isCancelSuccess?:boolean;
  handleNavigate?: (url: string)=>void
}

function Success({
  status,
  data,
  flag = false,
  claimData,
  isCancelSuccess,
  handleNavigate
}: Readonly<SuccessProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const isRefresh = sessionStorage.getItem("isRefresh");

  const [endPolicyNo, setEndoPolicyNo] = useState<string>("");
  const [driverBenefit, setDriverBenefit] = useState<string>("");
  const { makeApiCall: cmsPaymentApiCall, data: paymentLang } = useApiCall<
  {
    config: CmsPayment;
  },
  unknown
>(1, "payment-config", "get");

  const { makeApiCall, data: langData } = useApiCall(
    1,
    "consumerportal-config",
    "get"
  );
  useEffect(() => {
    makeApiCall();
  }, [makeApiCall]);

useEffect(() => {
  cmsPaymentApiCall();
}, []);

  useEffect(() => {
    if (isRefresh) {
      sessionStorage.removeItem("isRefresh");
      handleNavigate && handleNavigate("/dashboard");
    }
  }, [isRefresh]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();

      const userDetails = sessionStorage.getItem("userDetails");

      if (userDetails) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
    
  }, [navigate, location.pathname]);

  return (
    <>
      <div className="success-container-main">
        <SuccessTopComponent
          typeCode
          status={status}
          data={data}
          flag={flag}
          loading={loading}
          claimData={claimData}
          endPolicyNo={endPolicyNo}
          driver= {driverBenefit}
          isCancelSuccess={isCancelSuccess ?? false}
        />
        <div className="cards-container">
          <div className="col-6">
            {paymentLang && <SuccessLeftComponent
              data={data}
              isCancelSuccess={isCancelSuccess ?? false}
              status={status}
              setLoading={setLoading}
              loading={loading}
              claimData={claimData}
              paymentLang={paymentLang}
              setEndoPolicyNo={setEndoPolicyNo}
              handleNavigate={handleNavigate}
              langData={langData?.config?.[0] ?? {}}
              setDriverBenefit = {setDriverBenefit}
            />}
          </div>
          <div className="col-6">
          {!loading && 
              <SuccessRightComponent 
                flag={flag} 
                paymentLang={paymentLang?.config}
              />
            }
          </div>
        </div>
      </div>
      {flag && <SuccessBottomComponent />}
    </>
  );
}

export default Success;
