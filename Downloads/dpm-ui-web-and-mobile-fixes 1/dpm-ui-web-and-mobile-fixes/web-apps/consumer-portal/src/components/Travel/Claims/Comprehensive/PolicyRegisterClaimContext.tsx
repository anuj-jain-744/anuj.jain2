import React, {
    createContext,
    useState,
    ReactNode,
    useMemo,
  } from "react";
  export interface TravelRegusterClaimContextProps {

    reviewPolicy: {[key: string] : any} | null;
    setReviewPolicy: React.Dispatch<React.SetStateAction<{[key: string] : any} | null>>;
    refundPolicy: {[key: string] : any} | null;
    setRefundPolicy: React.Dispatch<React.SetStateAction<{[key: string] : any} | null>>;

  }
  export const TravelRegisterClaimContext = createContext<TravelRegusterClaimContextProps | undefined>(
    undefined
  );
  export const TravelRegisterClaimProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [reviewPolicy, setReviewPolicy] = useState<{[key: string] : any} | null>(null);
    const [refundPolicy, setRefundPolicy] = useState<{[key: string] : any} | null>(null);
    const TravelRegisterClaimContextValue = useMemo(() => ({
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
        <TravelRegisterClaimContext.Provider value={TravelRegisterClaimContextValue}>
          {children}
        </TravelRegisterClaimContext.Provider>
      );
  }