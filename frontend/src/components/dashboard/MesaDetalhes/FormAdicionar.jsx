import { useState, useRef } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input"; 
import Autocomplete from "../../ui/Autocomplete"; 
import { Plus, MessageSquare } from "lucide-react";

export default function FormAdicionar({ 
  listaProdutos, 
  onAdicionar,
  temPendencias, 
  onConfirmar 
}) {
  
  const [qtd, setQtd] = useState(1);
  const [obs, setObs] = useState("");
  const [showObs, setShowObs] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const inputQtdRef = useRef(null);
  const handleSelectProduto = (produto) => {
    setProdutoSelecionado(produto);
    setTimeout(() => inputQtdRef.current?.focus(), 50);
  };

  const handleAdicionarFinal = () => {
    if (!produtoSelecionado) return;
    onAdicionar(produtoSelecionado, Number(qtd), obs);
    setProdutoSelecionado(null);
    setQtd(1);
    setObs("");
    setShowObs(false);
    setFormKey(prev => prev + 1); 
  };

  const handleKeyDownQtd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdicionarFinal();
    }
  };

  const handleEnterNoVazio = () => {
    if (temPendencias && onConfirmar) {
        const confirmou = window.confirm(`Deseja confirmar o lançamento destes itens?`);
        
        if (confirmou) {
            onConfirmar();
        }
    }
  };

  return (
    <div className="form-add-container">
      <div className="form-row" style={{ alignItems: 'flex-start' }}>
        
        <div style={{ flex: 3 }}>
            <Autocomplete 
                key={formKey} 
                data={listaProdutos}
                displayKey="nome"
                secondaryKey="preco"
                placeholder={temPendencias ? "Busque... ou ENTER para Confirmar" : "Buscar produto ou código..."} 
                onSelect={handleSelectProduto}
                autoFocus
                onEnterEmpty={handleEnterNoVazio}
            />
        </div>
        <div style={{ flex: 1, minWidth: '80px' }}>
             <Input 
                ref={inputQtdRef}
                type="number" 
                min="1" 
                value={qtd}
                onChange={e => setQtd(e.target.value)}
                onKeyDown={handleKeyDownQtd}
                onFocus={(e) => e.target.select()}
                className="form-input text-center"
            />
        </div>
        <Button 
            type="button" 
            variant={showObs ? "primary" : "outline"}
            onClick={() => setShowObs(!showObs)}
            title="Adicionar Observação"
            className="btn-square" 
        >
            <MessageSquare size={20} />
        </Button>
      </div>
      <div 
        style={{ 
            overflow: 'hidden', 
            transition: 'all 0.3s ease',
            maxHeight: showObs ? '50px' : '0',
            opacity: showObs ? 1 : 0,
            marginTop: '5px'
        }}
      >
         <Input 
            placeholder="Ex: Sem cebola..."
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="form-input"
            onKeyDown={(e) => e.key === "Enter" && handleAdicionarFinal()}
         />
      </div>

      <div style={{ marginTop: '8px' }}>
        <Button 
            onClick={handleAdicionarFinal} 
            size="sm" 
            icon={Plus} 
            style={{ width: '100%' }}
            disabled={!produtoSelecionado} 
        >
            Adicionar Item
        </Button>
      </div>
    </div>
  );
}