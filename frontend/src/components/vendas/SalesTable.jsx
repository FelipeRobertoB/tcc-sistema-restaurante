import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Table from "../ui/Table";

import { formatCurrency, formatPaymentMethod } from "../../utils/format";

export default function SalesTable({ vendas, loading }) {
    const columns = useMemo(() => [
        {
            header: "Data",
            width: "12%",
            render: (row) => (
                <div className="text-muted" style={{ lineHeight: '1.2' }}>
                    <div style={{ fontWeight: 500 }}>
                        {row.dataHora ? new Date(row.dataHora).toLocaleDateString('pt-BR') : '-'}
                    </div>
                    <div style={{ fontSize: '0.85em' }}>
                        {row.dataHora ? new Date(row.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </div>
                </div>
            )
        },
        {
            header: "Mesa",
            width: "8%",
            align: "center",
            render: (row) => (
                <span className="badge-mesa">
                    {row.idMesaOrigem || row.numeroMesa || 'B'}
                </span>
            )
        },
        {
            header: "Pagamento",
            width: "20%",
            render: (row) => (
                <div className="pgto-list">
                    {row.pagamentos?.map((p, i) => {
                        const metodoRaw = p.split(':')[0]; 
                        
                        return (
                            <span key={i} className="badge-pgto">
                                {formatPaymentMethod(metodoRaw)}
                            </span>
                        );
                    })}
                </div>
            )
        },
        {
            header: "Subtotal",
            align: "right",
            width: "12%",
            render: (row) => {
                const subtotal = row.valorTotal || row.total || 0;
                return <span className="text-muted">{formatCurrency(subtotal)}</span>;
            }
        },
        {
            header: "Desc.",
            align: "right",
            width: "12%",
            render: (row) => {
                const desconto = row.desconto || 0;
                return desconto > 0 
                    ? <span style={{ color: '#ef4444', fontSize: '0.9em' }}>- {formatCurrency(desconto)}</span>
                    : <span className="text-muted" style={{ opacity: 0.5 }}>{formatCurrency(0)}</span>;
            }
        },
        {
            header: "Taxa",
            align: "right",
            width: "12%",
            render: (row) => {
                const taxa = row.taxaServico || 0;
                return taxa > 0 
                    ? <span style={{ color: '#f59e0b', fontSize: '0.9em' }}>+ {formatCurrency(taxa)}</span>
                    : <span className="text-muted" style={{ opacity: 0.5 }}>{formatCurrency(0)}</span>;
            }
        },
        {
            header: "Total Final",
            align: "right",
            width: "14%",
            render: (row) => {
                const subtotal = row.valorTotal || row.total || 0;
                const final = row.valorFinal !== undefined ? row.valorFinal : subtotal;
                return (
                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.05em' }}>
                        {formatCurrency(final)}
                    </span>
                );
            }
        }
    ], []);

    return (
        <Card className="table-card">
            <CardHeader>
                <CardTitle>Detalhamento ({vendas.length})</CardTitle>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
                <Table 
                    columns={columns}
                    data={vendas}
                    keyExtractor="id"
                    emptyMessage={loading ? "Carregando..." : "Nenhuma venda no período."}
                    maxHeight="500px"
                />
            </CardContent>
        </Card>
    );
}