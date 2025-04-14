import ThemeButton from "../ThemeButton";
interface ShowChipButtonProps {
  title: string;
  keywords: string[];
  handleOptions: (val:string, isSearched: boolean) => void;
}
export default function ShowChipButtons ({ title, keywords, handleOptions} : ShowChipButtonProps) {
  return (
    <>
      <div className="chip-placheholder walaa-regular-400">{title}</div>
      <div className="chip-list">
        {keywords.map((val: string, index: number) => (
          <ThemeButton
            key={index}
            className="chip-button "
            name={val}
            handleClick={() => {
              handleOptions(val, true);
            }}
          />
        ))}
      </div>
    </>
  )
}