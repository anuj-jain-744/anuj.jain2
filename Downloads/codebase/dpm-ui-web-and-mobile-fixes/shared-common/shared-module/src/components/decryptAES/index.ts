import CryptoJS from "crypto-js";

export const decryptAES = (data: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(data, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
