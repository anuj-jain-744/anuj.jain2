# How to Use the `useDownloadPDF` Custom Hook

The `useDownloadPDF` custom hook allows you to process and download PDF files or zip files containing PDFs. Below are the steps to use this hook effectively in your React application.

## Import the Hook

First, import the `useDownloadPDF` hook into your component:

```tsx
import { useDownloadPDF } from 'path/to/useDownloadPdf';

```

# Using the Hook

Call the `useDownloadPDF` hook within your component to access its functionalities:
```tsx
const { processPDFs, downloadFiles, isProcessing, error } = useDownloadPDF();
```
## Example Usage

Get PDF Files Without Downloading

To process PDF data and get the files without automatically downloading them:

```tsx
const pdfFiles = await processPDFs(data, {
  format: 'pdf',
  autoDownload: false
});
```

## Download PDF Files Directly
To process PDF data and download the files automatically:

```tsx
await processPDFs(data, {
  format: 'pdf',
  autoDownload: true
});

```

## Get Zip File Without Downloading
To process PDF data and get a zip file without automatically downloading it:
```tsx
const zipBlob = await processPDFs(data, {
  format: 'zip',
  autoDownload: false,
  zipFileName: 'documents.zip'
});

```
## Download Zip File Directly
To process PDF data and download a zip file automatically:

```tsx
await processPDFs(data, {
  format: 'zip',
  autoDownload: true,
  zipFileName: 'documents.zip'
});
```

## Manual Download of PDF Files
To manually download PDF files after processing:

```tsx
const pdfFiles = await processPDFs(data, {
  format: 'pdf',
  autoDownload: false
});
downloadFiles(pdfFiles);
```



## Functions Overview

- **processPDFs**: This function processes PDF data and returns either files or blobs based on the specified options.
- **downloadFiles**: A utility function that allows for manual downloading of an array of PDF files.
- **isProcessing**: A boolean value indicating whether the processing is currently ongoing.
- **error**: An error object that captures any issues encountered during processing.

## Important Notes
- Ensure that the `data` passed to `processPDFs` adheres to the correct format as defined by the `PDFDataStructure` interface.
- If you wish to utilize ZIP functionality, provide the `createZip` function.


