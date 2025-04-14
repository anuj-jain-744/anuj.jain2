import { Variant } from "@mui/material/styles/createTypography";
import "./index.scss";

interface TypographyComponentProps {
    variant?: Variant;
    content: string;
    color?: string;
}

const TypographyComponent = ({ variant = "body1", content, color="primary" }: TypographyComponentProps) => {
    
    const getColor = () => {
        switch (color) {
            case "primary":
                return "typo-primary";
            default:
                return "";
        }
    }
    
    return (
        <div 
            className={`typo-${variant} ${getColor()}`}
        >
            {content}
        </div>
    );
}

export default TypographyComponent;
