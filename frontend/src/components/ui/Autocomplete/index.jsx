import { useState, useEffect, useRef } from "react";
import Input from "../Input";
import "./styles.css";

export default function Autocomplete({ 
  data = [], 
  displayKey = "nome", 
  secondaryKey = "preco",
  placeholder,
  onSelect,
  autoFocus = false,
  className,
  onEnterEmpty,
  value,            
  onChangeText     
}) {
  const [internalBusca, setInternalBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const busca = value !== undefined ? value : internalBusca;

  useEffect(() => {
    if (busca.length > 0 && showSugestoes) {
      const termo = busca.toLowerCase();
      const filtrados = data.filter(item => {
         const valorPrincipal = String(item[displayKey]).toLowerCase();
         const valorCodigo = item.codigo ? String(item.codigo).toLowerCase() : "";
         return valorPrincipal.includes(termo) || valorCodigo.includes(termo);
      }).slice(0, 5);

      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  }, [busca, data, showSugestoes, displayKey]);

  const handleChange = (e) => {
    const novoTexto = e.target.value;

    if (onChangeText) onChangeText(novoTexto);
    else setInternalBusca(novoTexto);

    setShowSugestoes(true);
    setSelectedIndex(-1);
  };

  const handleSelect = (item) => {
    if (!item) return;
    if (onChangeText) onChangeText(item[displayKey]);
    else setInternalBusca(item[displayKey]);

    setShowSugestoes(false);
    onSelect(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && sugestoes[selectedIndex]) {
        e.preventDefault();
        handleSelect(sugestoes[selectedIndex]);
      } 
      else if (sugestoes.length > 0) {
        e.preventDefault();
        handleSelect(sugestoes[0]); 
      }
      else if (busca.trim() === "") {
        if (onEnterEmpty) {
            e.preventDefault();
            onEnterEmpty(); 
        }
      }
    } 
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, sugestoes.length - 1));
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    }
    else if (e.key === "Escape") {
      setShowSugestoes(false);
    }
  };

  return (
    <div className={`autocomplete-wrapper ${className || ''}`}>
      <Input 
        ref={inputRef}
        value={busca}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSugestoes(false), 200)}
        onFocus={() => setShowSugestoes(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="form-input"
      />

      {showSugestoes && sugestoes.length > 0 && (
        <ul className="suggestions-list">
          {sugestoes.map((item, index) => (
            <li 
              key={index}
              className={`suggestion-item ${index === selectedIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(item)} 
            >
              <span>{item[displayKey]}</span>
              {item[secondaryKey] && (
                 <span className="suggestion-detail">
                    {typeof item[secondaryKey] === 'number' 
                        ? `R$ ${item[secondaryKey].toFixed(2)}` 
                        : item[secondaryKey]}
                 </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}