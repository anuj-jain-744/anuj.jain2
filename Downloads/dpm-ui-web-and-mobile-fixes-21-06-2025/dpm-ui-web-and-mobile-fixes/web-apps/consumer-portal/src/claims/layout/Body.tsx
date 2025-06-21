import ClaimData from "../data/Claim.json";
import Register from "../register";
import Registration from "../register/Registration";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../DataContext";
import React from "react";

function Body(props) {
  const [show, setShow] = useState(true);
  const [pageName, setPage] = useState<null | string>(null);
  //cms content
  const Data = useContext(DataContext);

  // reset header handler
  const resetHeaderHandler = (val: string) => {
    setPage(val);
  };

  useEffect(() => {
    if (pageName === "Success") setShow(false);
    else setShow(true);
  }, [pageName]);
  return (
    <div className="container-fluid">
      {props?.type !== "OD" ? (
        <React.Fragment>
          <Registration />
          <Register
            propData={props}
            data={ClaimData?.data}
            resetHeader={resetHeaderHandler}
            show={show}
            CardclassName={ClaimData?.card?.classes}
            headersrc={ClaimData?.icon[0]?.path}
            headeralt={ClaimData?.icon[0]?.alt}
            headerclassName={ClaimData?.icon[0]?.classes}
            headertitleclassName={ClaimData?.classes}
            headertitle={Data?.register_new_claim}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Register
            propData={props}
            data={ClaimData?.data}
            resetHeader={resetHeaderHandler}
            show={show}
            CardclassName={ClaimData?.card?.classes}
            headersrc={ClaimData?.icon[0]?.path}
            headeralt={ClaimData?.icon[0]?.alt}
            headerclassName={ClaimData?.icon[0]?.classes}
            headertitleclassName={ClaimData?.classes}
            headertitle={Data?.register_new_claim}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Body;
