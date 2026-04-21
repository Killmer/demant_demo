import { FC, ReactNode } from "react";
import { cn } from "src/lib/cn";

export enum ButtonType {
  Button = "Button",
  Submit = "Submit",
}

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

const variantStyles: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]:
    "bg-primary-weblink hover:bg-primary-weblink-hover text-white px-4 py-3 rounded-[20px]",
  [ButtonVariant.Secondary]:
    "border border-primary-weblink text-primary-weblink hover:bg-primary-weblink hover:text-white px-4 py-3 rounded-[20px]",
  [ButtonVariant.Tertiary]:
    "inline-flex items-center gap-2 text-primary-weblink hover:text-primary-weblink-hover",
};

interface Props {
  label: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
}

const Button: FC<Props> = ({
  label,
  type = ButtonType.Button,
  variant = ButtonVariant.Primary,
  children = undefined,
  className,
  disabled,
  onClick,
}) => {
  const content = children ?? label;

  return (
    <button
      type={type === ButtonType.Submit ? "submit" : "button"}
      style={{ pointerEvents: disabled ? "none" : undefined }}
      className={cn(
        "font-medium disabled:opacity-50 text-small",
        variantStyles[variant],
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
