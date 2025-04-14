function getPriceFormat(value: number): string {
  const [integerPart, decimalPart] = value.toFixed(2).split(".");

  const formattedIntegerPart = parseInt(integerPart).toLocaleString();

  return `${formattedIntegerPart}.${decimalPart}`;
}

export { getPriceFormat };
