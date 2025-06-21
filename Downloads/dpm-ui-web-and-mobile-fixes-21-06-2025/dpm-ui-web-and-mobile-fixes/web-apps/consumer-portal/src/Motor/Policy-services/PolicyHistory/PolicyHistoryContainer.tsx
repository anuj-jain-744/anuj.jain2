import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PolicyHistory from "./PolicyHistory";
import { usePolicyHistory } from "../../../hook/dashboard/usePolicyHistory";
import { useDispatch } from "react-redux";
import { slices } from "@dpm/shared-module";

interface Props {
  navigateTo?: (url: string) => void;
}

function PolicyHistoryContainer({ navigateTo }: Props) {

  const location = useLocation();
  const policyData = location?.state?.data;

  const dispatch = useDispatch();
  const { setpolicyHistory, setpolicyHistoryLoading, setpolicyHistoryError } =
    slices.policyHistorySlice;
  const {policyNo, nationalID, productCode} = policyData;

  const { data, isLoading, error } = usePolicyHistory({
    nationalId: nationalID,
    includeEndoVersion: "Y",
    policyNo: policyNo,
    productCode: null,
  });

  useEffect(() => {

      dispatch(setpolicyHistoryLoading(isLoading));
      if (data)dispatch(setpolicyHistory(data?.data?.result));
      if (error)
        dispatch(
          setpolicyHistoryError(
            (error as Error).message || "An error occurred at getPolicyList"
          )
        );
  }, [ data, error, isLoading ]);

  return (
    <div>
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    </div>
  );
}

export default PolicyHistoryContainer;
