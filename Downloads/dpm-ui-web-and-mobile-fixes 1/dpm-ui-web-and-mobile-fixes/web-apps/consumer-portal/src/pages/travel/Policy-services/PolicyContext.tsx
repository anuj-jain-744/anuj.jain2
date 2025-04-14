import React, {
    createContext,
    useState,
    ReactNode,
    useMemo,
  } from "react";
  export interface TravelPolicyContextProps {

    reviewPolicy: {[key: string] : any} | null;
    setReviewPolicy: React.Dispatch<React.SetStateAction<{[key: string] : any} | null>>;
    refundPolicy: {[key: string] : any} | null;
    setRefundPolicy: React.Dispatch<React.SetStateAction<{[key: string] : any} | null>>;

  }
  export const TravelPolicyContext = createContext<TravelPolicyContextProps | undefined>(
    undefined
  );
  export const TravelPolicyProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [reviewPolicy, setReviewPolicy] = useState<{[key: string] : any} | null>(null);
    const [refundPolicy, setRefundPolicy] = useState<{[key: string] : any} | null>(null);
    const TravelPolicyContextValue = useMemo(() => ({
        reviewPolicy,
        setReviewPolicy,
        refundPolicy,
        setRefundPolicy,
    }), [
        reviewPolicy,
        setReviewPolicy,
        refundPolicy,
        setRefundPolicy,
    ]);

    return (
        <TravelPolicyContext.Provider value={TravelPolicyContextValue}>
          {children}
        </TravelPolicyContext.Provider>
      );
  }