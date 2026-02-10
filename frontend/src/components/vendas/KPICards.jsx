import { DollarSign, TrendingUp, Percent, CreditCard } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

const formatMoney = (val) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function KPICards({ resumo }) {
    return (
        <div className="kpi-grid">
            <Card className="kpi-card highlight-card">
                <CardContent className="kpi-content">
                    <div className="kpi-icon"><DollarSign size={24} /></div>
                    <div>
                        <span className="kpi-label">Faturamento Líquido</span>
                        <h3 className="kpi-value">{formatMoney(resumo.liquido)}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card className="kpi-card">
                <CardContent className="kpi-content">
                    <div className="kpi-icon"><TrendingUp size={24} /></div>
                    <div>
                        <span className="kpi-label">Ticket Médio</span>
                        <h3 className="kpi-value">{formatMoney(resumo.ticketMedio)}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card className="kpi-card">
                <CardContent className="kpi-content">
                    <div className="kpi-icon warning"><Percent size={24} /></div>
                    <div>
                        <span className="kpi-label">Taxa Serviço</span>
                        <h3 className="kpi-value">{formatMoney(resumo.taxas)}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card className="kpi-card">
                <CardContent className="kpi-content">
                    <div className="kpi-icon info"><CreditCard size={24} /></div>
                    <div>
                        <span className="kpi-label">Vendas Realizadas</span>
                        <h3 className="kpi-value">{resumo.qtdVendas}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}