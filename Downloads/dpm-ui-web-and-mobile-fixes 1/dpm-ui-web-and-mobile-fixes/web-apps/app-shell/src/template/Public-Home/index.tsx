import React, { Suspense } from "react";

export const PublicHomeTemplate = ({ component }) => {
  
  const renderComponents = () => {
    return component
      .sort((a, b) => a.order - b.order)
      .map((componentElement, index) => {
        const { componentName, origin, props } = componentElement;

        const ComponentToRender = React.lazy(() =>
          import(`../../../../${origin}/src/components`).then((module) => ({
            default: module[componentName],
          }))
        );
        return <ComponentToRender key={index} />;
      });
  };

  return (
    <Suspense fallback={<div>Loading</div>}>{renderComponents()}</Suspense>
  );
};

