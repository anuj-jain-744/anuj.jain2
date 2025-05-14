interface ShowOptionsProps {
  options: string[];
  handleOptions: (val:string, isSearched: boolean) => void; 
  searchInput: string;
}
export default function ShowOptions ({ options, handleOptions, searchInput} : ShowOptionsProps) {
  const heighLighttext = (text: string) => {
    const lowerCaseText = text.toLowerCase();
    const lowerCaseInput = searchInput.toLowerCase();
    const startIndex = lowerCaseText.indexOf(lowerCaseInput);
    const lastIndex = startIndex + lowerCaseInput.length;
    return (
      <>
        {text.substring(0, startIndex)}
        <span>
          {text.substring(startIndex, lastIndex)}
        </span>
        {text.substring(lastIndex)}
      </>
    )
  }

  return (
    <div className="search-chips">
      <div className="search-chips-container">
        <div className="search-chips-options walaa-regular-400">
          {options.map((val: string, index: number) => (
            <span
              data-testid={`span-highlighted-${index}`}
              key={index} 
              onClick={() => {
                handleOptions(val, true); 
              }}
            >
              {heighLighttext(val)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}