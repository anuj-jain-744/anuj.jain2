import { renderHook, act } from "@testing-library/react-hooks";
import { toast } from "react-toastify";
import useUploadAll from "./useUploadAll";

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("useUploadAll", () => {
    const mockMakeApiCall = jest.fn();
    const mockResetState = jest.fn();
    const mockSetIsSuccess = jest.fn();

    const taskConstants = {
        SUCCESS: "SUCCESS",
        ERROR: "ERROR",
    };

    const trackClaimInfo = {
        documents_are_submitted_successfully: "Documents are submitted successfully",
        error_in_uploading_documents: "Error in uploading documents",
        all_documents_submitted_successfully: "All documents submitted successfully",
    };

    const newFileItems = [
        { id: "1", taskId: 101, name: "file1.pdf", base64: "base64string1", error: false },
        { id: "2", taskId: 101, name: "file2.pdf", base64: "base64string2", error: false },
        { id: "3", taskId: 102, name: "file3.pdf", base64: "base64string3", error: false },
        { id: "4", taskId: 103, name: "file4.pdf", base64: null, error: true }, // Invalid file
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully upload all documents and reset state", async () => {
        mockMakeApiCall.mockResolvedValue({ message: taskConstants.SUCCESS });

        const { result } = renderHook(() =>
            useUploadAll({
                newFileItems,
                taskConstants,
                trackClaimInfo,
                makeApiCall: mockMakeApiCall,
                resetState: mockResetState,
                setIsSuccess: mockSetIsSuccess,
            })
        );

        await act(async () => {
            const response = await result.current.handleUploadAll();
            expect(response).toEqual({
                status: taskConstants.SUCCESS,
                message: trackClaimInfo.all_documents_submitted_successfully,
            });
        });

        expect(mockMakeApiCall).toHaveBeenCalledTimes(2); // Only valid tasks are processed
        expect(mockResetState).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledTimes(2);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it("should handle errors during document upload", async () => {
        mockMakeApiCall
            .mockResolvedValueOnce({ message: taskConstants.SUCCESS })
            .mockResolvedValueOnce({ message: taskConstants.ERROR });

        const { result } = renderHook(() =>
            useUploadAll({
                newFileItems,
                taskConstants,
                trackClaimInfo,
                makeApiCall: mockMakeApiCall,
                resetState: mockResetState,
                setIsSuccess: mockSetIsSuccess,
            })
        );

        await act(async () => {
            const response = await result.current.handleUploadAll();
            expect(response).toEqual({
                status: taskConstants.ERROR,
                message: trackClaimInfo.error_in_uploading_documents,
            });
        });

        expect(mockMakeApiCall).toHaveBeenCalledTimes(2); // Only valid tasks are processed
        expect(mockResetState).not.toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it("should skip invalid files and not make API calls for them", async () => {
        const { result } = renderHook(() =>
            useUploadAll({
                newFileItems,
                taskConstants,
                trackClaimInfo,
                makeApiCall: mockMakeApiCall,
                resetState: mockResetState,
                setIsSuccess: mockSetIsSuccess,
            })
        );

        await act(async () => {
            await result.current.handleUploadAll();
        });

        expect(mockMakeApiCall).toHaveBeenCalledTimes(2); // Invalid file is skipped
        expect(mockMakeApiCall).not.toHaveBeenCalledWith(
            expect.objectContaining({
                taskId: 103, // Invalid taskId
            })
        );
    });
});