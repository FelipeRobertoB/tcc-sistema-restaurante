import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import "./styles.css";

export default function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = undefined,
  footer
}) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <div 
        className={clsx("drawer-overlay", isOpen && "open")} 
        onClick={onClose}
      />

      <div 
        className={clsx("drawer-content", isOpen && "open")}
        style={{ width: width }} 
      >
        <div className="drawer-header">
          <h2 className="drawer-title">{title}</h2>
          <button onClick={onClose} className="drawer-close" aria-label="Fechar">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-body">
          {children}
        </div>

        {footer && (
          <div className="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}