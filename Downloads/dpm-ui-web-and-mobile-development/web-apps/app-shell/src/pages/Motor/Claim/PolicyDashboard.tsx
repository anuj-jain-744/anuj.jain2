import React, { useEffect, useState } from "react";
import { callAPI, RootState, slices } from "@dpm/shared-module";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay, ProtectedRoute } from "@components/index";
import { PolicyContainer } from "@consumer-portal/Motor/Policy-services/";
import { getFullUrl, navigateTo } from "@utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { BlueFormFooter } from "@consumer-portal/components/BlueFormFooter";
import { useDispatch,useSelector } from "react-redux";
import { usePolicyDetails } from "@consumer-portal/hook/dashboard/usePolicyDetails";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

const items = [
  { label: "Dashboard", route: "/Dashboard" },
  { label: "Policy Details", route: "/Motor/Claim/PolicyDashboard" },
];

const DashboardPolicy: React.FC = () => {
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { policies } = useSelector((state: RootState) => state.policy);

  const dispatch=useDispatch()

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result = endpoint === "header-menu"
        ? responseData?.menus
        : endpoint === "consumer-portal"
          ? responseData?.data
          : responseData ?? {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate, location?.state);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };
  
  const goBack =() =>{
    navigate(-1)
  }

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
    ]);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchAllData();
  }, []);
  const { setPolicies, setPolicyLoading, setPolicyError } = slices.policySlices;
   const userDetails = sessionStorage.getItem("userDetails");
   const parsedUserDetails = userDetails && Object.keys(userDetails).length !== 0 ? JSON.parse(userDetails):null;
    const userProfileDetails = parsedUserDetails.userProfileData;
   const {
    data: policyData,
    error: policyError,
    isLoading: isPolicyLoading,
  } = usePolicyDetails({policyNo: null, productCode: null,nationalId: userProfileDetails?.userId });
    useEffect(() => {
      if(policyData?.data?.result){
        dispatch(setPolicyLoading(isPolicyLoading));
        if (setPolicies) dispatch(setPolicies(policyData?.data?.result));
        if (setPolicyError)
          dispatch(
            setPolicyError(
              (policyError as Error)?.message
            )
          );
      }
    
    }, [policyData]);
  

  return (
    <ProtectedRoute>
      <React.Fragment>
        {loading && <LoaderOverlay />}
        <Header
          isSearchEnable={false}
          isAuthenticated={false}
          menuItems={headerData}
          isMenuTransparent={true}
          navigateTo={handleNavigate}
        />
        <HighlighterBanner
          showInput={false}
          title={"Policy Details"}
          breadcrumbsData={items}
          classApply={"policy-title"}
          isMotor={true}
          navigateTo={handleNavigate}
        />
        <PolicyContainer navigateTo={handleNavigateWithParams} />
        <BlueFormFooter backBtnClickHandler={goBack} isVisibleSubmitButton={false}  />
      </React.Fragment>
    </ProtectedRoute>
  );
};

export default DashboardPolicy;