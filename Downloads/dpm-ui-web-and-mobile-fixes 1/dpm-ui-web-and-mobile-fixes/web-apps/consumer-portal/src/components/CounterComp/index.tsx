import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';

const TOTAL_LIMIT = 8;
const DECREMENT_VALUE = -1;

interface CounterComponentProps {
    maxLimit: number;
    totalLimit: number;
    onTotalChange: (type: string, change: number) => void;
    type: string;
    step?: number;
    countReceived?:number;
    defaultValue?:number;
    defaultCount:number;
  }
  
  const CounterComponent: React.FC<CounterComponentProps> = (
    { maxLimit, totalLimit, onTotalChange, type, step=1, countReceived, defaultValue, defaultCount = 0  }) => {
   

  const [count, setCount] = useState<number>(defaultCount);

 
    const handleIncrement = () => {
      if (count < maxLimit && totalLimit < TOTAL_LIMIT) {
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
      if (step === 3 && countReceived !== undefined) {
        setCount(countReceived);
      }
    }, [step, countReceived]);
  
 
    useEffect(() => {
      if (defaultValue !== undefined) {
        setCount(defaultValue); 
      }
    }, [defaultValue]);
   
   
  
    return (
      <div className="counter-component">
        <button className='minusbtn' onClick={handleDecrement} disabled={ count <= defaultCount}>-</button> 
        <input className='counter-text' type="text" value={count} readOnly /> 
        <button className='plusbtn' onClick={handleIncrement} disabled={count === maxLimit || totalLimit >= TOTAL_LIMIT}>+</button>
      </div>
    );
  };
  
  export default CounterComponent;