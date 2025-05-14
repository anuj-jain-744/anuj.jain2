import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoResultFound from "./NoResult";

export interface resultObj {
  title: string;
  body: string;
  link: string;
}
interface ShowResultsProps {
  resultData : resultObj[];
  noResultPlacehoder: {
    noResultTitle: string;
    noResultSubTitle: string;
  }
}
const ShowResult = ({
  resultData,
  noResultPlacehoder,
}: ShowResultsProps) => {
  
  return (
    <div className="result-container">
      {resultData && Array.isArray(resultData) && resultData.length > 0 ? resultData.map((val:resultObj, index: number) => (
        <div className="search-data" key={index}>
          <a className="search-link" href={val?.link}>
            <h5 className="walaa-medium-500">{val.title}</h5>
          </a>
          <p className="walaa-regular-400">{val.body.length < 150 ? val.body : `${val.body.slice(0, 150)}...`}</p>
        </div>
        )
      ): (
        <NoResultFound noResultPlacehoder={noResultPlacehoder}/>
      )}
    </div>
  )
}

export default ShowResult;
