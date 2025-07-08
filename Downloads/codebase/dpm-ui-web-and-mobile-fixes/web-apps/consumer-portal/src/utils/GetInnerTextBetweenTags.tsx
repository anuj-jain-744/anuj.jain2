export function getInnerTextBetweenTags (text: string, startTag: string, endTag: string): string | null {
    const startIndex = text.indexOf(startTag);
    const endIndex = text.indexOf(endTag);
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      return text.substring(startIndex + startTag.length, endIndex);
    }
    return null;
  }