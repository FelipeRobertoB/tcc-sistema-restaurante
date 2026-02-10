import { useState, useMemo } from "react"; 
import Drawer from "../../ui/Drawer"; 
import Button from "../../ui/Button"; 
import ResumoFinanceiro from "../../ui/ResumoFinanceiro"; 
import { ReceiptText, ArrowRightLeft, Ban } from "lucide-react";
import { useComanda } from "../../../hooks/useComanda"; 
import "./styles.css";
import WidgetLivre from "./WidgetLivre";
import WidgetOcupada from "./WidgetOcupada";
import WidgetPagamento from "./WidgetPagamento";

export default function MesaDetalhes({ mesa, onClose, onUpdate }) {
    const [telaVisual, setTelaVisual] = useState(null);
    
    if (!mesa) return null;
    
    const statusAtivo = telaVisual || mesa.status;
    
    const { 
        itens, loading, carrinho, listaProdutos,
        abrirMesa, pedirConta, reabrir, transferirMesa, cancelarMesa,
        removerItemLancado, transferirItem,
        adicionarAoCarrinho, removerDoCarrinho, enviarPedido
    } = useComanda(mesa, onClose, onUpdate);

    const subtotal = useMemo(() => {
        const totalBanco = itens.reduce((acc, item) => acc + (item.total || 0), 0);
        const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        return totalBanco + totalCarrinho;
    }, [itens, carrinho]);

    const taxaServico = subtotal * 0.10;
    const totalFinal = subtotal + taxaServico;

    const getTitulo = () => {
        if (statusAtivo === 'LIVRE') return `Mesa ${mesa.numero} (Livre)`;
        if (statusAtivo === 'ABERTA') return `Mesa ${mesa.numero} - Em Atendimento`;
        if (statusAtivo === 'FECHADA' || statusAtivo === 'PAGAMENTO') return `Caixa - Mesa ${mesa.numero}`;
        return `Mesa ${mesa.numero}`;
    };

    const handleAbrir = async () => { 
        setTelaVisual('ABERTA'); 
        await abrirMesa(); 
    };

    const handleIrParaPagamento = async () => { 
        setTelaVisual('PAGAMENTO'); 
        await pedirConta(true); 
    };

    const handleVoltarConsumo = async () => { 
        setTelaVisual('ABERTA'); 
        await reabrir(); 
    };

    const handleFinalizar = async () => { 
        await onUpdate(); 
        onClose(); 
    };

    const renderFooter = () => {
        if (statusAtivo === 'LIVRE') return null;

        if (statusAtivo === 'ABERTA') {
            return (
                <div style={{ width: '100%' }}>
                    
                    <ResumoFinanceiro 
                        subtotal={subtotal}
                        taxaServico={taxaServico}
                        total={totalFinal}
                        className="mb-4"
                        style={{ marginBottom: '16px' }} 
                    />

                    <div className="actions-footer">
                        <Button 
                            variant="danger" 
                            icon={Ban}
                            onClick={() => {
                                if(window.confirm("Cancelar mesa inteira?")) cancelarMesa();
                            }}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>

                        <Button 
                            variant="outline"
                            icon={ArrowRightLeft}
                            onClick={transferirMesa}
                            disabled={loading}
                        >
                            Transferir
                        </Button>

                        <Button 
                            variant="success"
                            icon={ReceiptText} 
                            onClick={handleIrParaPagamento} 
                            disabled={loading || (itens.length === 0 && carrinho.length === 0)}
                        >
                            Fechar Conta
                        </Button>
                    </div>
                </div>
            );
        }
        return null; 
    };

    const renderConteudo = () => {
        if (statusAtivo === 'LIVRE') return <div style={{paddingTop: '50px'}}><WidgetLivre mesa={mesa} onAbrir={handleAbrir} /></div>;
        
        if (statusAtivo === 'ABERTA') {
            return (
                <WidgetOcupada 
                    itens={itens}
                    carrinho={carrinho}
                    listaProdutos={listaProdutos}
                    loading={loading}
                    onAdicionarAoCarrinho={adicionarAoCarrinho}
                    onRemoverDoCarrinho={removerDoCarrinho}
                    onEnviarPedido={enviarPedido}
                    onRemoverItemLancado={removerItemLancado}
                    onTransferirItem={transferirItem}
                />
            );
        }

        if (statusAtivo === 'FECHADA' || statusAtivo === 'PAGAMENTO') {
            return <WidgetPagamento mesa={mesa} itens={itens} onReabrir={handleVoltarConsumo} onFinalizar={handleFinalizar} />;
        }
        return null;
    };

    return (
        <Drawer 
            isOpen={true} 
            onClose={onClose} 
            title={getTitulo()} 
            footer={renderFooter()} 
        >
            {renderConteudo()}
        </Drawer>
    );
}