import CryptoJS from "crypto-js";

export const encryptAES = (data: string, key: string) => {
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
  return ciphertext;
};
