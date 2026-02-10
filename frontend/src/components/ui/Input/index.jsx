import { forwardRef } from "react";
import clsx from "clsx";
import "./styles.css";

/**
 * Componente de Input Padronizado
 * @param {string} label - Texto que aparece acima do input
 * @param {string} error - Mensagem do erro 
 */

const Input = forwardRef(({ 
  label, 
  error, 
  className, 
  id,
  ...props 
}, ref) => { 
  
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={clsx("input-wrapper", className)}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref} 
        id={inputId}
        className={clsx(
          "input-field",
          error && "input--error"
        )}
        {...props}
      />
      {error && (
        <span className="input-error-msg">{error}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;