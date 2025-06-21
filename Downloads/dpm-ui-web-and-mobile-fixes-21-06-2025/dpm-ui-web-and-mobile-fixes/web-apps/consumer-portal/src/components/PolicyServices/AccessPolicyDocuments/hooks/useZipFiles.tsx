import JSZip from 'jszip';

const useZipFiles = () => {
  const createZip = async (files: Array<{ name: string; data: string }>) => {
    const zip = new JSZip();
    const fileNames = new Set<string>();

    for (const file of files) {
      const { name, data } = file;
      let uniqueName = name;
      let counter = 1;

      while (fileNames.has(uniqueName)) {
        const nameParts = name.split('.');
        const baseName = nameParts.join('.');
        uniqueName = `${baseName}_${counter}`;
        counter++;
      }

      fileNames.add(uniqueName);
      zip.file(uniqueName, data, { binary: true });
    }

    const content = await zip.generateAsync({ type: 'blob' });
    return content;
  };

  return { createZip };
};

export default useZipFiles;