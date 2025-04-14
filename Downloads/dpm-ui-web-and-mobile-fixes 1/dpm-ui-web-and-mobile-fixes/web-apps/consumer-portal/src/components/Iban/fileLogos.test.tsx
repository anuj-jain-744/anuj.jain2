import { fileLogos } from './fileLogos';
import PDF from 'assets/IbanValidation/PDF.svg';
import DOC from 'assets/IbanValidation/DOC.svg';
import DOCX from 'assets/IbanValidation/DOCX.svg';
import JPG from 'assets/IbanValidation/JPG.svg';
import PNG from 'assets/IbanValidation/PNG.svg';

describe('fileLogos', () => {
  test('should return correct logo for each file type', () => {
    expect(fileLogos.doc).toBe(DOC);
    expect(fileLogos.docx).toBe(DOCX);
    expect(fileLogos.pdf).toBe(PDF);
    expect(fileLogos.jpg).toBe(JPG);
    expect(fileLogos.jpeg).toBe(JPG);
    expect(fileLogos.png).toBe(PNG);
  });

  test('should return null for unsupported file types', () => {
    expect(fileLogos.txt).toBeUndefined();
    expect(fileLogos.gif).toBeUndefined();
  });
});