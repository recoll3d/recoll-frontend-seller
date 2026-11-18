import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type FormPasswordFieldProps = {
  id: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function FormPasswordField({
  id,
  label,
  error,
  hint,
  className = "",
  ...inputProps
}: FormPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`input input-password ${error ? "error-input" : ""} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...inputProps}
        />
        <button
          type="button"
          className="input-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
        >
          {visible ? <FaEyeSlash className="text-lg" aria-hidden /> : <FaEye className="text-lg" aria-hidden />}
        </button>
      </div>
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