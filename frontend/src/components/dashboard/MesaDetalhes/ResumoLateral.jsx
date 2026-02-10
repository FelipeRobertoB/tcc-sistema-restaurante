import { useMemo } from "react";
import Input from "../../ui/Input";
import Table from "../../ui/Table";
import { Card } from "../../ui/Card";
import { formatCurrency } from "../../../utils/format";

export default function ResumoLateral({ itensAgrupados, resumo, incluirTaxa, toggleTaxa, descontoDigitado, changeDesconto }) {
    const columnsResumo = useMemo(() => [
        { header: "Qtd", accessor: "quantidade", width: "15%", align: "center" },
        { header: "Produto", width: "55%", render: (i) => <span style={{fontWeight: 500}}>{i.nomeProduto || i.produto?.nome}</span> },
        { header: "Total", width: "30%", align: "right", render: (i) => <strong>{formatCurrency(i.totalAgrupado)}</strong> }
    ], []);

    return (
        <div className="checkout-left">
            <h4 style={{ marginBottom: '15px', paddingLeft: '4px' }}>Resumo do Consumo</h4>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
                <Table columns={columnsResumo} data={itensAgrupados} keyExtractor={(i) => i.idItem || Math.random()} maxHeight="100%" emptyMessage="Nenhum item." />
            </div>

            <Card className="checkout-finance-card">
                <div className="finance-row">
                    <span>Subtotal</span><span>{formatCurrency(resumo.subtotal)}</span>
                </div>
                <div className="finance-row" style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label className="switch-container">
                            <input type="checkbox" className="switch-input" checked={incluirTaxa} onChange={toggleTaxa} />
                            <span className="switch-slider"></span>
                        </label>
                        <span style={{ cursor:'pointer' }} onClick={toggleTaxa}>Taxa (10%)</span>
                    </div>
                    <span>{formatCurrency(resumo.valorTaxa)}</span>
                </div>
                <div className="finance-row" style={{ marginTop: '8px' }}>
                    <span style={{ color: 'var(--danger)' }}>Desconto</span>
                    <div style={{ width: '100px' }}>
                        <Input 
                            type="number" placeholder="0,00" value={descontoDigitado} onChange={changeDesconto}
                            style={{ textAlign: 'right', borderColor: 'var(--danger)', color: 'var(--danger)', height: '32px', padding: '0 8px' }}
                        />
                    </div>
                </div>
                <div className="finance-row total">
                    <span>TOTAL FINAL</span><span style={{ color: 'var(--primary)' }}>{formatCurrency(resumo.totalLiquido)}</span>
                </div>
            </Card>
        </div>
    );
}