export const getPascalCase = (str: string | undefined): string | undefined => {
    return (str ?? '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };