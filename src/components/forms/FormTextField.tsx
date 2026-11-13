import type { InputHTMLAttributes, ReactNode } from "react";

type FormTextFieldProps = {
  id: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormTextField({
  id,
  label,
  error,
  hint,
  className = "",
  ...inputProps
}: FormTextFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`input ${error ? "error-input" : ""} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...inputProps}
      />
      {error ? (
        <span id={`${id}-error`} className="error-legend" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
