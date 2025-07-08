export const getFileType=(base64String: string)=>{
 const mimeTypePattern = /^data:([^;]+);base64,/;
 const match = base64String.match(mimeTypePattern);

 if (match && match[1]) {
   return match[1];
 }

 return 'Unknown';
}