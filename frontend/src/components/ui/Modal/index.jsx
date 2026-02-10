import { useEffect } from "react";
import { X } from "lucide-react";
import "./styles.css";

/**
 * Componente de Janela Modal
 * @param {boolean} isOpen - Se true, aparece na tela
 * @param {function} onClose - Função para fechar o modal
 * @param {string} title - Título no topo (opcional)
 * @param {ReactNode} children - O conteúdo de dentro
 */
export default function Modal({ isOpen, onClose, title, children }) {

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    
    if (isOpen) {
        window.addEventListener("keydown", handleEsc);
    }
    
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button className="btn-close-modal" onClick={onClose} aria-label="Fechar">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
            {children}
        </div>
        
      </div>
    </div>
  );
}