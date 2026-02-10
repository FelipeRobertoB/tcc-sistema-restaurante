import { useMemo } from "react";
import Button from "../../ui/Button";
import Table from "../../ui/Table";
import { Trash2, ArrowRightLeft, Check, AlertCircle } from "lucide-react";

import FormAdicionar from "./FormAdicionar";

export default function WidgetOcupada({ 
  itens,           
  carrinho,        
  listaProdutos,
  loading,
  onAdicionarAoCarrinho, 
  onRemoverDoCarrinho, 
  onEnviarPedido,
  onRemoverItemLancado,
  onTransferirItem
}) {
  
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const dadosUnificados = useMemo(() => {
    const listaBanco = itens.map(i => ({
      ...i,
      idUnico: `banco-${i.idItem}`,
      status: 'CONFIRMADO',
      totalCalculado: i.total,
      unitario: i.total / i.quantidade 
    }));
    const listaCarrinho = carrinho.map(i => ({
      ...i,
      idUnico: `carrinho-${i.uniqueId}`,
      nomeProduto: i.nome,
      totalCalculado: i.preco * i.quantidade,
      status: 'PENDENTE',
      originalId: i.uniqueId,
      unitario: i.preco 
    }));
    return [...listaCarrinho, ...listaBanco];
  }, [itens, carrinho]);
  const columns = useMemo(() => [
    { 
        header: "Qtd.", 
        accessor: "quantidade", 
        width: "10%",      
        align: "center"    
    },
    { 
      header: "Produto", 
      width: "40%", 
      align: "left",       
      render: (item) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
             {item.status === 'PENDENTE' && <AlertCircle size={12} color="var(--danger)" />}
             {item.nomeProduto}
          </span>
          {item.observacao && (
              <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: item.status === 'PENDENTE' ? '17px' : '0' }}>
                  {item.observacao}
              </span>
          )}
        </div>
      )
    },
    { 
        header: "Un.", 
        width: "15%", 
        align: "right", 
        render: (item) => (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {formatMoney(item.unitario)}
            </span>
        )
    },
    { 
      header: "Total", 
      width: "15%", 
      align: "right", 
      render: (item) => <span style={{ fontWeight: 'bold' }}>{formatMoney(item.totalCalculado)}</span>
    },
    {
      header: "Ações", 
      width: "20%", 
      align: "center",
      render: (item) => {
         if (item.status === 'PENDENTE') {
             return (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Trash2} 
                    onClick={() => onRemoverDoCarrinho(item.originalId)} 
                    title="Remover lançamento"
                    style={{ color: 'var(--danger)', height: '28px', width: '28px', padding: 0 }} 
                />
             );
         }
         
         return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={ArrowRightLeft} 
                    onClick={() => onTransferirItem(item.idItem)} 
                    title="Transferir" 
                    style={{ color: 'var(--primary)', height: '28px', width: '28px', padding: 0 }} 
                />
                <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Trash2} 
                    onClick={() => onRemoverItemLancado(item.idItem)} 
                    title="Cancelar" 
                    style={{ color: 'var(--text-secondary)', height: '28px', width: '28px', padding: 0 }} 
                />
            </div>
         );
      }
    }
  ], [onRemoverDoCarrinho, onTransferirItem, onRemoverItemLancado]); 


  return (
    <div>
      <FormAdicionar 
          listaProdutos={listaProdutos} 
          onAdicionar={onAdicionarAoCarrinho}
          
          temPendencias={carrinho.length > 0} 
          onConfirmar={onEnviarPedido}
      />
      {carrinho.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <Button 
                 onClick={onEnviarPedido} 
                 isLoading={loading}
                 icon={Check}
                 style={{ 
                    backgroundColor: '#16a34a', 
                    color: '#fff', 
                    fontWeight: '600',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    boxShadow: '0 2px 5px rgba(22, 163, 74, 0.3)'
                 }} 
              >
                 Confirmar ({carrinho.length})
              </Button>
          </div>
      )}
      {dadosUnificados.length === 0 ? (
          <div className="center-box text-muted" style={{ padding: '30px', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
             Nenhum pedido lançado.
          </div>
      ) : (
          <Table 
             columns={columns} 
             data={dadosUnificados} 
             keyExtractor="idUnico" 
             maxHeight="400px" 
             rowClassName={(row) => row.status === 'PENDENTE' ? 'row-pendente' : ''}
          />
      )}

    </div>
  );
}