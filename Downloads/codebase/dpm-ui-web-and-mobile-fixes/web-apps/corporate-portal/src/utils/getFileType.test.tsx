import { getFileType } from "./getFileType"; 

describe("getFileType Function", () => {
  it("should return correct MIME type for valid base64 image", () => {
    const base64Image = "data:image/png;base64,iVBORw...";
    expect(getFileType(base64Image)).toBe("image/png");
  });

  it("should return correct MIME type for valid base64 PDF", () => {
    const base64Pdf = "data:application/pdf;base64,JVBERi...";
    expect(getFileType(base64Pdf)).toBe("application/pdf");
  });

  it("should return correct MIME type for valid base64 text file", () => {
    const base64Text = "data:text/plain;base64,dGVzdA==";
    expect(getFileType(base64Text)).toBe("text/plain");
  });

  it("should return 'Unknown' for invalid base64 format", () => {
    const invalidBase64 = "randomdatahere";
    expect(getFileType(invalidBase64)).toBe("Unknown");
  });

  it("should return 'Unknown' for missing MIME type in base64 string", () => {
    const missingMimeBase64 = "data:;base64,abcd1234";
    expect(getFileType(missingMimeBase64)).toBe("Unknown");
  });

  it("should return 'Unknown' for empty string input", () => {
    expect(getFileType("")).toBe("Unknown");
  });
});
