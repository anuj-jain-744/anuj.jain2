import {render,fireEvent,screen} from "@testing-library/react";
import { UiTabs } from "./index";
import { useState } from "react";
 
describe("UiTabs Component", () => {
    const content = [
        { webform_name: "Make an Enquiry" },
        { webform_name: "Post a Complaint" },
        { webform_name: "Report A Fraud" }
    ];
    const mockActiveTabItem = 0;
    const mockHandleSelectTab = jest.fn();
    
    const {container}=render(
        <UiTabs
            tabsData={content}
            activeTab={mockActiveTabItem}
            setActiveTab={mockHandleSelectTab}
        />
    );
    const tabs = container.querySelectorAll('.tab-wrapper');

    

    it("renders the correct number of tabs and each tab click action", () => {
       
        expect(tabs.length).toBe(content.length);

        expect(tabs[0].classList.contains('selected')).toBe(true);
        expect(tabs[1].classList.contains('selected')).toBe(false);
        expect(tabs[2].classList.contains('selected')).toBe(false);

        fireEvent.click(tabs[1]);
        expect(mockHandleSelectTab).toHaveBeenCalledWith(1);

        fireEvent.click(tabs[2]);
        expect(mockHandleSelectTab).toHaveBeenCalledWith(2);

    });

});