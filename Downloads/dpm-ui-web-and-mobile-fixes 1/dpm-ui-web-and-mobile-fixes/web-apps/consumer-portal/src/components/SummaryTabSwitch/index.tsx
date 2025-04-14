import { useEffect, useState } from "react";
import { LeftPanel, ActiveLeftPanel } from "assets/CommonSVG";
import "./index.scss";

interface SummaryTabSwitchProps {
  handleCanvas: (show: boolean) => void;
  label: string;
}

const SummaryTabSwitch: React.FC<SummaryTabSwitchProps> = ({
  handleCanvas,
  label,
}) => {
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const previewTimer1 = setTimeout(() => {
      setShowPreview(true);
      const previewTimer2 = setTimeout(() => {
        setShowPreview(false);
      }, 1500);
      return () => clearTimeout(previewTimer2);
    }, 1000);
    return () => clearTimeout(previewTimer1);
  }, []);

  const handleExpandTab = () => {
    handleCanvas(true);
  };

  return (
    <div
      className={`summary-tab ${showPreview ? "preview" : ""}`}
      onClick={handleExpandTab}
    >
      <img src={showPreview ? ActiveLeftPanel : LeftPanel} alt="panel-svg" />
      <div className="widget-text-wrapper">
        {showPreview && (
          <span className="widget-text walaa-medium-500">{label}</span>
        )}
      </div>
    </div>
  );
};

export default SummaryTabSwitch;
