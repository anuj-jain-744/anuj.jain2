import Button from "react-bootstrap/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAlt";
import Receipt from "@mui/icons-material/ReceiptLong";
import CheckIcon from "@mui/icons-material/Check";

interface IButtonType {
  isDisabled?: boolean;
  title: string;
  classes: string;
  onClickhandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "link" | "primary";
  iconLeft?: boolean;
  iconRight?: boolean;
  iconName?: string;
  dataTestId?: string;
}

function ThemeButton({
  isDisabled,
  title,
  classes,
  variant,
  onClickhandler,
  iconLeft,
  iconRight,
  iconName,
  dataTestId
}: IButtonType) {
  function ButtonIconFactory(name: string) {
    const IconFactory = {
      ChevronLeftIcon: <ChevronLeftIcon />,
      ChevronRightIcon: <ChevronRightIcon />,
      ArrowRightIcon: <ArrowRightIcon />,
      Receipt: <Receipt />,
      CheckIcon: <CheckIcon />,
    };
    return IconFactory[name as keyof object];
  }
  return (
    <Button
      className={
        isDisabled
          ? `${classes} register-call2action disabled`
          : `${classes} register-call2action`
      }
      variant={variant ? variant : "primary"}
      size="lg"
      disabled={isDisabled}
      onClick={onClickhandler}
      title={title}
      data-testid={dataTestId}
    >
      {iconLeft && ButtonIconFactory(iconName as string)}
      {title}
      {iconRight && ButtonIconFactory(iconName as string)}
    </Button>
  );
}

export default ThemeButton;
