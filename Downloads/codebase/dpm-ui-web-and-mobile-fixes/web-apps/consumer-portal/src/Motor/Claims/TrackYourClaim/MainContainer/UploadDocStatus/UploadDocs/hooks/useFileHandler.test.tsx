import { renderHook } from "@testing-library/react-hooks";
import useFileHandler from "./useFileHandler";

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe("useFileHandler", () => {
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

    const setup = (fileItemsOverride?: any[]) =>
        renderHook(() =>
            useFileHandler({
                fileItems: fileItemsOverride || [
                    { id: "1", name: "Document 1", file: null },
                    { id: "2", name: "Document 2", file: null },
                ],
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

        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file name already exists", async () => {
        const existingFile = new File(["dummy"], "Document 1.png", { type: "image/png" });
        const { result } = setup([
            { id: "1", name: "Document 1", file: existingFile },
            { id: "2", name: "Document 2", file: null },
        ]);

        const newFile = new File(["content"], "Document 1.png", { type: "image/png" });
        const event = { target: { files: [newFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "2");

        expect(mockUpdateItemsError).toHaveBeenCalledWith("2", expect.any(String));
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file type is invalid", async () => {
        const { result } = setup();
        const file = new File(["content"], "Document 3.txt", { type: "text/plain" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        await result.current.handleFileChange(event, "1");

        expect(mockUpdateItemsError).toHaveBeenCalledWith("1", expect.any(String));
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if the file size exceeds the limit", async () => {
        const largeContent = new Array(1024 * 1024 * 6).fill("a").join(""); // ~6MB
        const largeFile = new File([largeContent], "LargeFile.png", { type: "image/png" });
        const event = { target: { files: [largeFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        const { result } = setup();

        await result.current.handleFileChange(event, "1");

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
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if converting file to Base64 fails", async () => {
        const { result } = setup();
        const file = new File(["content"], "ValidFile.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        mockConvertToBase64.mockRejectedValueOnce(new Error("Conversion failed"));

        await result.current.handleFileChange(event, "1");

        expect(mockConvertToBase64).toHaveBeenCalledWith(file);
        expect(mockResetFileInput).toHaveBeenCalled();
    });

    it("should show an error if target item is not found", async () => {
        const file = new File(["content"], "Unknown.png", { type: "image/png" });
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

        const { result } = setup();

        await result.current.handleFileChange(event, "non-existing-id");

        expect(mockResetFileInput).toHaveBeenCalled();
    });
});
