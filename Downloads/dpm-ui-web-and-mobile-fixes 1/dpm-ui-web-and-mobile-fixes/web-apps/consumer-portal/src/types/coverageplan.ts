
export interface IDetails {
  id: number;
  itemname: string;
}

export type ICoveragePlanData = {
  title: string;
  key: string;
  details: IDetails[];
};

export type CompensationTypeKeys = "comprehensive" | "thirdparty" | "buildingcontents" | "contents";

export type SelectPlanTypeKeys = "worldwide" | "worldwide_except_usa" | "europe";

export const IWorldwide: string = "worldwide";
export const IworldwideExcept: string = "worldwide_except_usa";
export const IEuropedata:string= "europe"
