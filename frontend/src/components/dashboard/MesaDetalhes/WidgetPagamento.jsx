import { useMemo } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Table from "../../ui/Table"; 
import { Trash2, Banknote, CreditCard, Wallet, CheckCircle, RotateCcw } from "lucide-react";
import { formatCurrency } from "../../../utils/format"; 

import { usePagamentoWidget } from "./hooks/usePagamentoWidget";
import ResumoLateral from "./ResumoLateral"; 

export default function WidgetPagamento({ mesa, itens, onReabrir, onFinalizar }) {
    
    const {
        itensAgrupados, resumo, pagamentos, loading,
        incluirTaxa, descontoDigitado, metodoSelecionado, valorInput,
        toggleTaxa, changeDesconto, addPagamento, removePagamento, confirmar, setMetodo, setValor
    } = usePagamentoWidget(mesa, itens, onFinalizar);

    const getIconeMetodo = (metodo) => {
        if(metodo === 'DINHEIRO') return <Banknote size={16} />;
        if(metodo === 'PIX') return <Wallet size={16} />;
        return <CreditCard size={16} />;
    };

    const columnsPagamentos = useMemo(() => [
        { 
            header: "Método", width: "45%", 
            render: (p) => <div style={{display:'flex', gap:'8px', alignItems:'center'}}>{getIconeMetodo(p.metodo)}<span>{p.metodo.replace('CARTAO_', '').replace('_', ' ')}</span></div>
        },
        { header: "Valor", width: "35%", align: "right", render: (p) => <strong>{formatCurrency(p.valor)}</strong> },
        { 
            header: "", width: "20%", align: "center", 
            render: (p) => <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removePagamento(p.id)} style={{ color: 'var(--danger)', padding: 0, height: '30px', width: '30px' }} />
        }
    ], [pagamentos, removePagamento]);

    return (
        <div className="checkout-container fade-in">
            <div className="checkout-left">
                <ResumoLateral 
                    itensAgrupados={itensAgrupados}
                    resumo={resumo}
                    incluirTaxa={incluirTaxa}
                    toggleTaxa={toggleTaxa}
                    descontoDigitado={descontoDigitado}
                    changeDesconto={changeDesconto}
                />
            </div>
            <div className="checkout-right">
                
                <div className={`valor-painel ${resumo.troco > 0 ? 'status-troco' : (resumo.faltaPagar === 0 ? 'status-quitado' : 'status-devedor')}`}>
                    <div className="painel-titulo">
                        {resumo.troco > 0 ? 'Troco a Devolver' : (resumo.faltaPagar === 0 ? 'Conta Paga' : 'Falta Pagar')}
                    </div>
                    <div className="painel-numero">
                        {formatCurrency(resumo.troco > 0 ? resumo.troco : resumo.faltaPagar)}
                    </div>
                </div>
                {(resumo.faltaPagar > 0.005 || pagamentos.length === 0) && (
                    <form onSubmit={addPagamento}>
                        <div className="metodos-grid">
                            {[
                                { id: 'DINHEIRO', label: 'Dinheiro', icon: Banknote },
                                { id: 'PIX', label: 'Pix', icon: Wallet },
                                { id: 'CARTAO_CREDITO', label: 'Crédito', icon: CreditCard },
                                { id: 'CARTAO_DEBITO', label: 'Débito', icon: CreditCard },
                            ].map((m) => (
                                <Button 
                                    key={m.id} type="button" variant={metodoSelecionado === m.id ? "primary" : "outline"}
                                    onClick={() => setMetodo(m.id)} style={{ justifyContent: 'flex-start' }} icon={m.icon}
                                >{m.label}</Button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <Input type="number" step="0.01" placeholder="R$ 0,00" value={valorInput}
                                    onChange={e => setValor(e.target.value)} onFocus={(e) => e.target.select()}
                                    style={{ height: '42px', fontSize: '1.1rem', fontWeight: 'bold' }}
                                />
                            </div>
                            <Button type="submit" style={{ width: '120px' }}>Lançar</Button>
                        </div>
                    </form>
                )}
                <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                     <h5 className="text-muted">Pagamentos Lançados</h5>
                     <Table 
                        columns={columnsPagamentos} 
                        data={pagamentos} 
                        keyExtractor="id" 
                        maxHeight="100%" 
                        emptyMessage="Nenhum pagamento." 
                     />
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', gap: '15px' }}>
                    <Button variant="ghost" onClick={onReabrir} icon={RotateCcw}
                        style={{ flex: 1, borderColor: 'var(--border-color)', border: '1px solid', height: '48px', fontWeight: 700 }}
                    >Reabrir</Button>

                    <Button variant="success" onClick={confirmar} disabled={resumo.faltaPagar > 0.005 || loading}
                        style={{ flex: 2, height: '48px', fontWeight: 700, textTransform: 'uppercase' }}
                        isLoading={loading} icon={CheckCircle}
                    >{resumo.troco > 0 ? 'Concluir (Troco)' : 'Concluir Venda'}</Button>
                </div>
            </div>
        </div>
    );
}