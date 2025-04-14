import { DeclarationProps } from "components/DeclarationCard";
import { TooltipProps } from "react-bootstrap";

interface LanguageData {
  [key: string]: string;
}

interface FooterData {
  copyright: string;
  Privacy: {
    data: [{ linkName: string }];
  };
}

interface TravelData {
  [key: string]: string;
}


interface CoveragePlan{
  title:string;
  key:string;
  codeid:string;
  details:{
    id:number;
    itemname:string;
  }[];
}
interface TravelData {
  otp_validity_expired_msg: string;
  coverage_type:string;
  travel_coverage_plan:CoveragePlan[];
  did_you_know_text:string;
  did_you_know_description:string;
  choose_your_plan_heading: string,
  choose_your_plan_description: string,
  title?:string;
  compare_benefits?:string;
  starting_from:string
  tooltip: {
    key: string;
    title: string;
    value: string;
  }[];

  cause_of_loss: {
    code: string;
    value: string;
  }[];


}

interface CombinedData extends LanguageData, TravelData, DeclarationProps {}

export type { LanguageData, CombinedData ,TravelData, FooterData};

 