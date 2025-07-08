import React from "react";
import "./index.scss";
import { ManagementTeam } from "components/ManagementTeam";
import { Chairman } from "components/Chairman";


export interface MangeDataProps {
  title: string,
  designation: string,
  content: string,
  image_url: string,
  image_alt: string,
  weight: string,
  member_role_name: string
}
interface teamHeading {
  walaa_team_title: string;

}

interface MangeChairmanDataProps {
  title: string;
  designation: string;
  content: string;
  image_url: string;
  image_alt: string,
  weight: string;
  member_role_name: string
}
interface BoardDirectorProps {
  directorsData: Array<MangeDataProps>;
  teamHeading: teamHeading;
  ChairmanData: Array<MangeChairmanDataProps>;

}


export const BoardofDirector: React.FC<BoardDirectorProps> = ({
  directorsData,
  teamHeading,

}) => {
  return (
    <div className="board-of-managemnet-main">
      <Chairman ChairmanData={directorsData?.content?.slice(0, 1)} />
      <ManagementTeam teamData={directorsData?.content?.slice(1)} teamHeading={teamHeading} />
    </div>
  )
};
