import React from "react";
import './index.scss';

interface StaticImageCardProps {
    sidebarImage:{url:string; alt:string;}[]
}
 
const StaticImageCard: React.FC<StaticImageCardProps> = ({sidebarImage}) => {
    return ( <div className="image-container">
        {sidebarImage && sidebarImage?.map(
          ({url,alt}: { url: string; alt: string }, index: number) => (
            <div className="img-card" key={index}>
              <img src={url} alt={alt ?? ""}/>
            </div>
          )
        )}
      </div> );
}
 
export default StaticImageCard;