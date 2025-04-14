import sha256 from 'crypto-js/sha256';

export const encryptData = (data: string) => {
  return sha256(data).toString(); // returns encrypted data
}