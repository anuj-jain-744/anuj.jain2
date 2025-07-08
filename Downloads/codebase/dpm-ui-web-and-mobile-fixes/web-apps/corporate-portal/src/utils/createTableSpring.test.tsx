import { render } from "@testing-library/react";
import { animated } from "@react-spring/web";
import { createTableSpring } from "./createTableSpring"; 

const TestComponent = ({ isVisible }: { isVisible: boolean }) => {
  const springProps = createTableSpring(isVisible, "translateX(-100%)", "translateX(100%)", 200);

  return <animated.div style={springProps} data-testid="animated-div">Test</animated.div>;
};

describe("createTableSpring Hook", () => {
  it("should set initial transform when `isVisible` is `true`", () => {
    const { getByTestId } = render(<TestComponent isVisible={true} />);
    const animatedDiv = getByTestId("animated-div");

    expect(animatedDiv.style.transform).toBe("translateX(-100%)"); 
    expect(animatedDiv.style.opacity).toBe("0");
  });

  it("should apply `toTransform` when `isVisible` is `false`", () => {
    const { getByTestId } = render(<TestComponent isVisible={false} />);
    const animatedDiv = getByTestId("animated-div");

    expect(animatedDiv.style.transform).toBe("translateX(0%) translateY(0%)"); 
    expect(animatedDiv.style.opacity).toBe("1"); 
  });
});
