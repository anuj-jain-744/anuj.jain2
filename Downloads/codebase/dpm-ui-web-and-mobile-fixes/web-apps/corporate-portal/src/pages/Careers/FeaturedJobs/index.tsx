import React from "react";
import { useNavigate } from 'react-router-dom';
import "./index.scss";
import { Container } from "react-bootstrap";
import { animated } from "@react-spring/web";
import {createTableSpring} from "../../../utils/createTableSpring";

interface JobItem {
  job_title: string;
  job_location: string;
  posted_on: string;
  closing_on: string;
}

interface FeaturedJobsProps {
  jobsdata: {
    featured_title: string;
    featured_description: string;
    jobs_data: JobItem[];
  };
  commonlables:{};
  isVisible? :boolean
}
export const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ jobsdata , commonlables, isVisible = false }) => {
  const navigate = useNavigate();
  const springs = createTableSpring(
    isVisible ?? false, // Provide a default value of false
    "translateX(0%) translateY(100%)",
    "translateX(0%) translateY(100%)",
    500
  );
  
  const clickHandler = (job: JobItem) => {
    navigate('/Walaa-Careers', {
      state: {
        jobId: job?.job_id,
      }
    });

  };
  return (
    <div className="layout_container">
      <div className="featured-job-wrapper">
      <div className="headerText">{commonlables?.featured_jobs}</div>
      <animated.div style={isVisible ? springs : {}} >
      <div className="titleContainer">{jobsdata?.featured_title}</div>
      <div className="subContainer">{jobsdata?.featured_description}</div>
      <Container className="jobcontainer">
      {jobsdata?.jobs_data?.map((item, index) => (
        <div key={index} className="rowView list-item">
          <div className="viewContainer">
            <div className="title-text">{item?.job_title}</div>
            <div className="subtitle-text">
              {commonlables?.location}:&nbsp;
              {item?.job_location}
            </div>
            <div className="subtitle-text2">
              {commonlables?.job_posted_on}({item?.posted_on})
              &nbsp;&nbsp;
              {commonlables?.job_closing_on} ({item?.closing_on})
            </div>
          </div>
          <div className="applyButton" onClick={()=>clickHandler(item)}>
          <button className="buttom-text">{commonlables?.apply}</button>
          </div>
        </div>
      ))}
      </Container>
      </animated.div>
      </div>      
    </div>
  );
};



