import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

const formatMoney = (val) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PaymentChart({ data }) {
    return (
        <Card className="chart-card">
            <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="chart-container">
                    {data.length === 0 ? (
                        <p className="text-muted">Sem dados.</p>
                    ) : (
                        data.map((item) => (
                            <div key={item.nome} className="chart-row">
                                <div className="chart-labels">
                                    <span>{item.nome}</span>
                                    <span>{formatMoney(item.valor)}</span>
                                </div>
                                <div className="progress-bg">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${item.porcentagem}%` }} 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}