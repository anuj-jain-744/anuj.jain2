interface MobileStringType {
  stringToBeMask: string;
  start: number;
  end: number;
}
export const createMaskString: React.FC<MobileStringType> = ({
  stringToBeMask,
  start,
  end,
}) => {
  if (start < 0 || end >= stringToBeMask?.length || start > end) {
    console.error("Invalid start or end values");
    return "";
  } else if (stringToBeMask && stringToBeMask?.length > 0) {
    const visibleStart = stringToBeMask.slice(0, start); // Start part visible
    const visibleEnd = stringToBeMask.slice(end + 1); // End part visible
    const maskedMiddle = stringToBeMask
      .slice(start, end + 1)
      .replace(/./g, "*");
    return `${visibleStart}${maskedMiddle}${visibleEnd}`;
  }
  return "";
};
