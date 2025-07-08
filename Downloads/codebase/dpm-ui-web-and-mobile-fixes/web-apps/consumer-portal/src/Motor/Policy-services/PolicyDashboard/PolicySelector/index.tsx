import { FC,Fragment } from "react";
import "./PolicySelector.scss";
import { DropdownButton, Dropdown } from "react-bootstrap";
import product from "assets/PolicyDetails/product.svg";
import Travel_Logo from "assets/Dashboard/Travel_MyRequest.svg";
import { PersonalHome } from "assets/Products/index";
import { PRODUCTS_CODE } from "constant";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { PolicyDetail } from 'types/PolicyDetail';
import usePolicyData from "hook/common/usePolicyData";

interface PolicySelectorProps {
  selectedPolicyInfo: {
    policyNo: string;
    endorsementNo: string;
    productCode: string;
  };
  navigateTo: (url: string, data: unknown) => void;
}

const PolicySelector: FC<PolicySelectorProps> = ({
  selectedPolicyInfo,
  navigateTo,
}) => {
  const { policies } = useSelector((state: RootState) => state.policy);
  const {allPolicies}  = usePolicyData(policies);


  const filteredPolicy = allPolicies?.filter(
    (item: PolicyDetail) =>
      item.policyNo !== selectedPolicyInfo?.policyNo
  ) as PolicyDetail[];
  
  const onChangeHandler = (policy: PolicyDetail) => {
    navigateTo("/PolicyService/Details", { data: policy });
  };
  const renderItem = ({
    policyNo,
    productCode,
  }: {
    policyNo: string;
    productCode: string;
  }) => {
    const checkProd = PRODUCTS_CODE[productCode];
    switch (checkProd) {
      case "01":
        return (
          <span className="content-row">
            <img src={product} alt={`${checkProd}-icon`} />
            <p>{policyNo}</p>
          </span>
        );
      case "02":
        return (
          <span className="content-row">
            <img src={PersonalHome} alt={`${checkProd}-icon`} />
            <p>{policyNo}</p>
          </span>
        );
      case "03":
        return (
          <span className="content-row">
            <img src={Travel_Logo} alt={`${checkProd}-icon`} />
            <p>{policyNo}</p>
          </span>
        );

      default:
        break;
    }
  };
  return (
    <div className={filteredPolicy?.length>0?"selector-container":"hide-container"}>
      <DropdownButton
        data-testid="policy-selectorid"
        title={renderItem({
          policyNo: selectedPolicyInfo?.policyNo,
          productCode: selectedPolicyInfo?.productCode,
        }) ?? ""}
        children={
          <Fragment key="policy-row-key">
            {filteredPolicy?.map((item: PolicyDetail,index: number) => (
              <Dropdown.Item
                key={`${item?.policyNo}${index}`}
                className="policy-row"
                onClick={()=>onChangeHandler(item)}
              >
                {renderItem({
                policyNo: item?.policyNo,
                productCode: item?.productCode,
              })}
              </Dropdown.Item>
            ))}
          </ Fragment>
        }
      />
    </div>
  );
};

export default PolicySelector;
