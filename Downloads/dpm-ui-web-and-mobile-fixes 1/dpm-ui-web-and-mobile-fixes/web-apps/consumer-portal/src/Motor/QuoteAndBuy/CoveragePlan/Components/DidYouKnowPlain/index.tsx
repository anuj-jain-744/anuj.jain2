import { Card } from "react-bootstrap";
import Idea from "assets/DidYouKnowCard/Idea.svg";
import { DummyText } from "utils/DummyText";
import { LanguageData } from "types/languageData";

interface IDidYouKnowPlain {
  languageData: LanguageData | undefined | null;
}
const DidYouKnowPlain: React.FC<IDidYouKnowPlain> = ({ languageData }) => {
  return (
    <Card className="did-you-know-card-container">
      <div>
        <img src={Idea} />
      </div>
      <div>
        <div className="head walaa-medium-500">
        {languageData?.title === "Travel Insurance" ? languageData.did_you_know_text : `${languageData?.did_you_know}?`}
        </div>
        <div className="content-box walaa-regular-400">{languageData?.title === "Travel Insurance" ? languageData.did_you_know_description : DummyText(0, 125)}</div>
      </div>
    </Card>
  );
};

export default DidYouKnowPlain;
