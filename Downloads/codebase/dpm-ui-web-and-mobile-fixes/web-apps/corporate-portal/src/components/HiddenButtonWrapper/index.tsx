import "./index.scss";

interface HiddenButtonWrapperProps {
  children: React.JSX.Element;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  tabIndex?: number;
  className?: string;
}
export const HiddenButtonWrapper: React.FC<HiddenButtonWrapperProps> = ({
  children,
  onClick,
  onKeyDown,
  tabIndex,
  className,
}): React.JSX.Element => {
  const handleKeyDownEvent = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onKeyDown) {
      e.preventDefault();
      onKeyDown(e);
    }
  };
  return (
    <button
      className={`hidden-button ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDownEvent}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
};
