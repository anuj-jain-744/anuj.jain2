import { useState, useCallback } from "react";
import { ListIcon, GridIcon } from "../../assets/common";
import "./index.scss";

const layout = [
  { icon: ListIcon, type: "list" },
  { icon: GridIcon, type: "grid" },
];

interface LayoutTabProps {
  activeLayout: string;
  handleLayout: (layout: string) => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({ activeLayout, handleLayout }) => {
  const [activeTab, setActiveTab] = useState<string>(activeLayout);

  const handleTab = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      handleLayout(tab);
    },
    [handleLayout]
  );

  return (
    <div className="layout-switch d-flex">
      {layout.map(({ icon, type }, index) => (
        <div
          key={index}
          onClick={() => handleTab(type)}
          className={`${
            activeTab === type ? "active-layout" : ""
          } icon-wrapper`}
        >
          <img src={icon} alt={`${type} icon`} />
        </div>
      ))}
    </div>
  );
};