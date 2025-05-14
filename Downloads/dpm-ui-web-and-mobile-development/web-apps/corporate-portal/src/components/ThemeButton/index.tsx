import { Button } from "react-bootstrap"
import "./index.scss";
export interface ThemeButtonProps {
	name: string;
	handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
}

const ThemeButton = ({name, handleClick, className, disabled = false, type }: ThemeButtonProps) => {
	return (
		<>
		{name && (<Button 
			className={`theme-button ${className ? className : ""} ${disabled ? "disabled-button" : ""}`}
			disabled={disabled}
			onClick={handleClick}
			type={type}
			data-testid={`themeButton${(name).replace(" ", "")}`}
		>
			<span>
				{name}
			</span>
		</Button>)}
		</>
	)
}

export default ThemeButton;