import { useContext } from "react";
import { DataContext } from "../../DataContext";

function ReferenceTooltip() {
  //cms content
  const Data = useContext(DataContext);

  return (
    <div dangerouslySetInnerHTML={{ __html: Data?.registration_popup }}></div>
  );
}

export default ReferenceTooltip;
