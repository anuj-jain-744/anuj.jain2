import React, { forwardRef} from "react";
import "./sliderTile.scss"
import { LanguageData } from "types/languageData";
import { getAmountText } from "@dpm/shared-module";

interface SliderTileProps {
  heading: string;
  sliderValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currencySymbol: string | React.ReactNode;
  minMaxValues?: number[];
  infoText?: string;
  infoImage?: string;
  sliderType?: string;
  languageData?: LanguageData;
}

interface SliderBackgroundParams {
  value: number;
  min: number;
  max: number;
}

interface ThumbPositionParams {
  sliderRef: React.RefObject<HTMLDivElement>;
  value: number;
  min: number;
  max: number;
}

const SliderTile = forwardRef<HTMLDivElement, SliderTileProps>(({
  heading,
  sliderValue,
  min,
  max,
  step,
  onChange,
  currencySymbol,
  minMaxValues,
  infoText,
  infoImage,
  sliderType,
  languageData
},ref) => {

  const getSliderBackground = ({value, min, max}: SliderBackgroundParams): string => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #185A7D ${percentage}%, #E8EFF2 ${percentage}%)`;
  };

  const calculateThumbPosition = ({sliderRef, value, min, max}: ThumbPositionParams): number => {
    if (!sliderRef?.current) return 0;
    const sliderWidth = sliderRef.current.offsetWidth;
    const percentage = (value - min) / (max - min);
    return percentage * sliderWidth;
  };

  const thumbPosition = calculateThumbPosition({ sliderRef: ref as React.RefObject<HTMLDivElement>, value: sliderValue, min, max });
  const sliderBackground = getSliderBackground({ value: sliderValue, min, max });

  const adjustedThumbPositionPriceBlockForLesserSliderValue = sliderType === languageData?.sum_insured
    ? thumbPosition + 38 : thumbPosition + 30; 

  const adjustedThumbPositionPriceBlockForGreaterSliderValue = sliderType === languageData?.sum_insured
    ? thumbPosition - 38 : thumbPosition - 36;

  return (
    <div className="slider-tile">
      <div className="slider-heading walaa-medium-500">{heading}</div>
      <div className="slider-container" ref={ref}>
        <input
        className="myinput"
          type="range"
          value={sliderValue}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          style={{ background: sliderBackground }}
          aria-label={heading.toLowerCase()}
        />
        <span
          className="current-value walaa-medium-500"
          style={{
            left: sliderValue <= min + (max - min) * 0.1
              ? `${adjustedThumbPositionPriceBlockForLesserSliderValue}px`
              : sliderValue >= max - (max - min) * 0.1
              ? `${adjustedThumbPositionPriceBlockForGreaterSliderValue}px`
              : `${thumbPosition}px`,
          }}
        >
          {currencySymbol}
          {getAmountText(sliderValue.toString())}
        </span>
        <span
          className="slider-value"
          style={{
            left: sliderValue <= min + (max - min) * 0.1
              ? `${thumbPosition + 12}px`
              : sliderValue >= max - (max - min) * 0.1
              ? `${thumbPosition - 12}px` // Adjust to avoid overlap
              : `${thumbPosition}px`,
          }}
        ></span>
        <div className="min-max">
          {minMaxValues &&
            minMaxValues.map((val, idx) => (
              <div className="slider-values" key={`value-${idx}`}>
                {getAmountText(val.toString())}
              </div>
            ))}
        </div>
      </div>
      {infoText && (
        <div className="max-idv">
          {infoImage && <img src={infoImage} className="max-dev-info-img" />}
          <div className="max-idv-text walaa-regular-400">{infoText}</div>
        </div>
      )}
    </div>
  );
});

export default SliderTile;