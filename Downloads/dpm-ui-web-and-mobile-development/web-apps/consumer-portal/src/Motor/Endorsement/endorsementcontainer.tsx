import { useLocation } from "react-router-dom";
import Endorsement from "./endorsement";
import { useState } from "react";

interface Props {
  navigateTo?: (url: string) => void;
}

function EndorsementContainer({navigateTo}: Readonly<Props>) {
  const [allPolicy, setAllPolicy] = useState<string[]>([]);

  const location = useLocation();
  const policyDetailObj = location.state?.data || {};

  return (
    <div>
      <Endorsement policyDetailObj={policyDetailObj} navigateTo={navigateTo} allPolicy={allPolicy}/>
    </div>
  );
}

export default EndorsementContainer;