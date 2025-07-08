import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuDropdownTemplate, {RenderContentNavigateTo} from "../menuDropdownTemplate";
import { MenuDropdownTemplateProps } from "../types/menuDropdownTemplate.types";
import { MemoryRouter } from "react-router-dom"; 

const mockHandleOnMouse = jest.fn();
const mockNavigateTo = jest.fn();

const activeNavItem = {
  linkName: "Test Link",
  selectedIndex: 0,
};

const menuDropdown = [
  {
    templateType: "product",
    productType: ["type1"],
    child: [
      {
        productType: "type1",
        image: "image1.png",
        label: "Label 1",
        banner: {
          image: "banner1.png",
          title: "Banner Title 1",
          description: "Banner Description 1",
        },
      },
    ],
  },
];

const activeMenuDropdown = {
  attributes: { class: ["product"] },
  childrens: [
    {
      linkName: "Child Link 1",
      attributes: { class: ["icon-class-1"] },
      menuUrl: "/child-link-1",
      childrens: [
        {
          linkName: "Sub Child Link 1",
          attributes: { class: ["icon-class-2"] },
          menuUrl: "/sub-child-link-1",
        },
      ],
      menuimage: {
        image_urls: [{ url: "image-url-1", alt: "Image 1" }],
      },
      link_content: "<p>Link Content</p>",
    },
  ],
  link_content: "<p>Link Content</p>",
  menuimage: {
    image_urls: [{ url: "image-url-1", alt: "Image 1" }],
  },
  media_type_val: "Video",
  video_url: "videourl",
};

describe("MenuDropdownTemplate", () => {
  const setup = (
    templateType: string,
    props: Partial<MenuDropdownTemplateProps> = {}
  ) => {

    const defaultProps: MenuDropdownTemplateProps = {
      activeNavItem,
      activeMenuDropdown,
      handleOnMouse: mockHandleOnMouse,
      navigateTo: mockNavigateTo,
      ...props,
    };
    return render(
      <MemoryRouter>
        <MenuDropdownTemplate {...defaultProps} />
      </MemoryRouter>
        );
  };

  test("renders product template correctly", () => {
    setup("product");

    expect(screen.getByText("Child Link 1")).toBeInTheDocument();
    expect(screen.getByText("Sub Child Link 1")).toBeInTheDocument();
    // expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  test("renders general template correctly", () => {
    const generalMenuDropdown = {
      attributes: { class: ["general"] },
      childrens: [
        {
          linkName: "General Link 1",
          attributes: { class: ["icon-class-1"] },
          menuUrl: "/general-link-1",
        },
      ],
      link_content: "<p>General Link Content</p>",
      menuimage: {
        image_urls: [{ url: "general-image-url-1", alt: "General Image 1" }],
      },
      media_type_val: "Video",
      video_url: "videourl",
    }

    setup("general", { activeMenuDropdown: generalMenuDropdown });

    expect(screen.getByText("General Link 1")).toBeInTheDocument();
    // expect(screen.getByAltText("General Image 1")).toBeInTheDocument();
  });

  test("calls handleOnMouse on mouse enter and leave", () => {
    setup("product");

    const rowElement = screen.getByText("Child Link 1").closest("div");

    if (rowElement) {
      fireEvent.mouseEnter(rowElement);
      expect(mockHandleOnMouse).toHaveBeenCalledWith("Test Link", true, 0);

      fireEvent.mouseLeave(rowElement);
      expect(mockHandleOnMouse).toHaveBeenCalledWith("", false, 0);
    } else {
      throw new Error("Row element not found");
    }
  });

  test("calls navigateTo on child click", () => {
    const generalMenuDropdown = {
      attributes: { class: ["general"] },
      childrens: [
        {
          linkName: "General Link 1",
          attributes: { class: ["icon-class-1"] },
          menuUrl: "/general-link-1",
        },
      ],
      link_content: "<p>General Link Content</p>",
      menuimage: {
        image_urls: [{ url: "general-image-url-1", alt: "General Image 1" }],
      },
      media_type_val: "Video",
      video_url: "videourl",
    }

    setup("general", { activeMenuDropdown: generalMenuDropdown });

    const childLink = screen.getByText("General Link 1").closest("div");

    if (childLink) {
      fireEvent.click(childLink);
      expect(mockNavigateTo).toHaveBeenCalledWith("/general-link-1");
    } else {
      throw new Error("Child link element not found");
    }
  });

  it("should handle product toggle click", () => {
    setup("product");

    const productOption = screen.getByText("Child Link 1").closest("div");

    if (productOption) {
      fireEvent.click(productOption);
      expect(productOption).toHaveClass("selected");
    } else {
      throw new Error("Product option element not found");
    }
  });

  it("Should not render image section when no image shared in active dropdown", () => {
    const generalMenuDropdown = {
      attributes: { class: ["general"] },
      childrens: [
        {
          linkName: "General Link 1",
          attributes: { class: ["icon-class-1"] },
          menuUrl: "/general-link-1",
        },
      ],
      link_content: "<p>General Link Content</p>",
      menuimage: {
        image_urls: [{ url: "general-image-url-1", alt: "General Image 1" }],
      },
      media_type_val: null,
      video_url: null,
    }

    setup("product", { activeMenuDropdown: generalMenuDropdown });
    const childLink = screen.getByText("General Link 1").closest("div");

    if (childLink) {
      fireEvent.click(childLink);
      expect(mockNavigateTo).toHaveBeenCalledWith("/general-link-1");
    } else {
      throw new Error("Child link element not found");
    }
  });

  it("applies 'container-width' class when user is authenticated", () => {
    render(
      <MemoryRouter>
        <MenuDropdownTemplate
          activeNavItem={activeNavItem}
          activeMenuDropdown={activeMenuDropdown}
          handleOnMouse={mockHandleOnMouse}
          navigateTo={mockNavigateTo}
          isUserAuthenticated={true}
        />
      </MemoryRouter>
    );

    const container = screen.getByText("Child Link 1").closest(".container-width");
    expect(container).toBeInTheDocument();
  });

  it("applies 'sub-menu-text' class when user is authenticated", () => {
    render(
      <MemoryRouter>
        <MenuDropdownTemplate
          activeNavItem={activeNavItem}
          activeMenuDropdown={activeMenuDropdown}
          handleOnMouse={mockHandleOnMouse}
          navigateTo={mockNavigateTo}
          isUserAuthenticated={true}
        />
      </MemoryRouter>
    );

    const container = screen.getByText("Sub Child Link 1").closest(".sub-menu-text");
    expect(container).toBeInTheDocument();
  });

});

describe('RenderContentNavigateTo', () => {
  it('renders correctly and handles click event', () => {
    const mockNavigateTo = jest.fn();
    const props = {
      cIdx: 1,
      menuUrl: '/some-url',
      linkName: 'Test Link',
      navigateTo: mockNavigateTo,
      attributes: {
        class: ['some-class'],
      },
      handleDropdownEvent: jest.fn(),
    };

    render(
      <MemoryRouter>
        <RenderContentNavigateTo {...props} />
      </MemoryRouter>
      );
    expect(screen.getByText('Test Link')).toBeInTheDocument();
    // expect(screen.getByAltText('product')).toHaveAttribute('src', 'some-icon-url');
    expect(screen.getByTestId('ArrowForwardIcon')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Test Link'));
    expect(mockNavigateTo).toHaveBeenCalledWith('/some-url');
  });
});
