import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import "./styles.css"; 
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import MesaDetalhes from "../../components/dashboard/MesaDetalhes"; 
import DashboardControls from "../../components/dashboard/DashboardControls";
import MesaGrid from "../../components/dashboard/MesaGrid";
import { ChefHat, BarChart3, Settings, Menu, X } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();

    const { mesas, carregarMesas, acessarMesaPorNumero, loading } = useDashboard();
    const [mesaSelecionada, setMesaSelecionada] = useState(null);
    const [inputNumero, setInputNumero] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("TODAS");
    const [menuMobileOpen, setMenuMobileOpen] = useState(false);
    const handleAcessoRapido = async (e) => {
        if(e) e.preventDefault();
        const mesa = await acessarMesaPorNumero(inputNumero);
        if (mesa) {
            setMesaSelecionada(mesa);
            setInputNumero("");
        }
    };

    const stats = useMemo(() => ({
        total: mesas.length,
        livres: mesas.filter(m => m.status === 'LIVRE').length,
        ocupadas: mesas.filter(m => m.status === 'ABERTA').length,
        pagando: mesas.filter(m => m.status === 'FECHADA').length
    }), [mesas]);

    const mesasFiltradas = useMemo(() => {
        if (filtroStatus === 'TODAS') return mesas;
        if (filtroStatus === 'LIVRES') return mesas.filter(m => m.status === 'LIVRE');
        if (filtroStatus === 'OCUPADAS') return mesas.filter(m => m.status === 'ABERTA');
        if (filtroStatus === 'PAGANDO') return mesas.filter(m => m.status === 'FECHADA');
        return mesas;
    }, [mesas, filtroStatus]);
    
    const handleNavigate = (path) => {
        setMenuMobileOpen(false);
        navigate(path);
    };

    return (
        <div className="fade-in dashboard-page">

            <Header 
                title="PDV" 
                subtitle={null}
                center={
                    <span>Gestão de Mesas</span>
                }
                fullWidth={true} 
            >
                <div className="header-actions-wrapper">

                    <div className="desktop-nav">
                        <Button 
                            onClick={() => navigate('/cozinha')} 
                            variant="outline"
                            icon={ChefHat}
                            style={{ borderColor: 'var(--success)', color: 'var(--success)' }} 
                        >
                            Cozinha
                        </Button>

                        <Button 
                            onClick={() => navigate('/vendas')} 
                            variant="outline"
                            icon={BarChart3}
                        >
                            Relatórios
                        </Button>

                        <Button 
                            onClick={() => navigate('/admin')} 
                            variant="outline"
                            icon={Settings}
                        >
                            Admin
                        </Button>
                    </div>

                    <button 
                        className="mobile-menu-btn"
                        onClick={() => setMenuMobileOpen(!menuMobileOpen)}
                    >
                        {menuMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>
            </Header>
            {menuMobileOpen && (
                <div className="mobile-menu-dropdown fade-in">
                    <Button 
                        onClick={() => handleNavigate('/cozinha')} 
                        variant="ghost" 
                        icon={ChefHat}
                        className="w-full justify-start"
                        style={{ color: 'var(--success)' }}
                    >
                        Cozinha (KDS)
                    </Button>
                    
                    <Button 
                        onClick={() => handleNavigate('/vendas')} 
                        variant="ghost" 
                        icon={BarChart3}
                        className="w-full justify-start"
                    >
                        Relatórios
                    </Button>
                    
                    <Button 
                        onClick={() => handleNavigate('/admin')} 
                        variant="ghost" 
                        icon={Settings}
                        className="w-full justify-start"
                    >
                        Administração
                    </Button>
                </div>
            )}
            <div className="dashboard-container" style={{ maxWidth: '100%' }}>
                
                <DashboardControls 
                    inputValue={inputNumero}
                    setInputValue={setInputNumero}
                    onSearch={handleAcessoRapido}
                    filtroAtual={filtroStatus}
                    setFiltro={setFiltroStatus}
                    stats={stats}
                />

                <div className="widget-mesas-container">
                    <MesaGrid 
                        mesas={mesasFiltradas}
                        loading={loading}
                        onSelect={setMesaSelecionada}
                    />
                </div>

                {mesaSelecionada && (
                    <MesaDetalhes 
                        mesa={mesaSelecionada} 
                        onClose={() => setMesaSelecionada(null)}
                        onUpdate={carregarMesas} 
                    />
                )}
            </div>
        </div>
    );
}