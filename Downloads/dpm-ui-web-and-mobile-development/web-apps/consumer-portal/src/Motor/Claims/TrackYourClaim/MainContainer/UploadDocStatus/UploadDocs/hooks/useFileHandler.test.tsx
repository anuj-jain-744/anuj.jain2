import { renderHook } from "@testing-library/react-hooks";
import { toast } from "react-toastify";
import useFileHandler from "./useFileHandler";

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe("useFileHandler", () => {
    const mockFileItems = [
        { id: "1", name: "Document 1", file: null },
        { id: "2", name: "Document 2", file: null },
    ];
    const mockValidFileTypes = ["image/png", "image/jpeg"];
    const mockTaskConstants = { MAX_FILE_SIZE_MB: 5 };
    const mockTrackClaimInfo = {
        no_files_selected: "No files selected",
        file_with_the_same_name_already_exists: "File with the same name already exists",
        invalid_file_type: "Invalid file type",
        file_uploaded_successfully: "File uploaded successfully",
        error_converting_file_to_base_64: "Error converting file to Base64",
    };
    const mockUpdateItemsError = jest.fn();
    const mockUpdateItemsFile = jest.fn();
    const mockResetFileInput = jest.fn();
    const mockConvertToBase64 = jest.fn();

    const setup = () =>
        renderHook(() =>
            useFileHandler({
                fileItems: mockFileItems,
                validFileTypes: mockValidFileTypes,
                taskConstants: mockTaskConstants,
                trackClaimInfo: mockTrackClaimInfo,
                updateItemsError: mockUpdateItemsError,
                updateItemsFile: mockUpdateItemsFile,
                resetFileInput: mockResetFileInput,
                convertToBase64: mockConvertToBase64,
            })
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should show an error if no file is selected", async () => {
        const { result } = setup();
        const event = { target: { files: null } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "1");

        expect(toast.error).toHaveBeenCalledWith(mockTrackClaimInfo.no_files_selected, { autoClose: 2000 });
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file name already exists", async () => {
        const { result } = setup();
        const file = new File(["content"], "Document 1.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "2");

        expect(toast.error).toHaveBeenCalledWith(
            `${file.name} - ${mockTrackClaimInfo.file_with_the_same_name_already_exists} `,
            { autoClose: 2000 }
        );
        expect(mockUpdateItemsError).toHaveBeenCalledWith("2", expect.any(String));
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file type is invalid", async () => {
        const { result } = setup();
        const file = new File(["content"], "Document 3.txt", { type: "text/plain" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "1");

        expect(toast.error).toHaveBeenCalledWith(
            `${mockTrackClaimInfo.invalid_file_type} for Document 1: ${file.type}`,
            { autoClose: 2000 }
        );
        expect(mockUpdateItemsError).toHaveBeenCalledWith("1", expect.any(String));
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file size exceeds the limit", async () => {
        const { result } = setup();
        const file = new File(["content".repeat(1024 * 1024 * 6)], "LargeFile.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "1");

        expect(toast.error).toHaveBeenCalledWith(
            `Document 1 exceeds ${mockTaskConstants.MAX_FILE_SIZE_MB} MB. Current size: 6.00 MB`,
            { autoClose: 2000 }
        );
        expect(mockUpdateItemsError).toHaveBeenCalledWith("1", expect.any(String));
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should upload the file successfully", async () => {
        const { result } = setup();
        const file = new File(["content"], "ValidFile.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        mockConvertToBase64.mockResolvedValueOnce("data:image/png;base64,content");

        await result.current.handleFileChange(event, "1");

        expect(mockConvertToBase64).toHaveBeenCalledWith(file);
        expect(mockUpdateItemsFile).toHaveBeenCalledWith("1", file, "content");
        expect(toast.success).toHaveBeenCalledWith(
            `${mockTrackClaimInfo.file_uploaded_successfully} for Document 1`,
            { autoClose: 2000 }
        );
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if converting file to Base64 fails", async () => {
        const { result } = setup();
        const file = new File(["content"], "ValidFile.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        mockConvertToBase64.mockRejectedValueOnce(new Error("Conversion failed"));

        await result.current.handleFileChange(event, "1");

        expect(mockConvertToBase64).toHaveBeenCalledWith(file);
        expect(toast.error).toHaveBeenCalledWith(mockTrackClaimInfo.error_converting_file_to_base_64, { autoClose: 2000 });
        expect(mockResetFileInput).toHaveBeenCalled();
    });
});