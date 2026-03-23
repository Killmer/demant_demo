import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';

export enum ButtonType {
  Button = 'Button',
  Submit = 'Submit',
}

interface Props {
  label: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  type?: ButtonType;
}


const Button: FunctionComponent<Props> = ({
  label,
  type = ButtonType.Button,
  children = undefined,
  className,
  disabled,
  onClick,
}) => {
  const content = children ?? label;

  return (
    <button
      type={type === ButtonType.Submit ? 'submit' : 'button'}
      style={{ pointerEvents: disabled ? 'none' : undefined }}
      className={clsx(className, 'bg-primary-weblink text-white text-small px-4 py-2 rounded-5')}
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
