import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { WalaaCareerMarketing } from "./index";
import { useApiCall } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";

jest.mock("../../constant", () => ({
  commonKeywords: {
    drag_and_drop: "Mock Drag and Drop",
    or_label: "Mock OR Label",
    submit_button: "Mock Submit",
  },
}));



jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("WalaaCareerMarketing Component", () => {
  const mockNavigate = jest.fn();
  const mockMakeApiCall = jest.fn();
  const mockJobsDetailData = {
    "data": [
      {
        "job_id": "WA002",
        "job_title": "Business Development Manager",
        "job_location": "Jeddah",
        "posted_on": "2025-04-29",
        "closing_on": "2025-05-30",
        "role_summary": "Business Development Manager is a professional having niche skills like Market Research, Strategy Development, Campaign Execution, Data Analysis, Communication and collaboration and a deep understanding of marketing principles to drive business growth."
      }
    ],
    "form_fields": [
      {
        "webform_name": "Join Our Talent Network",
        "fields": [
          {
            "field_name": "first_name",
            "field_title": "First Name",
            "field_type": "textfield",
            "field_required": true,
            "field_placeholder": "Enter First Name",
            "field_options": null,
            "field_validation": {
              "required": {
                "message": "This field is required."
              },
              "nameValid": {
                "message": "Special charactes and numerics not allowed"
              }
            }
          },
          {
            "field_name": "last_name",
            "field_title": "Last Name",
            "field_type": "textfield",
            "field_required": true,
            "field_placeholder": "Enter Last Name",
            "field_options": null,
            "field_validation": {
              "required": {
                "message": "This field is required."
              },
              "nameValid": {
                "message": "Special charactes and numerics not allowed"
              }
            }
          },
          {
            "field_name": "phone_no",
            "field_title": "Phone No.",
            "field_type": "textfield",
            "field_required": true,
            "field_placeholder": "Enter Phone Number",
            "field_options": null,
            "field_validation": {
              "required": {
                "message": "This field is required."
              },
              "shouldStart5": {
                "message": "Phone no must be starts with 05"
              },
              "req10Digits": {
                "message": "10 digits required"
              }
            }
          },
          {
            "field_name": "email_address",
            "field_title": "Email Address",
            "field_type": "email",
            "field_required": true,
            "field_placeholder": "Enter Email Address",
            "field_options": null,
            "field_validation": {
              "required": {
                "message": "This field is required."
              },
              "emailValid": {
                "message": "Please enter a valid email address."
              }
            }
          },
          {
            "field_name": "present_location_select_region",
            "field_title": "Present Location (Select Region)",
            "field_type": "select",
            "field_required": true,
            "field_placeholder": "",
            "field_options": {
              "Riyadh": "Riyadh",
              "Al Dhahran": "Al Dhahran",
              "Al-Dawadmi": "Al-Dawadmi",
              "Al-Majmah": "Al-Majmah",
              "Alquwayiyah": "Alquwayiyah",
              "Al-Ras": "Al-Ras",
              "Al-Zolfi": "Al-Zolfi",
              "At Taif": "At Taif",
              "Buraidah": "Buraidah",
              "Dammam": "Dammam",
              "Hafer Albaten": "Hafer Albaten",
              "Hail": "Hail",
              "Hassa": "Hassa",
              "Jazan": "Jazan",
              "Jeddah": "Jeddah",
              "Jubail": "Jubail",
              "Khamis Mushait": "Khamis Mushait",
              "Khobar": "Khobar",
              "Madinah": "Madinah",
              "Najran": "Najran",
              "Qatif‎": "Qatif‎",
              "Safwa": "Safwa",
              "Unizah": "Unizah",
              "Yanbu": "Yanbu"
            },
            "field_validation": {
              "required": {
                "message": "This field is required."
              }
            }
          },
          {
            "field_name": "current_employment_status",
            "field_title": "Current Employment Status",
            "field_type": "radios",
            "field_required": false,
            "field_placeholder": "",
            "field_options": {
              "true": "Yes",
              "false": "No"
            },
            "field_validation": null
          },
          {
            "field_name": "upload_resume",
            "field_title": "Upload Resume",
            "field_type": "managed_file",
            "field_required": false,
            "field_placeholder": "Browse Files",
            "field_options": null,
            "field_validation": {
              "max_filesize": {
                "max": 5,
                "message": "File size cannot exceed 5 MB."
              },
              "file_extensions": {
                "message": "Supported file type: .doc, .docx, .pdf, .jpg, .png"
              }
            },
            "field_description": "",
            "field_additional_info": "The file name should be in English names only and should not include any symbol."
          },
          {
            "field_name": "by_click",
            "field_title": "By Click",
            "field_type": "checkbox",
            "field_required": false,
            "field_placeholder": "",
            "field_options": null,
            "field_validation": null,
            "field_description": "\u003Cp\u003EBy Clicking the box, I acknowledge, I have read the \u003Ca href=\"https://storage.googleapis.com/wla-mectrl2-storage-01/2024-10/20240918-walaa-pol-pdp-privacy-notice-v1-1-002_0.pdf\"\u003EWalaa Policy\u003C/a\u003E and that I concent to the processing of my and that I concent to the processing of my personal data\u003C/p\u003E"
          },
          {
            "field_name": "actions",
            "field_title": "Submit",
            "field_type": "webform_actions",
            "field_required": false,
            "field_placeholder": "",
            "field_options": null,
            "field_validation": null
          }
        ]
      }
    ]
  };

  jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: null,
      error: null,
      isLoading: false,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should submit the form and call the API with correct payload", async () => {


    render(<WalaaCareerMarketing jobsDetailData={mockJobsDetailData} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "john.doe@example.com" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("career-form"));

    // Verify API call
    expect(mockMakeApiCall).toHaveBeenCalledWith({
      "attachments": [],
      "email": "john.doe@example.com",
      "employeeStatus": false,
      "firstName": "John",
      "jobId": "WA002",
      "lastName": "Doe",
      "location": undefined,
      "phoneNumber": undefined,
      "position": "Business Development Manager",
    });

    // Simulate API success
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: true,
      error: null,
      isLoading: false,
    });
    

  });

  it("should handle API errors gracefully", async () => {

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: null,
      error: { messages: { message_en: "Submission failed" } },
      isLoading: false,
    });

    render(<WalaaCareerMarketing jobsDetailData={mockJobsDetailData} />);

    // Submit the form
    fireEvent.submit(screen.getByRole("career-form"));

    // Verify error handling
    expect(screen.getByText(/Submission failed/i)).toBeInTheDocument();
  });
});