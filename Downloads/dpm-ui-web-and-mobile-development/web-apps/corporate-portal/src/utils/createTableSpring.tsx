import { useSpring } from "@react-spring/web";

export const createTableSpring = (
  isVisible: boolean,
  fromTransform: string,
  toTransform: string,
  delay: number
) => {
  return useSpring({
    from: {
      transform: isVisible ? fromTransform : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: {
      transform: isVisible ? "translateX(0%) translateY(0%)" : toTransform,
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 70, friction: 50 },
    delay,
  });
};
