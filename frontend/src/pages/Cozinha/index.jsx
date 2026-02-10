import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useKDS } from "../../hooks/useKDS"; 
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import KDSTicket from "../../components/kds/KDSTicket";
import KDSControls from "../../components/kds/KDSControls";
import { ChefHat, ArrowLeft, Coffee, Clock } from "lucide-react";
import "./styles.css";

function HeaderClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="header-clock">
            <Clock size={18} />
            <span>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
}

export default function Cozinha() {
    const navigate = useNavigate();
    const { pedidos, setores, marcarComoPronto, loading } = useKDS();
    const [filtroSetor, setFiltroSetor] = useState("TODOS");
    const ticketsOrdenados = useMemo(() => {
        const itensFiltrados = filtroSetor === "TODOS" 
            ? pedidos 
            : pedidos.filter(p => p.setor === filtroSetor);
        const mapaTickets = {};

        itensFiltrados.forEach(item => {
            const chaveTicket = item.pedidoId || item.id; 

            if (!mapaTickets[chaveTicket]) {
                mapaTickets[chaveTicket] = {
                    id: chaveTicket,
                    numeroMesa: item.numeroMesa,
                    itens: [],
                    timestamp: item.pedidoId || 0 
                };
            }
            mapaTickets[chaveTicket].itens.push(item);
        });
        const listaTickets = Object.values(mapaTickets);

        listaTickets.sort((ticketA, ticketB) => {
            return ticketA.timestamp - ticketB.timestamp;
        });

        return listaTickets;

    }, [pedidos, filtroSetor]);
    const totalItensPendentes = pedidos.length;

    return (
        <div className="kds-page fade-in">
            <Header 
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Produção</span>
                        {totalItensPendentes > 0 && (
                            <span className="header-badge-count">
                                {totalItensPendentes} pendentes
                            </span>
                        )}
                    </div>
                }
                
                center={
                    <span>Gerenciamento de Pedidos em Tempo Real</span>
                }

                subtitle={null}
                fullWidth={true} 
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    
                    <HeaderClock />
                    
                    <div className="divider-vertical" />

                <Button variant="outline" onClick={() => navigate('/')} icon={ArrowLeft}>
                    Voltar
                </Button>
                </div>
            </Header>
            <div className="kds-container" style={{ maxWidth: '100%', padding: '24px' }}>
                <KDSControls 
                    setores={setores} 
                    filtroAtual={filtroSetor} 
                    setFiltro={setFiltroSetor} 
                />
                {loading && (
                    <div className="kds-empty"><p>Sincronizando pedidos...</p></div>
                )}
                {!loading && ticketsOrdenados.length === 0 && (
                    <div className="kds-empty">
                        <div className="icon-wrapper">
                            {filtroSetor === 'Bar' ? <Coffee size={48} /> : <ChefHat size={48} />}
                        </div>
                        <h3>Tudo em dia!</h3>
                        <p>Nenhum pedido pendente em {filtroSetor.toLowerCase()}.</p>
                    </div>
                )}
                <div className="kds-grid">
                    {ticketsOrdenados.map((ticket) => (
                        <KDSTicket 
                            key={ticket.id} 
                            numeroMesa={ticket.numeroMesa} 
                            itens={ticket.itens} 
                            onConcluirItem={marcarComoPronto} 
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}