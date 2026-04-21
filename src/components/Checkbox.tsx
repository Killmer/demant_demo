import CheckmarkIcon from "images/checkmark.svg";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ children, error, checked, ...rest }, ref) => {
    return (
      <>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <span
            className={[
              "inline-flex items-center justify-center w-6 h-6 rounded-[4px] shrink-0",
              "bg-grey-1000",
            ].join(" ")}
            aria-hidden="true"
          >
            {checked ? (
              <CheckmarkIcon className="w-4 h-4 text-primary-weblink" />
            ) : null}
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            aria-invalid={!!error}
            ref={ref}
            {...rest}
          />
          <span className="text-tiny text-black-08 leading-[1.15] font-normal tracking-normal ">
            {children}
          </span>
        </label>
        {error ? (
          <div className="mt-2 text-tiny text-error">{error}</div>
        ) : null}
      </>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
