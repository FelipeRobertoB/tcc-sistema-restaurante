import { useNavigate } from "react-router-dom";
import { useVendas } from "../../hooks/useVendas";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Filters from "../../components/vendas/Filters";
import KPICards from "../../components/vendas/KPICards";
import PaymentChart from "../../components/vendas/PaymentChart";
import SalesTable from "../../components/vendas/SalesTable";
import "./styles.css";
import "../../components/vendas/components.css";

export default function Vendas() {
    const navigate = useNavigate();
    const { 
        vendas, loading, 
        dataInicio, setDataInicio, 
        dataFim, setDataFim, 
        resumo 
    } = useVendas();

    return (
        <div className="vendas-page fade-in">
            <Header 
                title="Relatórios" 
                center={<span>Histórico de Vendas</span>}
                fullWidth={true}
            >
                <Button variant="outline" onClick={() => navigate('/')} icon={ArrowLeft}>
                    Voltar
                </Button>
            </Header>

            <div className="vendas-container">

                <Filters 
                    dataInicio={dataInicio} setDataInicio={setDataInicio}
                    dataFim={dataFim} setDataFim={setDataFim}
                />

                <KPICards resumo={resumo} />

                <div className="content-split">
                    <PaymentChart data={resumo.metodosOrdenados} />
                    <SalesTable vendas={vendas} loading={loading} />
                </div>
            </div>
        </div>
    );
}