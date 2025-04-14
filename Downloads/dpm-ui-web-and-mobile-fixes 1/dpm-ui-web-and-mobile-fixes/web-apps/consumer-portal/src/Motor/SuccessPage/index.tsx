import { useEffect, useState } from "react";
import SuccessTopComponent from "./SuccessTopComponent";
import SuccessRightComponent from "./SuccesRightComponent";
import SuccessBottomComponent from "components/Footer";
import SuccessLeftComponent from "./LeftSuccess";
import { useApiCall } from "@dpm/shared-module";
import "./style.scss";
import { LanguageData } from "types/languageData";

interface SuccessProps {
  status: boolean;
  data: LanguageData;
  flag?: boolean;
  claimData?: { [key: string]: unknown };
  isCancelSuccess:boolean;
}

function Success({
  status,
  data,
  flag = false,
  claimData,
  isCancelSuccess
}: Readonly<SuccessProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const { makeApiCall, data: langData } = useApiCall(
    1,
    "consumerportal-config",
    "get"
  );
  useEffect(() => {
    makeApiCall();
  }, [makeApiCall]);

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
        />
        <div className="cards-container">
          <div className="col-6">
            <SuccessLeftComponent
              data={data}
              isCancelSuccess={isCancelSuccess}
              status={status}
              setLoading={setLoading}
              loading={loading}
              claimData={claimData}
              langData={langData?.config?.[0] ?? {}}
            />
          </div>
          <div className="col-6">
            {!loading && <SuccessRightComponent flag={flag} />}
          </div>
        </div>
      </div>
      {flag && <SuccessBottomComponent />}
    </>
  );
}

export default Success;
