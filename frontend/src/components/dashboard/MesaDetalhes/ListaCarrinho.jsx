import { useMemo } from "react";
import Button from "../../ui/Button";
import Table from "../../ui/Table";   
import { Send, Trash2, AlertTriangle } from "lucide-react";

export default function ListaCarrinho({ carrinho, onRemover, onEnviar, loading }) {
  
  if (!carrinho || carrinho.length === 0) return null;

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  const columns = useMemo(() => [
    { 
      header: "Qtd", 
      accessor: "quantidade", 
      width: "10%", 
      align: "center" 
    },
    { 
      header: "Produto", 
      width: "50%",
      render: (item) => (
        <div>
          <span style={{ fontWeight: 500 }}>{item.nome}</span>
          {item.observacao && (
             <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {item.observacao}
             </div>
          )}
        </div>
      )
    },
    { 
      header: "Total", 
      width: "25%", 
      align: "right",
      render: (item) => (
         <span style={{ fontWeight: 'bold' }}>
            {formatMoney(item.preco * item.quantidade)}
         </span>
      )
    },
    {
      header: "", 
      width: "15%",
      align: "center",
      render: (item) => (
         <Button 
            variant="ghost"       
            size="sm"             
            icon={Trash2}        
            onClick={() => onRemover(item.uniqueId)}
            style={{ color: 'var(--danger)', padding: '4px', height: '30px' }} 
            title="Remover item"
         />
      )
    }
  ], [onRemover]); 

  return (
    <div className="carrinho-wrapper">
      <div className="carrinho-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#854d0e', fontWeight: 'bold' }}>
         <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> Pendente de Envio
         </span>
         <span>
            {formatMoney(totalCarrinho)}
         </span>
      </div>
      <Table 
         columns={columns} 
         data={carrinho} 
         keyExtractor="uniqueId" 
         maxHeight="180px"
      />
      <Button 
         onClick={onEnviar} 
         isLoading={loading}
         icon={Send}         
         className="w-full"
         style={{ 
            marginTop: '15px',
            width: '100%',
            backgroundColor: '#eab308', 
            borderColor: '#eab308', 
            color: '#000',
            fontWeight: 'bold'
         }} 
      >
         Enviar Pedido
      </Button>
    </div>
  );
}