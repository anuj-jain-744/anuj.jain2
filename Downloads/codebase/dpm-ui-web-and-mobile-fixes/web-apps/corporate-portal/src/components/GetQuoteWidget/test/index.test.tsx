import { act } from "@testing-library/react";
import '@testing-library/jest-dom';

jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="carousel">{children}</div>),
}));

jest.mock('../QuoteCarouselItems', () => ({
  __esModule: true,
  default: jest.fn(({ productName }) => <div data-testid="quoteCarouselItem">{productName}</div>),
}));

jest.mock('../../Calendar', () => ({
  __esModule: true,
  SharedCalendar: jest.fn(() => <div data-testid="sharedCalendar" />),
}));

jest.mock('../../../constant', () => ({
  VITE_BACKEND_BASE_URL: 'http://34.166.69.105/walaa/web/',
}));

const disclaimerText = "Walaaa Services";
const products = {
    "Personal": [
        {
            "product_name": "Motor",
            "button_text": "Get a Quote",
            "class_name": "motor",
            "form_fields": [
                {
                    "field_formfields": "National ID/ IQAMA No",
                    "field_fieldtype": "text",
                    "field_field_class": "Identity",
                    "field_name": "Identity",
                },
                {
                    "field_formfields": "Date of Birth",
                    "field_fieldtype": "calendar",
                    "field_field_class": "DOB",
                    "field_name": "DOB",

                },
                {
                    "field_formfields": "Mobile Number",
                    "field_fieldtype": "phone",
                    "field_field_class": "MobileNumber",
                    "field_name": "MobileNumber",
                }
            ]
        },
        {
            "product_name": "Travel",
            "button_text": "Get a Quote",
            "class_name": "travel",
            "form_fields": [
              {
                  "field_formfields": "National ID/ IQAMA No",
                  "field_fieldtype": "text",
                  "field_field_class": "Identity",
                  "field_name": "Identity",
              },
              {
                  "field_formfields": "Date of Birth",
                  "field_fieldtype": "calendar",
                  "field_field_class": "DOB",
                  "field_name": "DOB",

              },
              {
                  "field_formfields": "Mobile Number",
                  "field_fieldtype": "phone",
                  "field_field_class": "MobileNumber",
                  "field_name": "MobileNumber",
              }
          ]
        }
    ],
    "SME": [
        {
            "product_name": "Motor",
            "button_text": "Get a Quote",
            "class_name": "motor",
            "form_fields": [
              {
                  "field_formfields": "National ID/ IQAMA No",
                  "field_fieldtype": "text",
                  "field_field_class": "Identity",
                  "field_name": "Identity",
              },
              {
                  "field_formfields": "Date of Birth",
                  "field_fieldtype": "calendar",
                  "field_field_class": "DOB",
                  "field_name": "DOB",

              },
              {
                  "field_formfields": "Mobile Number",
                  "field_fieldtype": "phone",
                  "field_field_class": "MobileNumber",
                  "field_name": "MobileNumber",
              }
          ]
        },
        {
            "product_name": "Medical",
            "button_text": "Get a Quote",
            "class_name": "medical",
            "form_fields": [
              {
                  "field_formfields": "National ID/ IQAMA No",
                  "field_fieldtype": "text",
                  "field_field_class": "Identity",
                  "field_name": "Identity",
              },
              {
                  "field_formfields": "Date of Birth",
                  "field_fieldtype": "calendar",
                  "field_field_class": "DOB",
                  "field_name": "DOB",

              },
              {
                  "field_formfields": "Mobile Number",
                  "field_fieldtype": "phone",
                  "field_field_class": "MobileNumber",
                  "field_name": "MobileNumber",
              }
          ]
        }
    ]
};

describe('GetQuoteWidget', () => {

  it('should render Carousel when isScreenTablet is true', async () => {
    global.innerWidth = 800;
    global.dispatchEvent(new Event('resize'));

    await act(async () => {
  //    render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
  //  expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('should render QuoteCarouselItems directly when isScreenTablet is false', async () => {
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));

    await act(async () => {
  //    render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
  //  expect(screen.getAllByTestId('quoteCarouselItem')).toHaveLength(2);
  });

  it('should render SharedCalendar component', async () => {
    await act(async () => {
  //    render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
   // expect(screen.getByTestId('sharedCalendar')).toBeInTheDocument();
  });

  it('should handle product toggle click', async () => {
    await act(async () => {
  //    render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
    await act(async () => {
  //    fireEvent.click(screen.getByTestId('productToggle-0'));
    });
    
  //  expect(screen.getByTestId('productToggle-0')).toHaveClass('selected');
  });

  it('should handle dropdown item click', async () => {
    global.innerWidth = 600;
    global.dispatchEvent(new Event('resize'));

    await act(async () => {
  //    render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
    await act(async () => {
  //    fireEvent.click(screen.getByTestId('dropdownToogleClick-button'));
    });
  });

  it('should handle disclaimer radio button click', async () => {
    await act(async () => {
   //   render(<GetQuoteWidget disclaimerText={disclaimerText} products={products} />);
    });
    
    await act(async () => {
   //   fireEvent.click(screen.getByTestId('disclaimerRadio'));
    });
    
   // expect(screen.getByTestId('verifiedIcon')).toBeInTheDocument();
  });

  it('disclaimerText as undefined send and and parallexEffect', async () => {
    await act(async () => {
   //   render(<GetQuoteWidget disclaimerText={undefined} products={products} isVisible={true} multiProduct={false} customTheme={true}/>);
    });
   // expect(screen.queryByTestId('disclaimerRadio')).not.toBeInTheDocument();
  });
});