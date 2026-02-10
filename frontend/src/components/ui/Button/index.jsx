import clsx from "clsx";
import { Loader2 } from "lucide-react";
import "./styles.css";

/**
 * Componente de Botão Reutilizável
 * @param {string} variant - primary | outline | ghost | danger | success
 * @param {string} size - sm | md | lg | icon
 * @param {boolean} isLoading - Se true, mostra spinner e bloqueia clique
 * @param {ReactNode} icon - Ícone opcional (Lucide) para aparecer antes do texto
 * @param {string} className - Classes extras passadas pelo pai
 */

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  icon: Icon,
  className,
  disabled,
  ...props 
}) {
  
  const classes = clsx(
    "btn",               
    `btn--${variant}`,    
    `btn--${size}`,   
    isLoading && "btn--loading", 
    className            
  );

  return (
    <button 
      className={classes} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="spinner" size={18} />
      ) : (
        
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
}