import "./index.scss"
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";


function PersonalAdd() {
  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  return (
    <div className="rootContainers">
      <div className="imgStyle">
        <img src={languageData?.sidebar_image1} alt="sidebar image1" /> 
      </div>
      <div className="viewContainers innerContainer">
        <div className="boosty-text walaa-medium-500">
          {languageData?.sidebar_image1_title}
        </div>
        <div className="add-domestic walaa-regular-400">
          {languageData?.sidebar_image1_desc}
        </div>
        <div className="buttonClick1">
          <button className="buttonClick walaa-medium-500" type="submit">{languageData?.sidebar_image1_buttontext}</button>
        </div>
      </div>
    </div>
  );
}

export default PersonalAdd;