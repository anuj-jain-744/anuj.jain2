import Button from "react-bootstrap/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";

interface IButtonType {
  isDisabled: boolean;
  title: string;
  value?: string;
  classes: string;
  onClickhandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "link" | "primary";
  icon?: boolean;
  iconRight?: boolean;
  iconName?: string;
  dataTestId?: string;
}

function ThemeButton({
  isDisabled,
  title,
  value,
  classes,
  variant,
  onClickhandler,
  icon,
  iconRight,
  iconName,
  dataTestId
}: IButtonType) {
  function ButtonIconFactory(name: string) {
    const IconFactory = {
      ChevronLeftIcon: <ChevronLeftIcon />,
      ChevronRightIcon: <ChevronRightIcon />,
      ArrowForwardIcon: <ArrowForwardIcon />,
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
      value={value}
      data-testid={dataTestId}
    >
      {icon && ButtonIconFactory(iconName as string)}
      {title}
      {iconRight && (
        <span className="mx-2">{ButtonIconFactory(iconName as string)}</span>
      )}
    </Button>
  );
}

export default ThemeButton;