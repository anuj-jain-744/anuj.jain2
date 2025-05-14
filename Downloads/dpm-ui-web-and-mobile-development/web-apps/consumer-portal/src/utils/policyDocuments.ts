import {PDFDocument} from 'pdf-lib'

async function convertBase64toPdf(base64Str: string): Promise<Uint8Array> {

    if (!base64Str || typeof base64Str !== 'string') {    
      throw new Error('Invalid Base64 string provided.');  
    }
    const cleanBase64 = base64Str.replace(/[^A-Za-z0-9+/=]/g, '');
  
    try {
      const binaryStr = atob(cleanBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for(let i=0; i<binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
  
      const pdfDoc = await PDFDocument.load(bytes);
  
      const pdfBytes = await pdfDoc.save();
  
      return pdfBytes
      
    } catch (error) {
      console.error('Error decoding base64 string: ', error);
      throw new Error('Failed to convert Base64 to PDF!!')
    }
  }
  
  function isBase64(str: string) : boolean {
    const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!regex.test(str)) {
      return false;
    }
    
    // Decode and re-encode to verify
    const decoded = atob(str);
    return btoa(decoded) === str;
  }
  
  function openPdfInNewTab(pdfBytes: Uint8Array, fileName: string) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = fileName;
    link.dispatchEvent(new MouseEvent('click'));
  
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }

  export {
    convertBase64toPdf, isBase64, openPdfInNewTab
  }