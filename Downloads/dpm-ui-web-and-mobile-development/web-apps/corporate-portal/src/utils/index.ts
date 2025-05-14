export function getFullUrl(
  baseUrl: string,
  lang: string,
  route: string
): string {
  return `${baseUrl}/${lang}/api/${route}`;
}

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

export const camelCase = (str: string): string => {
  return  str?.charAt(0)?.toUpperCase() + str?.slice(1);
}
