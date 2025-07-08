import React from "react";
import Container from "react-bootstrap/Container";
import "./index.scss";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";

interface VisionMenuProps {
  linkName: string;
  menuUrl: string;
}

interface ThankyouProps {
  title: string;
  subtitle: string;
}

interface VisionProps {
  title: string;
  description: string;
  menu: {
    title: string;
    items: VisionMenuProps[];
  };
  thankyou: ThankyouProps[];
  isVisible?: boolean;
  navigateTo: (url: string) => void;
}

export const Vision: React.FC<VisionProps> = ({
  title,
  description,
  menu,
  thankyou,
  isVisible = false,
  navigateTo,
}) => {

  const springsRef = useSpringRef();
  const springMenuRef = useSpringRef();
  const springThankYouRef = useSpringRef();

  const springs = useSpring({
    ref: springsRef,
    from: { 
      transform: isVisible ? 'translateX(50%) translateY(0%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(50%) translateY(0%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 70, friction: 30 },
    delay: 200,
  });

  const springMenu = useSpring({
    ref: springMenuRef,
    from: { 
      transform: isVisible ? 'translateX(0%) translateY(100%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: {
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(100%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 70, friction: 30 },
    delay: 200,
  });

  const springThankYou = useSpring({
    ref: springThankYouRef,
    from: { 
      transform: isVisible ? 'translateX(0%) translateY(150%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(150%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 70, friction: 30 },
    delay: 400,
  });

  useChain([springsRef, springMenuRef, springThankYouRef], [0, 0, 1]);

  return (
  <div className="vision_section">
    <Container fluid className="mid-container container-fluid">
      <animated.div style={isVisible ? springs: {}} className="about-heading">
        <h2 className="walaa-medium-500">{title}</h2>
        <p className="walaa-regular-400">{description}</p>
      </animated.div>
    </Container>
      <div className="about-us">
      <div className="about-us-containt"> 
        <animated.h3 style={isVisible ? springMenu: {}} className="walaa-medium-500">{menu.title}</animated.h3>
        <animated.ul style={isVisible ? springMenu: {}}>
          {menu?.items?.map(({ linkName, menuUrl }) => (
            <li className="walaa-regular-400" key={linkName}>
              <a onClick={()=>menuUrl ? navigateTo(menuUrl): ""}>
                {linkName} <span className="arrowForwardwhite"></span>
              </a>
            </li>
          ))}
        </animated.ul>
      </div>
      </div>
  </div>
)
};
