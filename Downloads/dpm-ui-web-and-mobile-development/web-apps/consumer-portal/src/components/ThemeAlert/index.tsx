import { Alert } from "react-bootstrap";
import "./style.scss";

interface IThemeAlert {
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  title: string;
  classes: string;
}

const ThemeAlert: React.FC<IThemeAlert> = ({ title, variant, classes }) => {
  return (
    <Alert key={variant} variant={variant} className={classes}>
      {title}
    </Alert>
  );
};

export default ThemeAlert;
