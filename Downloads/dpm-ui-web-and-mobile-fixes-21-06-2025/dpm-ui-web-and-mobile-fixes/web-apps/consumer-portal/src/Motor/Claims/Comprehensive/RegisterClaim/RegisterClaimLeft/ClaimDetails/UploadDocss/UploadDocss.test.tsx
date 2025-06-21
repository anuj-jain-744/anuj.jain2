
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadDocss from "./index";
import { LanguageData } from "types/languageData";
import { toast } from 'react-toastify';
import ModalClaimUpload from "../ModalClaimUpload";

// Mock necessary dependencies and imports
jest.mock("@mui/icons-material/WarningAmberOutlined", () => ({
  __esModule: true,
  default: () => <div>WarningAmberOutlinedIcon</div>,
}));

jest.mock('react-toastify', () => ({
    toast: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

const mockLanguageData: LanguageData = {
  moroor_report: "Moroor Report",
  quotation: "Quotation",
  spare_parts: "Spare Parts",
  moroor_sketch: "Moroor Sketch",
  other_documents: "Other Documents",
  upload: "Upload",
  upload_the_supporting_docs: "Upload the Supporting Documents",
  supported_file_type_doc: "Supported file types: PDF, DOCX, JPG, PNG",
  file_size_exceeds_5mb_plea: "File size exceeds 5MB. Please upload a smaller file.",
  not_a_valid_file: "This is not a valid file type.",
  uploaded_all_required_docu: "All required documents uploaded",
};
describe("ModalClaimUpload", () => {
  it("renders UploadFiles component", () => {
    const mockChangeHandlerFiles = jest.fn();
    const mockCheckHandler = jest.fn();
    const { container } = render(<ModalClaimUpload
      changeHandlerFiles={mockChangeHandlerFiles}
      checkHandler={mockCheckHandler}
    />);
    const element = container.querySelector('.uploadfncontainer');
    expect(element).toBeInTheDocument();
  });
  // it("should trigger file selection when clicking on upload button", () => {
  //   const { container } = render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   // Mocking the file input click
  //   const uploadButton = container.querySelector('.container-accordion');
  //   fireEvent.click(uploadButton!);

  //   const fileInput = container.querySelector('input[type="file"]');
  //   expect(fileInput).toBeInTheDocument();
  // });

  // it("should show an error if file exceeds size limit", async () => {
  //   const { container } = render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   const fileInput = container.querySelector('input[type="file"]');
  //   const file = new File(["dummy content"], "test.pdf", { type: "application/pdf", size: 10 * 1024 * 1024 }); // 6MB file

  //   fireEvent.change(fileInput!, { target: { files: [file] } });

  //   // Wait for the error toast to be shown
  //    waitFor(() =>
  //     expect(toast.error).toHaveBeenCalledWith(
  //       mockLanguageData.file_size_exceeds_5mb_plea,
  //       expect.any(Object)
  //     )
  //   );
  // });

  // it("should show an error if file type is not valid", async () => {
  //   const { container } = render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   const fileInput = container.querySelector('input[type="file"]');
  //   const file = new File(["dummy content"], "test.exe", { type: "application/octet-stream" }); // Invalid file type

  //   fireEvent.change(fileInput!, { target: { files: [file] } });

  //   // Wait for the error toast to be shown
  //   await waitFor(() =>
  //     expect(toast.error).toHaveBeenCalledWith(
  //       mockLanguageData.not_a_valid_file,
  //       expect.any(Object)
  //     )
  //   );
  // });

  // it("should add a file to the uploaded list", async () => {
  //   const { container } = render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   const fileInput = container.querySelector('input[type="file"]');
  //   const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
  //   const file1 = new File(["dummy content1"], "test1.pdf", { type: "application/pdf" });

  //   fireEvent.change(fileInput!, { target: { files: [file,file1] } });

  //   await waitFor(() => {
  //     expect(screen.getByText(file.name)).toBeInTheDocument();
  //   });
  // });

  // it("should remove an uploaded file", async () => {
  //   render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   expect(screen.getByTestId('toggle-btnid')).toBeInTheDocument();
  //   fireEvent.click(screen.getByTestId('toggle-btnid'));
  //   waitFor(()=> {
  //     expect(screen.getByTestId('accordion-testid')).toBeInTheDocument()
  //     fireEvent.click(screen.getByTestId('accordion-testid'))
  //   })
   
  //   const moroorInput = screen.getByTestId('file_nameid_0');
  //   const quotationInput = screen.getByTestId('file_nameid_1');
  //   const spare_partsInput = screen.getByTestId('file_nameid_2');
  //   const moroorSketchInput = screen.getByTestId('file_nameid_3');
  //   const otherDocsInput = screen.getByTestId('file_nameid_4');
  //   const moroorFile = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
  //   const quotationfile = new File(["dummy content1"], "test1.pdf", { type: "application/pdf" });
  //   const sparePartsFile = new File(["dummy content2"], "test2.pdf", { type: "application/pdf" });
  //   const moroorSketchFile = new File(["dummy content3"], "test3.pdf", { type: "application/pdf" });
  //   const otherDocsFile = new File(["dummy content4"], "test4.pdf", { type: "application/pdf" });

  //   fireEvent.change(moroorInput!, { target: { files: [moroorFile] } });
  //   fireEvent.change(quotationInput!, { target: { files: [quotationfile] } });
  //   fireEvent.change(spare_partsInput!, { target: { files: [sparePartsFile] } });
  //   fireEvent.change(moroorSketchInput!, { target: { files: [moroorSketchFile] } });
  //   fireEvent.change(otherDocsInput!, { target: { files: [otherDocsFile] } });

  //   await waitFor(() => {
  //     expect(screen.getByText(moroorFile.name)).toBeInTheDocument();
  //     expect(screen.getByText(quotationfile.name)).toBeInTheDocument();
  //     expect(screen.getByText(sparePartsFile.name)).toBeInTheDocument();
  //     const removeButton =  screen.getByTestId('moroor_testid');
  //     const removeButton1 =  screen.getByTestId('quotation_testid');
  //     const removeButton2 =  screen.getByTestId('spare_parts_testid');
  //     const removeButton3 =  screen.getByTestId('moroor_sketch_testid');
  //     const removeButton4 =  screen.getByTestId('other_documents_testid');
  //     expect(removeButton).toBeInTheDocument();
  //     fireEvent.click(removeButton);
  //     fireEvent.click(removeButton1);
  //     fireEvent.click(removeButton2);
  //     fireEvent.click(removeButton3);
  //     fireEvent.click(removeButton4);
  //   });

  //   await waitFor(() => {
  //     expect(screen.queryByText(moroorFile.name)).not.toBeInTheDocument();
  //     expect(screen.queryByText(quotationfile.name)).not.toBeInTheDocument();
  //     expect(screen.queryByText(sparePartsFile.name)).not.toBeInTheDocument();
  //     expect(screen.queryByText(moroorSketchFile.name)).not.toBeInTheDocument();
  //   });
  // });

  // it("should show a success message when all required documents are uploaded", async () => {
  //   const { container } = render(
  //     <UploadDocs
  //       languageData={mockLanguageData}
  //       fileData={[]}
  //       setFileData={jest.fn()}
  //     />
  //   );

  //   const fileInput = container.querySelector('input[type="file"]');
  //   const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });

  //   fireEvent.change(fileInput!, { target: { files: [file] } });

  //   await waitFor(() => {
  //     expect(screen.getByText(mockLanguageData.uploaded_all_required_docu)).toBeInTheDocument();
  //   });
    
  // });
});
