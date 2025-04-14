import React from "react";
import "./index.scss";
import { CeoSection } from "components/BoardofManagement";
import { ManagementTeam } from "components/ManagementTeam";

export interface MangeDataProps {
  title: string,
  designation: string,
  content: string,
  image_url: string,
  image_alt: string,
  weight: string,
  member_role_name: string
}
 interface teamHeading{
  walaa_team_title:string;

 }
interface BoardMangementProps { 
   managementData: Array<MangeDataProps>;
   teamHeading:teamHeading;
  
}

export const BoardofManagement: React.FC<BoardMangementProps> = ({ 
  managementData, 
  teamHeading
  
}) => {
   return (
  <div className="board-of-managemnet-main">
   <CeoSection ceoData={managementData?.content[0]} />    
   <ManagementTeam teamData={managementData?.content.slice(1)} teamHeading={teamHeading} />
  </div>
)};
