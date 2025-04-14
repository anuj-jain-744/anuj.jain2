import { useLocation } from "react-router-dom";
import Endorsement from "./endorsement";

interface Props {
  navigateTo?: (url: string) => void;
  travelData: string;
}

function EndorsementContainer({ navigateTo, travelData }: Readonly<Props>) {
  const location = useLocation();
  const { policyNo, allPolicy } = location.state || {};

  return (
    <div>
      <Endorsement policyNo={policyNo} navigateTo={navigateTo} allPolicy={allPolicy} travelData={travelData} />
    </div>
  );
}

export default EndorsementContainer;