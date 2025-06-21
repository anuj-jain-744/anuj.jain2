import { Card } from "react-bootstrap";
import Idea from "assets/DidYouKnowCard/Idea.svg";
import { LanguageData } from "types/languageData";
import { sanitizeHtml } from "@dpm/shared-module";

interface IDidYouKnowPlain {
  languageData: LanguageData | undefined | null;
}
const ShowHomeDidYouKnow = ({languageData}) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(languageData?.did_you_know_quote_buy) }} />
  );
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
        <div className="content-box walaa-regular-400">{languageData?.title === "Travel Insurance" ? languageData.did_you_know_description : <ShowHomeDidYouKnow languageData={languageData} />}</div>
      </div>
    </Card>
  );
};

export default DidYouKnowPlain;
