import React, { useEffect, useState } from "react";
import "./index.scss";

const DECREMENT_VALUE = -1;

interface CounterComponentProps {
  maxLimit: number;
  onTotalChange: (type: string, change: number) => void;
  type: string;
  defaultValue?: number;
  defaultCount: number;
}

const CounterComponent: React.FC<CounterComponentProps> = ({
  maxLimit,
  onTotalChange,
  type,
  defaultValue,
  defaultCount = 0,
}) => {
  const [count, setCount] = useState<number>(defaultValue || defaultCount);

  const handleIncrement = () => {
    if (count < maxLimit) {
      setCount(count + 1);
      onTotalChange(type, 1);
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
      onTotalChange(type, DECREMENT_VALUE);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setCount(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="counter-component">
      <button
        className="minusbtn"
        onClick={handleDecrement}
        disabled={count <= defaultCount}
      >
        -
      </button>
      <input className="counter-text" type="text" value={count} readOnly />
      <button
        className="plusbtn"
        onClick={handleIncrement}
        disabled={count >= maxLimit}
      >
        +
      </button>
    </div>
  );
};

export default CounterComponent;
