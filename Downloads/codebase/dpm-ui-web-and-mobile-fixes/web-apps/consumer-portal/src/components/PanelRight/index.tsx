import React, { useEffect, useRef, useState,ReactNode } from 'react';
import LeftPanelClose from "../../assets/LeftPanel/LeftPanelClose.svg";
import CloseIcon from "../../assets/LeftPanel/CloseIcon.svg";
import "./index.scss";
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@dpm/shared-module";
interface PanelRightProps {
    children: ReactNode; // Declare the type for children
  }

const PanelRight: React.FC<PanelRightProps> = ({children}) => {
    const [isVisible, setIsVisible] = useState(false); // Controls sliding in
    const [isRed, setIsRed] = useState(false);         // Controls background color
    const drawerRef = useRef<HTMLDivElement>(null); // Reference for the drawer
    const [showDrawer, setShowDrawer] = useState(false); // Controls the drawer visibility
    const [isMobile, setIsMobile] = useState(false); // Determines if the device is mobile
    const { languageData: homeLanguageData } = useSelector((state: RootState) => state?.consumerCmsLanguageData, shallowEqual);
    const homeLangData = homeLanguageData?.config[0];
    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth <= 1200;
            setIsMobile(isNowMobile);
            setShowDrawer(false); // Close drawer on resize if not mobile
        };
        //window.addEventListener("resize", handleResize);
        handleResize(); // Initial check on load
        //return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Slide in after a short delay
        const timer = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => {
                setIsRed(true);
            }, 5000); // Match transition duration
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setShowDrawer(false);
            }
        };

        if (showDrawer) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDrawer]);

    return (
        <>
            {/* Show sliding panel for mobile */}
            {isMobile ? (
                <div className={`summary-details ${isVisible ? 'visible' : ''} ${isRed ? 'red-bg' : 'white-bg'}`} role='button' tabIndex={0} onClick={() => setShowDrawer(true)}>
                    <div className="right-panel">
                        <img className="right-icon icon-red" src={LeftPanelClose} alt="summary-details-icon" />
                        <p className={`summary-text ${isRed ? 'hide-text' : ''}`}>{homeLangData?.summary_details}</p>
                    </div>
                </div>
            ) : (
                // Render children normally when not on mobile
                children
            )}

            {/* Render the drawer when mobile and showDrawer is true */}
            {isMobile && showDrawer && (
                <div className="summary-drawer open" ref={drawerRef}>
                    <div className="modal-header-text walaa-medium-500">Summary Details</div>
                    <div className="close-btn" role='button' tabIndex={0} onClick={() => setShowDrawer(false)}>
                        <img src={CloseIcon} alt="summary-details-icon" />
                    </div>
                    {/* Render children inside the drawer */}
                    {children}
                </div>
            )}
        </>
    );
};

export default PanelRight;