import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { useMatchDocument } from "./useMatchDocument";
import { getClaimDocuments } from "utils/getClaimDocuments";
import { LanguageData } from "types/languageData";

jest.mock("utils/getClaimDocuments");

describe("useMatchDocument", () => {
  const mockGetClaimDocuments = jest.fn();
  const mockLanguageData: LanguageData = {
    register_claim_dynamic_upload_section1: {
      motor: [
        { key: "doc1", value: "value1", required: true },
        { key: "doc2", value: "value2", required: false },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getClaimDocuments as jest.Mock).mockImplementation(mockGetClaimDocuments);
  });

  it("should return matched documents when valid data is provided", async () => {
    const mockMatchedDocuments = [
      { key: "doc1", value: "value1", required: true },
    ];
    mockGetClaimDocuments.mockReturnValue(mockMatchedDocuments);

    const { result } = renderHook(() =>
      useMatchDocument({
        type: "claimType",
        validationData: {
          estimateAmount: 1000,
          liability: 50,
        },
        caseReportedType: "najm_case",
        Data: mockLanguageData,
      })
    );

    await waitFor(() => {
      expect(result.current).toEqual(mockMatchedDocuments);
    });

    expect(mockGetClaimDocuments).toHaveBeenCalledWith(
      mockLanguageData.register_claim_dynamic_upload_section1.motor,
      {
        claimRequestType: "claimType",
        estimateAmount: 1000,
        liabilityPercentage: 50,
        caseReportedType: "najm_case",
      }
    );
  });

  it("should return an empty array when motorDocs is not an array", async () => {
    const invalidLanguageData: LanguageData = {
      register_claim_dynamic_upload_section1: {
        motor: null,
      },
    };

    const { result } = renderHook(() =>
      useMatchDocument({
        type: "claimType",
        validationData: {
          estimateAmount: 1000,
          liability: 50,
        },
        caseReportedType: "najm_case",
        Data: invalidLanguageData,
      })
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(mockGetClaimDocuments).not.toHaveBeenCalled();
  });

  it("should return an empty array when no matched documents are found", async () => {
    mockGetClaimDocuments.mockReturnValue([]);

    const { result } = renderHook(() =>
      useMatchDocument({
        type: "claimType",
        validationData: {
          estimateAmount: 1000,
          liability: 50,
        },
        caseReportedType: "najm_case",
        Data: mockLanguageData,
      })
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(mockGetClaimDocuments).toHaveBeenCalledWith(
      mockLanguageData.register_claim_dynamic_upload_section1.motor,
      {
        claimRequestType: "claimType",
        estimateAmount: 1000,
        liabilityPercentage: 50,
        caseReportedType: "najm_case",
      }
    );
  });
});
