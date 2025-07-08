import React, { Suspense } from "react";
 
export const PublicHomeTemplate = ({ component }) => {
  const sortedComponent= component.sort((a,b)=>a.order-b.order);
  const ComponentToImport=(componentName)=>{
    return React.lazy(() =>
      import(`../../../../${origin}/src/components`).then((module) => ({
        default: module[componentName],
      }))
    )
  }
  const renderComponents = () => {
    return sortedComponent
      .map((componentElement, index) => {
        const { componentName } = componentElement;
        const ComponentToRender = ComponentToImport(componentName) ;
        return <ComponentToRender key={"component_"+index} />;
      });
  };
 
  return (
    <Suspense fallback={<div>Loading</div>}>{renderComponents()}</Suspense>
  );
};