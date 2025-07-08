
export function formatDate(inputDate: string | Date): string {
    const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    // Ensure the date is treated as UTC
    const day = String(date?.getUTCDate()).padStart(2, '0');
    const month = String(date?.getUTCMonth() + 1).padStart(2, '0');
    const year = date?.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }
  