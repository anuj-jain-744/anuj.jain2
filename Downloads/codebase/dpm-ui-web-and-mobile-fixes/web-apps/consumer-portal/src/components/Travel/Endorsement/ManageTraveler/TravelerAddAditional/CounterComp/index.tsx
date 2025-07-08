import React, { useState } from "react";
import { TOTAL_LIMIT } from "../../../../../../constant";
import "./index.scss";

const DECREMENT_VALUE = -1;

interface CounterComponentProps {
  maxLimit: number;
  totalLimit: number;
  onTotalChange: (type: string, change: number) => void;
  type: string;
  step?: number;
  countReceived?: number;
  currentCounts: {
    adult: number;
    child: number;
    srCitizen: number;
  };
}

const CounterComponent: React.FC<CounterComponentProps> = ({
  maxLimit,
  totalLimit,
  onTotalChange,
  type,
  step = 1,
  currentCounts,
}) => {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = () => {
    setCount(count + 1);
    onTotalChange(type, 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
      onTotalChange(type, DECREMENT_VALUE);
    }
  };

  const isIncrementDisabled = () => {
    const { child, adult, srCitizen } = currentCounts;
    const total = child + adult + srCitizen;
    const remainingTotal = TOTAL_LIMIT - total;

    const isTotalLimitReached = remainingTotal <= 0 || total >= TOTAL_LIMIT;
    const isMaxLimitReached = count >= maxLimit;

    const isChildLimitReached = type === "child" && (count >= 6 || child >= 6);
    const isAdultSrLimitReached =
      (type === "adult" || type === "srCitizen") &&
      (adult === 2 || (adult > 0 && srCitizen > 0));

    return (
      isTotalLimitReached ||
      isMaxLimitReached ||
      isChildLimitReached ||
      isAdultSrLimitReached
    );
  };

  const isDecrementDisabled = () => {
    return count <= 0;
  };
  return (
    <div className="counter-component">
      <button
        className="minusbtn"
        onClick={handleDecrement}
        disabled={isDecrementDisabled()}
      >
        -
      </button>

      <input className="counter-text" type="text" value={count} readOnly />

      <button
        className="plusbtn"
        onClick={handleIncrement}
        disabled={isIncrementDisabled()}
      >
        +
      </button>
    </div>
  );
};

export default CounterComponent;
