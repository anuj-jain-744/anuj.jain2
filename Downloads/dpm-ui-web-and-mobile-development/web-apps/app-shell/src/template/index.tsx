import React, { Suspense } from "react";

interface SingleComponent {
  componentName: string;
  order: number;
  origin: string;
  props: Record<string, unknown>;
}
type TemplateComponent = SingleComponent[];
type ComponentProps = { component: TemplateComponent };
type Component = React.FC<ComponentProps>;

const templateMap = {
  PublicHomeTemplate: React.lazy(() =>
    import("./Public-Home").then((module) => ({
      default: module.PublicHomeTemplate,
    }))
  ),
  PublicMotorTemplate: React.lazy(() =>
    import("./Public-Motor").then((module) => ({
      default: module.PublicMotorTemplate,
    }))
  ),
};

const renderTemplate = (
  type: "PublicHomeTemplate" | "PublicMotorTemplate",
  component: TemplateComponent
): Component => {
  const Component = templateMap[type];
  if (!Component) {
    throw new Error(`Unsupported type: ${type}`);
  }

  return () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component component={component} />
    </Suspense>
  );
};

const Template: React.FC<{
  type: "PublicHomeTemplate" | "PublicMotorTemplate";
  component: TemplateComponent;
}> = ({ type, component }) => {  
  // debugger
  const HOCTemplate = renderTemplate(type, component);
  return <HOCTemplate component={component} />;
};

export default Template;
