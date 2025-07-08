import React from "react";
import "./index.scss";
import { KnowMoreUrlProps } from "../../components/RelatedLink/KnowMore";
import { Support, QualityWidget, VisibilityWrapper } from "../../components";
import { SubNavBar } from "../../components";
import { ManagementTeam } from "../../components";
import { OurJourney } from "../../components";
import { AboutSection } from "../../components";

export interface AcadamyProps {
  content: string;
  relatedTitle?: string;
  relatedlink?: KnowMoreUrlProps[];
  tabs: [];
  visionmission: string;
  missionCards: [];
  quality: string;
  qualityIcons: [];
  creditTitle: string;
  creditData: [];
  ourJourneyData: string;
  ourJourneyVideo: string;
  isVisible?: boolean;
}

export const AboutWalaa: React.FC<AcadamyProps> = ({
  content,
  qualityIcons,
  quality,
  missionCards,
  visionmission,
  ourJourneyData,
  ourJourneyVideo,
  tabs,
  creditTitle,
  creditData,
  relatedTitle,
  relatedlink,
  isVisible = true,
}) => {
  const regex = /<h3>(.*?)<\/h3>/;
  const isParallexEnable = true;
  const missionTitle = visionmission ? visionmission.match(regex) : null;
  const removeH3 = /<h3>.*?<\/h3>/;
  const removeTag = visionmission ? visionmission.replace(removeH3, "") : null;
  const missionDesc = removeTag ? removeTag.replace("<br>", "") : "";
  const creditRatingTitle = creditTitle ? creditTitle.match(regex) : [];
  const creditDesc = creditTitle ? creditTitle.replace(removeH3, "") : "";
  const creditRatingData = creditData ? creditData : [];
  const creditRatingTitleDesc = {
    desc: creditDesc,
    walaa_team_title: creditRatingTitle ? creditRatingTitle[1] : "",
  }

  return (
    <>


      <div className="About_section">
        {tabs &&
            <SubNavBar content={tabs} />
        }

        <div className="mid-container ">
          {content && relatedTitle && relatedlink &&
            <VisibilityWrapper isParallex={isParallexEnable}>
              <AboutSection content={content} isVisible={isVisible} relatedTitle={relatedTitle} relatedlink={relatedlink}/>
            </VisibilityWrapper>
          }
          {ourJourneyData && ourJourneyVideo &&
            <VisibilityWrapper isParallex={isParallexEnable}>
              <OurJourney content={ourJourneyData} video_url={ourJourneyVideo} isVisible={isVisible} />
            </VisibilityWrapper>
          }
          <div id="productToggle-2" className="training-section">
            {missionCards &&
              <VisibilityWrapper isParallex={isParallexEnable}>
                <Support
                  supportData={missionCards}
                  title={missionTitle ? missionTitle[1] : ""}
                  description={missionDesc}
                  className="bottom-margin"
                  carouselSetFlag={true}
                  isVisible={isVisible}
                />
              </VisibilityWrapper>
            }
          </div>

          {quality &&
            <VisibilityWrapper isParallex={isParallexEnable}>
              <QualityWidget data={quality} icons={qualityIcons} isVisible={isVisible} />
            </VisibilityWrapper>
          }
          {creditRatingData && creditRatingTitleDesc &&
            <VisibilityWrapper isParallex={isParallexEnable}>
              <ManagementTeam
                teamData={creditRatingData}
                teamHeading={creditRatingTitleDesc}
                isVisible={isVisible}
              />
            </VisibilityWrapper>
          }
        </div>
      </div>
    </>
  );
};
