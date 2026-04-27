import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  endAdornment?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, className, endAdornment, ...rest }, ref) => {
    return (
      <div>
        {label ? (
          <label
            className="block mb-2 text-small font-medium text-grey-0100"
            htmlFor={id}
          >
            {label}
          </label>
        ) : null}
        <div className="flex items-center gap-4">
          <input
            id={id}
            ref={ref}
            className={
              className ??
              [
                "w-full bg-grey-1000 rounded-2 px-4 py-3 text-regular placeholder:text-grey-0300 outline-none focus:ring-2 text-grey-0100",
                error
                  ? "border border-error focus:ring-error"
                  : "focus:ring-grey-0600",
              ].join(" ")
            }
            aria-invalid={!!error}
            {...rest}
          />
          {endAdornment}
        </div>
        {error ? (
          <div className="mt-2 text-tiny text-error">{error}</div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
