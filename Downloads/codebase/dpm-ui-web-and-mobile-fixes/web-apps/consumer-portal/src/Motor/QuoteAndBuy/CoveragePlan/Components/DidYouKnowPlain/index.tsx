import { Card } from "react-bootstrap";
import Idea from "assets/DidYouKnowCard/Idea.svg";
import { LanguageData } from "types/languageData";
import { sanitizeHtml } from "@dpm/shared-module";
import { TRAVEL } from "constant";

interface Props {
  languageData?: LanguageData;
  productCode?: string;
}
const ShowHomeDidYouKnow = ({ languageData }: { languageData?: LanguageData }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(languageData?.did_you_know_quote_buy) }} />
  );
}
const DidYouKnowPlain = ({ languageData, productCode }: Props) => {
  return (
    <Card className="did-you-know-card-container">
      <div>
        <img src={Idea} alt="idea" />
      </div>
      <div>
        <div className="head walaa-medium-500">
        {productCode === TRAVEL ? languageData?.did_you_know_text : `${languageData?.did_you_know}?`}
        </div>
        <div className="content-box walaa-regular-400">{productCode === TRAVEL ? languageData?.did_you_know_description : <ShowHomeDidYouKnow languageData={languageData} />}</div>
      </div>
    </Card>
  );
};

export default DidYouKnowPlain;
