import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    required = false,
    className = "",
    id,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        className={`
          w-full border bg-white px-3.5 py-2.5
          text-sm text-slate-800
          outline-none
          transition-all duration-200
          placeholder:text-slate-400
          focus:border-cyan-700
          focus:ring-2 focus:ring-cyan-700/10
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-500
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-slate-300"
          }
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 text-xs text-slate-500"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;